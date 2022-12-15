const {
  selectReviews,
  selectReviewsById,
  selectCommentsByReviewId,
  checkIfReviewExists,
  insertCommentByReviewId,
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
  checkIfReviewExists(req.params.review_id)
    .then(() => {
      return selectCommentsByReviewId(req.params.review_id);
    })
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByReviewId = (req, res, next) => {
  const author = req.body.author;
  const body = req.body.body;
  const review_id = req.params.review_id;
  insertCommentByReviewId(review_id, author, body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};
