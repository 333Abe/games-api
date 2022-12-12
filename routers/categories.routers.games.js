const express = require("express");
const { getCategories } = require("../controllers/controllers.games.js");

const categoriesRouter = express.Router();

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
