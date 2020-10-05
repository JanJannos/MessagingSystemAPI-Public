// Logger middleware - Logs requests to Console
const logger = (req, res, next) => {
  console.log(
    `My Logger : ${req.method} ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }`
  );
  next();
};

module.exports = logger;
