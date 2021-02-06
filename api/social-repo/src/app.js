const express = require('express');
const usersRouter = require('./routes/users');

module.exports = () => {
  // create express instance
  const app = express();

  app.use(express.json());

  // routes is in routes folder
  app.use(usersRouter);

  return app;
};
