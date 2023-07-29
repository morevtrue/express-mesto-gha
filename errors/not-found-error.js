class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

// const notFoundErr = (err, res) => {
//   const { message } = err;
//   const statusCode = 404;
//   res.status(statusCode).json({
//     status: 'error-404',
//     statusCode: this.statusCode,
//     message,
//   });
// };

module.exports = {
  NotFoundError,
  // notFoundErr,
};
