const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

let activeUsers = 0; // Track active user count

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Connected...');
    
    activeUsers++; // Increment active users count
    
    io.emit('activeUsers', activeUsers); // Emit active user count to all clients

    socket.on('userJoined', (data) => {
        const userJoinedMessage = `${data.userName} joined the chat room`;
        io.emit('message', { user: 'System', message: userJoinedMessage });
    });

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });

    socket.on('deleteMessage', (data) => {
        const { messageId, userName } = data;
        
        io.emit('messageDeleted', messageId, userName);
    });

    socket.on('disconnect', () => {
        activeUsers--; // Decrement active users count on disconnect
        io.emit('activeUsers', activeUsers); // Emit updated count to all clients
    });
});