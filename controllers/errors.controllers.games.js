exports.handle404Paths = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handle400Paths = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handle404Messages = (err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(404).send(err);
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
};

exports.handle500Paths = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server error" });
};
