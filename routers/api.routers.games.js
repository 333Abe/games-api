const express = require("express");
const categoriesRouter = require("./categories.routers.games.js");
const reviewsRouter = require("./reviews.routers.games.js");

const apiRouter = express.Router();

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
