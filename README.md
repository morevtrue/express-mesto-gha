# Проект `express-mesto-gha`

## Описание

Репозиторий для бэкенда проекта `Mesto`.

Функционал: Обработка приходящих на сервер данных от фронтенда, роутинг, хранение данных в базе.

## Используемый стек технологий: 
<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original-wordmark.svg" title="NodeJS" alt="NodeJS" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/git/git-original-wordmark.svg" title="Git" alt="Git" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/mongodb/mongodb-original-wordmark.svg" title="mongodb" alt="mongodb" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/express/express-original-wordmark.svg" title="express" alt="express" width="40" height="40"/>&nbsp;
</div>

## Развёртывание приложения

Запустить `MongoDB Compass` на своём компьютере, ввести команду `mongod` в терминале, после ввести команду `npm run dev`. 

Отправлять запросы на `http://localhost:3000` в бэкенд при помощи программы `Postman`:

`POST /signup` — регистрация пользователя

`POST /signin` — авторизация пользователя

`GET /users/me` — возвращает информацию о текущем пользователе

`GET /users` — возвращает всех пользователей

`GET /users/:userId` - возвращает пользователя по _id

`GET /cards` — возвращает все карточки

`POST /cards` — создаёт карточку

`DELETE /cards/:cardId` — удаляет карточку по идентификатору 

`PATCH /users/me` — обновляет профиль

`PATCH /users/me/avatar` — обновляет аватар

`PUT /cards/:cardId/likes` — поставить лайк карточке

`DELETE /cards/:cardId/likes` — убрать лайк с карточки


## Системные требования

GIT v2.33.0, NodeJS v16.16.0, ReactJS v5.0.1, MongoDB v4.4.23
