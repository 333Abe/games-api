const db = require("../db/connection.js");
const format = require("pg-format");

exports.removeCommentById = (comment_id) => {
  let sql = format(`DELETE FROM COMMENTS WHERE comment_id = %L`, comment_id);
  return db.query(sql).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ msg: "Not found" });
    }
    return result.rowCount;
  });
};
