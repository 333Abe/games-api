const express = require("express");
const { getReviews } = require("../controllers/controllers.games.js");

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);

module.exports = reviewsRouter