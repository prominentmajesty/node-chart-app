var socket = io();
       
socket.on('connect', function(){
            console.log('connected to the server'); 

        });
      
        socket.on('disconnect', function(){
           console.log('Disconnect from The server');
       });

       socket.on('newMessage', function(data){
        console.log(data);
    });
         