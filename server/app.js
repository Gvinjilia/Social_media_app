const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoSanitizer = require('express-mongo-sanitize');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss');
const { createServer } = require('http');
const { Server } = require('socket.io'); 

const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./controllers/error.controller');

const postRouter = require('./routers/post.router');
const authRouter = require('./routers/auth.router');
const commentRouter = require('./routers/comment.router');
const userRouter = require('./routers/user.router');
const friendRequestRouter = require('./routers/friendRequest.router');
const Group = require('./models/group.model');
const messageRouter = require('./routers/message.router');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://192.168.0.13:8081'],
    credentials: true
}));

app.use(rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests'
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cookieParser());
app.use(express.json());

// app.use(mongoSanitizer());
app.use(helmet());
// app.use(xss());

app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);
app.use('/api/messages', messageRouter);
app.use('/api/friends', friendRequestRouter);

io.on('connection', (socket) => {
    console.log(socket.id, "Connection succesfull");

    socket.on("join-group", async ({ groupId, userId }) => {
        const group = await Group.findById(groupId);

        if(!group){
            return socket.emit("errorMessage", "Group not found");
        }

        const isMember = group.members.some(id => id.toString() == userId.toString());

        if (!isMember) {
            return socket.emit("errorMessage", "You are not a member of this group");
        }

        socket.join(`group:${groupId}`);
        socket.emit('Joined Group', { groupId });
    });

    socket.on('join', (userId) => {
        socket.join(`user:${userId}`);
    });

    socket.on('friend-request', ({ userId, to }) => {
       console.log(`Friend request from: ${userId} to ${to}`);

        io.to(`user:${to}`).emit('new-friendRequest', { from: userId });
    });

    socket.on('accept-request', ({ requestId, to }) => {
        io.to(`user:${to}`).emit('accept-request', requestId);
    });

    socket.on('reject-request', ({ to }) => {
        io.to(`user:${to}`).emit('reject-request');
    });

    socket.on('cancel-request', ({ to }) => {
        io.to(`user:${to}`).emit('cancel-request');
    });

    socket.on('remove-friend', ({ userId }) => {
        io.to(`user:${userId}`).emit('remove-friend');
    });

    socket.on('disconnect', () => {
        console.log('user disconected');
    });
});

app.use(globalErrorHandler);

if(process.env.NODE_ENV === 'dev'){
    app.use(morgan('dev'));
};

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('connected to MongoDB');

        server.listen(process.env.PORT, () => {
            console.log('The server is running on port', process.env.PORT);
        });
    })
    .catch(err => {
        console.log('Error', err);

        process.exit(1);
    });

module.exports = io;