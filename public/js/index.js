var socket = io();
       
socket.on('connect', function(){
            console.log('connected to the server'); 

            socket.on('replyToClient', function(FromAdmin){
                console.log(FromAdmin);
            });

            socket.on('excludeUser', function(data){
                console.log(data);
            });

        });
      
        socket.on('disconnect', function(){
           console.log('Disconnect from The server');
       });

       socket.on('newMessage', function(data){
        console.log(data);
    });
         