const db = require("../db/connection.js");
const format = require("pg-format");

exports.selectReviews = (category, sort_by = "created_at", order = "DESC") => {
  let sql = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id) 
  AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  if (category !== undefined) {
    sql += format(` WHERE reviews.category = %L`, category);
  }

  sql += format(` GROUP BY reviews.review_id ORDER BY reviews.%I `, sort_by);

  if (order.toUpperCase() === "ASC") {
    sql += order.toUpperCase();
  } else {
    sql += "DESC";
  }

  sql += ";";

  return db.query(sql).then(({ rows: reviews }) => {
    return { reviews };
  });
};

exports.selectReviewsById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows: review }) => {
      if (!{ review: review }.review[0]) {
        return Promise.reject({ msg: "Not found" });
      }
      return { review: review[0] };
    });
};

exports.selectCommentsByReviewId = (review_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [review_id]
    )
    .then(({ rows: comments }) => {
      return { comments };
    });
};

exports.checkIfReviewExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return true;
    });
};

exports.insertCommentByReviewId = (review_id, author, body) => {
  return db
    .query(
      `INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, author, review_id]
    )
    .then(({ rows: comment }) => {
      return { comment: comment[0] };
    });
};

exports.updateReviewById = (review_id, inc_votes) => {
  return db
    .query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;`, [
      inc_votes,
      review_id,
    ])
    .then(({ rows: review }) => {
      return { review: review[0] };
    });
};

exports.getVotesByReviewId = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      return Number(rows[0].votes);
    });
};
