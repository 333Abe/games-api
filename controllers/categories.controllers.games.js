const { selectCategories } = require("../models/categories.models.games");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send(categories);
  });
};
