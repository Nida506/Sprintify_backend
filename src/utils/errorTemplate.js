const errorTemplate = (res, statusCode = 400, message = "Something went wrong") => {
    return res.status(statusCode).json({
      error: true,
      message,
    });
  };
  
  module.exports = { errorTemplate };
  