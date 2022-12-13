const express = require("express");
const {
  getReviews,
  getReviewsById,
} = require("../controllers/reviews.controllers.games");

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewsById);

module.exports = reviewsRouter;
