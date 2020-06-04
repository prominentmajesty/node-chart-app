var socket = io();
       
socket.on('connect', function(){
            console.log('connected to the server'); 
           
           /* socket.on('replyToClient', function(FromAdmin){
                console.log(FromAdmin);
            });

            socket.on('excludeUser', function(data){
                console.log(data);
            });*/

        });
    
        socket.on('disconnect', function(){
           console.log('Disconnect from The server');
           
       });

       socket.on('userText', function(return_Message){
        var li = $('<li></li>');
        li.text(`${return_Message.from} : ${return_Message.text}`);
        $('#feedBack').append(li);
    });

    socket.on('welcomeMessage', function(welcome_Msg){
        var li = $('<li></li>');
        li.text(`${welcome_Msg.admin} : ${welcome_Msg.text}`);
        $('#feedBack').append(li);
    });

    $('#message-form').on('submit', function(e){
        e.preventDefault();

        var messageTextBox = $('[name=message]');

        socket.emit('createMessage', {
            from : 'User',
            text : messageTextBox.val()
        }, function(passedData){
             messageTextBox.val('');
        });
    });

    socket.on('response', function(feedBack){
    //    var formettedTime = moment(feedBack.time).format('h:mm a');
    //     var li = $('<li></li>');
    //     li.text(`${feedBack.from} ${formettedTime}: ${feedBack.text}`);
    //     $('#feedBack').append(li);
    var formettedTime = moment(feedBack.time).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        from : feedBack.from,
        text : feedBack.text,
        time : formettedTime
    });
    $('#feedBack').append(html);
    });

        var locationButton = $('#send-location');
        locationButton.on('click', function(){
            if(!navigator.geolocation){
                return alert('Geo-location not supported by your browser');
            } 

                locationButton.attr('disabled', 'disabled').text('Sending Location...');

                navigator.geolocation.getCurrentPosition(function(position){
                    locationButton.removeAttr('disabled').text('Send Location');
                    socket.emit('createLocationMessage', {
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude
                    });
                }, function(){
                    locationButton.removeAttr('disabled').text('Send Location');;
                    alert('Unable to fetched location.');
                });
            });

        socket.on('geolocation_Message', function(return_Goe_Message){
            // var li = $('<li><li>');
            // var a = $('<a target="blank">My current location</a>');
            // li.text(`${return_Goe_Message.from}: `);
            // a.attr('href', return_Goe_Message.url);
            // li.append(a);
            var formettedTime = moment(return_Goe_Message.createdAt).format('h:mm a');
            var template = $('#message-geoLocation').html();
            var html = Mustache.render(template,{
                from : return_Goe_Message.from,
                url : return_Goe_Message.text,
                createdAt : formettedTime
            });
            $('#feedBack').append(html);
        });
      
      /* socket.on('newMessage', function(data){
        console.log(data);
    });*/
         