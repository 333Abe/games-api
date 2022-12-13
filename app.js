const express = require("express");
const app = express();
const {
  handle404Paths,
  handle400Paths,
  handle404Messages,
  handle500Paths,
} = require("./controllers/errors.controllers.games");
const apiRouter = require("./routers/api.routers.games.js");

app.use("/api", apiRouter);

app.all("*", handle404Paths);
app.use(handle400Paths);
app.use(handle404Messages);
app.use(handle500Paths);

module.exports = app;
