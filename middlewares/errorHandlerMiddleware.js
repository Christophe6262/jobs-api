const errorHandlerMiddleware = (err, _req, res, _next) => {
  console.log(err);
  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || "une erreur s'est produite",
  };

  if (err.code && err.code === "23505") {
    customError.msg = `${err.detail}. veuiilez choisir une autre adresse email `;
    customError.statusCode = statusCodes.BAD_REQUEST;
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
