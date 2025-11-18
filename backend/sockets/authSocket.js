const jwt = require('jsonwebtoken');
require('dotenv').config();


// socket middleware to verify JWT token passed in handshake auth
const verifySocketJWT = (socket, next) => {
const token = socket.handshake.auth && socket.handshake.auth.token;
if (!token) return next(new Error('Authentication error: token missing'));
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
socket.user = payload; // attach user info to socket
next();
} catch (err) {
next(new Error('Authentication error: invalid token'));
}
};


module.exports = { verifySocketJWT };
