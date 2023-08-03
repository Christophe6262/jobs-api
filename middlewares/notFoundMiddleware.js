const { StatusCodes } = require("http-status-codes");

const notFoundMiddleware = (_req, res) =>
  res.status(404).json({ msg: "la route n'exixte pas" });

module.exports = notFoundMiddleware;
