const {
  selectReviews,
  selectReviewsById,
  selectCommentsByReviewId,
  checkIfReviewExists,
  insertCommentByReviewId,
  updateReviewById,
  getVotesByReviewId,
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

exports.patchReviewById = (req, res, next) => {
  const review_id = req.params.review_id;
  let inc_votes = req.body.inc_votes;
  console.log(inc_votes, "<<<<<<<<<<<<<<<<<<< inc_votes, controller");
  getVotesByReviewId(review_id)
    .then((votes) => {
      inc_votes += votes;
      console.log(
        inc_votes,
        "<<<<<<<<<<<<<<<<<<< inc_votes + votes, controller"
      );
      return updateReviewById(review_id, inc_votes);
    })
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
