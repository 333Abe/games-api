const express = require("express");
const { getReviews } = require("../controllers/reviews.controllers.games");

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);

module.exports = reviewsRouter