var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = {};

app.use('/static', express.static('static'));

//Get routing here
app.get('/', function(req, res){
  //Send index.html
  res.sendFile(__dirname + '/index.html');
});

//Listen for connections
io.on('connection', function(socket){
  //Add client to list
  clients[socket.id] = socket;
  //connected
  console.log('a user connected: ' + socket.id);
  //Disconnected
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //New message
  socket.on('chat message', function(msg){
    io.emit('chat message', msg.id + ": " + msg); //Send message to everyone TODO: Don't send back to sender!
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
