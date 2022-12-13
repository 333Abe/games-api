const db = require("../db/connection.js");

exports.selectReviews = () => {
  return db.query(`SELECT * FROM reviews;`).then(({ rows: reviews }) => {
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
