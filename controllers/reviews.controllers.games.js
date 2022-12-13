const { selectReviews } = require("../models/reviews.models.games");

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.status(200).send(reviews);
  });
};
