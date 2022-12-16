const {
  selectReviews,
  selectReviewsById,
  selectCommentsByReviewId,
  checkIfReviewExists,
  insertCommentByReviewId,
  updateReviewById,
  getVotesByReviewId,
} = require("../models/reviews.models.games");

const { checkIfCategoryExists } = require("../models/categories.models.games");

exports.getReviews = (req, res, next) => {
  let { category, sort_by, order } = req.query;
  const validSortBys = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];
  const validOrders = ["DESC", "ASC"];
  if (order !== undefined) order = order.toUpperCase();
  if (order === undefined) order = "DESC";
  if (sort_by === undefined) sort_by = "created_at";

  if (!validOrders.includes(order) || !validSortBys.includes(sort_by)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    checkIfCategoryExists(category)
      .then(() => {
        return selectReviews(category, sort_by, order);
      })
      .then((reviews) => {
        res.status(200).send(reviews);
      })
      .catch((err) => {
        next(err);
      });
  }
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
  checkIfReviewExists(review_id)
    .then(() => {
      return getVotesByReviewId(review_id);
    })
    .then((votes) => {
      inc_votes += votes;
      return updateReviewById(review_id, inc_votes);
    })
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err);
    });
};
