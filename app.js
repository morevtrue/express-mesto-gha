const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('./controllers/users');
const { validateUserBody, validateAuthentification } = require('./middlewares/validations');
const { errorHandler } = require('./middlewares/error-handler');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors/not-found-error');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.json());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.post('/signin', validateUserBody, login);
app.post('/signup', validateAuthentification, createUser);

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res, next) => next(new NotFoundError('неправильно указан путь')));

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${PORT}`);
});
