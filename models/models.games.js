const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return { categories };
  });
};

exports.selectReviews = () => {
  return db.query(`SELECT * FROM reviews;`).then(({ rows: reviews }) => {
    return { reviews };
  });
};