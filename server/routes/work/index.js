const router = require('express').Router();
const Model = require('mongoose').model('work');

const { isAuth } = require('@auth');
const crud = require('@contr/crud');

router.get('/', (req, res) => {
  crud.getItems(Model, res, { title: 1 });
});

router.post('/', isAuth, (req, res) => {
  const { title, link, image, techs } = req.body;
  crud.createItem(
    Model,
    {
      title,
      link,
      image,
      techs,
    },
    res,
  );
});

router.put('/:id', isAuth, (req, res) => {
  const { title, link, image, techs } = req.body;
  crud.updateItem(
    Model,
    req.params.id,
    {
      title,
      link,
      image,
      techs,
    },
    res,
  );
});

router.delete('/:id', isAuth, (req, res) => {
  crud.deleteItem(Model, req.params.id, res);
});

module.exports = router;
