const db = require("../db/connection.js");


exports.selectReviews = () => {
  return db.query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`)
  .then(({ rows: reviews }) => {
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

exports.selectCommentsByReviewId = (review_id)=>{
  return db.query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id]).then((rows)=>{
    console.log(Object.keys(rows), "<<<<<<<<<<<<<<<<<<<<<< rows obj")
    return {rows: comments}
  })
}