const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app  = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('new User Connected');

   socket.on('createNewEmail', (newEmail)=>{
        console.log(newEmail);
        io.emit('newMessage', {
            from : newEmail.from,
            text : newEmail.text,
            createdAT : new Date().getTime()
        });
   });

    socket.on('disconnect', ()=>{
        console.log('User was disconnected');
    });
});

server.listen(port, ()=>{
    console.log(`Server is up ${port}`);
}); 