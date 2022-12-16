const { selectUsers } = require("../models/users.models.games");

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send(users);
  });
};
