const express = require("express");
const categoriesRouter = require("./categories.routers.games.js");
const reviewsRouter = require("./reviews.routers.games.js");
const usersRouter = require("./users.routers.games");
const commentsRouter = require("./comments.routers.games");

const apiRouter = express.Router();

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
