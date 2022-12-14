const {
  selectReviews,
  selectReviewsById,
  selectCommentsByReviewId,
} = require("../models/reviews.models.games");

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.status(200).send(reviews);
  });
};

exports.getReviewsById = (req, res, next) => {
  selectReviewsById(req.params.review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  selectCommentsByReviewId(req.params.review_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};
