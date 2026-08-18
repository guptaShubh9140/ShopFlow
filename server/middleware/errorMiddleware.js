const errorHandler = (err, req, res, next) => {
  // Log detailed error on server
  console.error("ERROR:", err);

  // Request body too large
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request body is too large",
    });
  }

  const statusCode =
    res.statusCode >= 400
      ? res.statusCode
      : 500;

  // Development
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      message:
        err.message || "Something went wrong",

      stack: err.stack,
    });
  }

  // Production
  return res.status(statusCode).json({
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message || "Request failed",
  });
};

module.exports = errorHandler;