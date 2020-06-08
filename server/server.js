const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const moment = require('moment');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app  = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('new User Connected');

    // socket.emit('userText', {
    //     from : 'Admin',
    //     text : 'Welcome To Chart App'
    // });

    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
           return callback('name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        //socket.leave('the office fan') ---> this is used to leave the room when eve you want to.
        //io.emit -> io.to('the office fan').emit ---> this emit to every single user that joined a group.
        //socket.broadcast.emit -> socket.broadcast.to('the office fan').emit ---> this emit to every single user that joined in a group apart from the current sender or user.
        //socket.emit('office fan') this emit to one very particular person. 
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('getWelcomMessage',{
            from : `${params.name} welcome to chat app`,
            time : new Date().getTime()
        });
        socket.broadcast.to(params.room).emit('newJoineUserAlert', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    // socket.broadcast.emit('welcomeMessage', {
    //     admin : 'Admin',
    //     text : 'New User Joined',
    //     time : new Date().getTime()
    // });

    socket.on('createMessage', function(fromClient, callback){
        var user = users.getUser(socket.id);

        if(user && isRealString(fromClient.text)){

            io.to(user.room).emit('response', {
                from : user.name,
                text : fromClient.text,
                time : new Date().getTime()
            });

        } 
        callback();
    });

    socket.on('createLocationMessage', function(geoLocation_Data){
        var user = users.getUser(socket.id);
        if(user){

            io.to(user.room).emit('geolocation_Message', {
                from : user.name,
                url : `https://www.google.com/maps?q=${geoLocation_Data.latitude},${geoLocation_Data.longitude}`,
                createdAt : new Date().getTime()
            });

        }
       
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
    var user = users.removeUser(socket.id);

    if(user){
        io.to(user.room).emit('updateUserList',users.getUserList(user.room));
        io.to(user.room).emit('getMessage', generateMessage('Admin', `${user.name} has left`));
    }
});
});

server.listen(port, ()=>{
    console.log(`Server is up ${port}`);
}); 