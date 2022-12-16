const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return { categories };
  });
};

exports.checkIfCategoryExists = (category) => {
  return db
    .query(`SELECT * FROM categories WHERE slug = $1;`, [category])
    .then(({ rowCount }) => {
      if (category === undefined) return true;
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return true;
    });
};
