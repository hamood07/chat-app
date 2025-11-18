# Chat App Backend (Node.js)


This backend provides:
- User register/login (JWT)
- Socket.IO real-time messaging
- Direct messages and room messages
- MongoDB persistence


## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`
3. Run dev: `npm run dev` (requires nodemon)
4. Run production: `npm start`


## Socket usage (client side)
Connect with Socket.IO client and attach token in `auth` handshake:


```js
const socket = io('http://localhost:5000', {
auth: { token: 'BearerTokenHere' }
});
```


When connected you can emit:
- `join-room` with room name
- `leave-room` with room name
- `message:send` with `{ to, room, text }`


Listen for:
- `message:receive` (message object)
- `typing` (typing indicator)




// ==== NOTES ====
// - This is a minimal but production-oriented starting point. Add rate limiting, validation, CSRF protections, role-based access, pagination, and tests for production.
// - If you want, I can also add: Dockerfile, docker-compose.yml, frontend example, or Kubernetes manifests.
