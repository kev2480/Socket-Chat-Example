var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Get routing here
app.get('/', function(req, res){
  //Send index.html
  res.sendFile(__dirname + '/index.html');
});

//Listen for connections
io.on('connection', function(socket){
  //connected
  console.log('a user connected');
  //Disconnected
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //New message
  socket.on('chat message', function(msg){
    io.emit('chat message', msg); //Send message to everyone TODO: Don't send back to sender!
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
