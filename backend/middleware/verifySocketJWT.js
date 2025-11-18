const jwt = require("jsonwebtoken");

const verifySocketJWT = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
};

module.exports = verifySocketJWT;

