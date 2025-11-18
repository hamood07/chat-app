const User = require('../models/User');
const Message = require('../models/Message');

module.exports = (io, socket, userId) => {
    console.log(`Socket connected: ${socket.id}, user: ${userId}`);

    // User joins their personal room
    socket.join(`user:${userId}`);

    // Join a group room
    socket.on('room:join', (room) => {
        socket.join(`room:${room}`);
        console.log(`User ${userId} joined room ${room}`);
    });

    // Leave a room
    socket.on('room:leave', (room) => {
        socket.leave(`room:${room}`);
        console.log(`User ${userId} left room ${room}`);
    });

    // Handle sending messages
    socket.on('message:send', async (payload) => {
        try {
            const msg = new Message({
                from: userId,
                to: payload.to || null,
                room: payload.room || null,
                text: payload.text
            });

            await msg.save();
            const populated = await msg.populate('from', 'username avatar');

            if (payload.room) {
                // Broadcast to room
                io.to(`room:${payload.room}`).emit('message:receive', populated);

            } else if (payload.to) {
                // Direct message
                io.to(`user:${payload.to}`).emit('message:receive', populated);
                io.to(`user:${userId}`).emit('message:receive', populated);
            }
        } catch (err) {
            console.error('message send error', err);
            socket.emit('message:error', { message: 'Failed to send' });
        }
    });

    // Typing indicator
    socket.on('typing', (data) => {
        if (data.room)
            io.to(`room:${data.room}`).emit('typing', { user: userId });

        if (data.to)
            io.to(`user:${data.to}`).emit('typing', { user: userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        User.findByIdAndUpdate(userId, { online: false }).exec();
    });
};

