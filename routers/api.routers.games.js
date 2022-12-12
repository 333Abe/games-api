const express = require("express");
const categoriesRouter = require("./categories.routers.games.js");

const apiRouter = express.Router();

apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
