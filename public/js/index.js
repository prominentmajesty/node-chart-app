var socket = io();
       
socket.on('connect', function(){
            console.log('connected to the server'); 
           
           /* socket.on('replyToClient', function(FromAdmin){
                console.log(FromAdmin);
            });

            socket.on('excludeUser', function(data){
                console.log(data);
            });*/

            socket.on('welcomeMessage', function(welcome_Msg){
                var li = $('<li></li>');
                li.text(`${welcome_Msg.admin} : ${welcome_Msg.text}`);
                $('#feedBack').append(li);
            });

            $('#message-form').on('submit', function(e){
                e.preventDefault();
        
                socket.emit('createMessage', {
                    from : 'User',
                    text : $('[name=message]').val()
                }, function(passedData){
                     console.log(passedData);
                });
            });
        
            socket.on('response', function(feedBack){
                console.log(feedBack);
                var li = $('<li></li>');
                li.text(`${feedBack.from} : ${feedBack.text}`);
                $('#feedBack').append(li);
            });

        });
      
        socket.on('disconnect', function(){
           console.log('Disconnect from The server');
       });

       socket.on('goodByeMessage', function(bye_Msg){
        var li = $('<li></li>');
        li.text(`${bye_Msg.admin} : ${bye_Msg.text}`);
        $('#feedBack').append(li);
    });
      
      /* socket.on('newMessage', function(data){
        console.log(data);
    });*/
         