const express = require("express");
const {
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
  postCommentsByReviewId,
} = require("../controllers/reviews.controllers.games");

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewsById);
reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentsByReviewId);

module.exports = reviewsRouter;
