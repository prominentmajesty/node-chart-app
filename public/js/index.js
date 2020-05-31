var socket = io();
       socket.on('connect', function(){
         
            console.log('connected to the server'); 
            
            socket.emit('createNewEmail',{
                from : 'Majesty',
                text : 'Hey Woman How Are You'
            });

            socket.on('sendMessage', function(data){
                console.log(data);
            });

        });
      
        socket.on('disconnect', function(){
           console.log('Disconnect from The server');
       });
       