const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Укажите заголовок статьи'],
  },
  body: {
    type: String,
    required: [true, 'Укажите содержимое статьи'],
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Укажите дату публикации'],
  },
});

mongoose.model('post', PostSchema);
