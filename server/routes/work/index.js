const path = require('path');
const router = require('express').Router();
const Model = require('mongoose').model('work');
const { IncomingForm } = require('formidable');
const { waterfall, each } = require('async');
const sharp = require('sharp');
const fs = require('fs');

const { isAuth } = require('@auth');
const crud = require('@contr/crud');
const image = require('@contr/image');

const sliderDir = 'slider';
const sliderBreakpoints = [
  { name: 'xl', height: 525 },
  { name: 'lg', height: 257 },
  { name: 'md', height: 215 },
  { name: 'sm', height: 93 },
];

let curRes;
let curID;
let curMode;
let globalFields;
let globalFiles;

function getImageNameWithID(imageName) {
  return `${curID}_${imageName}`;
}

function uploadSlide(highCB) {
  each(
    sliderBreakpoints,
    (breakpoint, cb) => {
      const resizeUploadPath = path.join(
        image.getUploadPath(),
        breakpoint.name,
      );

      image.makeDir(resizeUploadPath);

      console.log(resizeUploadPath);

      sharp(globalFiles.image.path)
        .resize({
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          height: breakpoint.height,
        })
        .toFile(
          path.join(
            resizeUploadPath,
            getImageNameWithID(globalFiles.image.name),
          ),
          cb,
        );
    },
    (err, info) => {
      if (err) {
        return image.sendMessage(curRes, err, {
          success: 'Изображение успешно добавлено',
          error: 'Не удалось переместить изображение',
        });
      }

      highCB(err, info);
    },
  );
}

function deleteSlide(imageName, highCB) {
  image.setUploadPath(sliderDir);

  console.log('uploadPath: ' + image.getUploadPath());

  each(
    sliderBreakpoints,
    (breakpoint, cb) => {
      const deleteUploadPath = path.join(
        image.getUploadPath(),
        breakpoint.name,
      );

      console.log(deleteUploadPath);

      fs.unlink(path.join(deleteUploadPath, getImageNameWithID(imageName)), cb);
    },
    (err, info) => {
      if (err) {
        return image.sendMessage(curRes, err, {
          success: 'Изображение успешно удалено',
          error: 'Не удалось удалить изображение',
        });
      }

      highCB(err, info);
    },
  );
}

function waterfallCB(err, result) {
  if (err) {
    return crud.sendError(err, curRes, curMode);
  }

  crud.sendResult(result, curRes, curMode);
}

function startWaterfall(withSlideArrayCallbacks) {
  waterfall(withSlideArrayCallbacks, (err, result) => {
    if (globalFiles.image) {
      return image.unlinkImage(globalFiles.image.path, waterfallCB);
    }

    waterfallCB(err, result);
  });
}

function formParse(req, res, mode, withoutSlideCB, withSlideArrayCallbacks) {
  // const { title, link, image, techs } = req.body;

  curRes = res;
  curMode = mode;

  const form = new IncomingForm({
    uploadDir: image.getTempPath(sliderDir),
  });

  console.log('uploadPath: ' + image.getUploadPath());

  form.parse(req, (err, fields, files) => {
    if (err) {
      return crud.sendError(err, curRes, curMode);
    }

    // console.log('fields:', fields);
    // console.log('files:', files);

    globalFields = fields;
    globalFiles = files;

    if (!globalFiles.image) {
      withoutSlideCB();
    } else {
      startWaterfall(withSlideArrayCallbacks);
    }
  });
}

function deleteCB(result, cb) {
  if (result.imageName) {
    deleteSlide(result.imageName, cb);
  } else {
    cb(null, result);
  }
}

router.get('/', (req, res) => {
  crud.getItems(Model, res, { title: 1 });
});

router.post('/', isAuth, (req, res) => {
  formParse(
    req,
    res,
    'insert',
    () => {
      crud.createItem(Model, globalFields, res);
    },
    [
      cb => {
        crud.createItem(Model, globalFields, res, cb);
      },
      (result, cb) => {
        curID = result._id;
        uploadSlide(cb);
      },
    ],
  );
});

router.put('/:id', isAuth, (req, res) => {
  curID = req.params.id;

  formParse(
    req,
    res,
    'update',
    () => {
      crud.updateItem(Model, curID, globalFields, res);
    },
    [
      cb => {
        crud.getItemById(Model, res, curID, {}, {}, cb);
      },
      (result, cb) => {
        deleteCB(result, cb);
      },
      (result, cb) => {
        crud.updateItem(Model, curID, globalFields, res, cb);
      },
      (result, cb) => {
        uploadSlide(cb);
      },
    ],
  );
});

router.delete('/:id', isAuth, (req, res) => {
  curID = req.params.id;
  curRes = res;
  curMode = 'delete';

  startWaterfall([
    cb => {
      crud.getItemById(Model, res, curID, {}, {}, cb);
    },
    (result, cb) => {
      deleteCB(result, cb);
    },
    (result, cb) => {
      crud.deleteItem(Model, curID, res, cb);
    },
  ]);
});

module.exports = router;
