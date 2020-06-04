const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const moment = require('moment');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app  = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('new User Connected');

    socket.emit('userText', {
        from : 'Admin',
        text : 'Welcome To Chart App'
    });

    socket.broadcast.emit('welcomeMessage', {
        admin : 'Admin',
        text : 'New User Joined',
        time : new Date().getTime()
    });

    socket.on('createMessage', function(fromClient, callback){
        console.log(fromClient);
        io.emit('response', {
            from : fromClient.from,
            text : fromClient.text,
            time : new Date().getTime()
        }); 
        callback();
    });

    socket.on('createLocationMessage', function(geoLocation_Data){
        socket.broadcast.emit('geolocation_Message', {
            from : 'Admin',
            url : `https://www.google.com/maps?q=${geoLocation_Data.latitude},${geoLocation_Data.longitude}`,
            createdAt : new Date().getTime()
        });
});
   
       /*socket.emit('replyToClient',/* {
        from : 'Admin',
        text : 'welcome to the chart app',
        time : new Date().getTime()
    }
     generateMessage('admin', 'Welcome To Chart App')   
    );

    socket.broadcast.emit('excludeUser', {
        from : 'Admin',
        text : 'New User Joined',
        time : new Date().getTime()
    }
    generateMessage('admin', 'new User Joined')
    );

   socket.on('createNewEmail', (newEmail)=>{
        console.log(newEmail);
        io.emit('newMessage', {
            from : newEmail.from,
            text : newEmail.text,
            createdAT : new Date().getTime()
        }
        generateMessage(newEmail.from, newEmail.text)
        );
        // socket.broadcast.emit('newMessage',{
        //     from : newEmail.from,
        //     text : newEmail.text,
        //     createdAT : new Date().getTime()
        // });
   });*/
   socket.on('disconnect', ()=>{
    console.log('User was disconnected');
    socket.broadcast.emit('goodByeMessage',{
        admin : 'Admin',
        text : 'User Left'
    
    });
});
});

server.listen(port, ()=>{
    console.log(`Server is up ${port}`);
}); 