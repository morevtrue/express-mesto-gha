const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64be7d1a131346925403b5da',
  };
  next();
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => res.status(404).send({ message: 'неправильно указан путь' }));

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
