const express = require("express");
const {
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
  postCommentsByReviewId,
  patchReviewById,
} = require("../controllers/reviews.controllers.games");

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewsById).patch(patchReviewById);
reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentsByReviewId);

module.exports = reviewsRouter;
