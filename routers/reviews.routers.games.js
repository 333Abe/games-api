const express = require("express");
const {
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
} = require("../controllers/reviews.controllers.games");

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewsById);
reviewsRouter.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

module.exports = reviewsRouter;
