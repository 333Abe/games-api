const express = require("express");
const { handle404Paths } = require("./controllers/errors.controllers.games");
const apiRouter = require("./routers/api.routers.games.js");

const app = express();

app.use("/api", apiRouter);

app.all("*", handle404Paths);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server error" });
});

module.exports = app;
