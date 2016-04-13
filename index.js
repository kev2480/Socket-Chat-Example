var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = {};
var users = {};

app.use('/static', express.static('static'));

//Get routing here
app.get('/', function(req, res){
  //Send index.html
  res.sendFile(__dirname + '/index.html');
});

//Listen for connections
io.on('connection', function(socket){

  // get the handshake and the session object
  var hs = socket.handshake;
  var username = hs.query.username;
  users[username] = socket.id; // connected user with its socket.id
  clients[socket.id] = socket; // add the client data to the hash

  //connected
  console.log( username + ' connected.' );
  io.emit('chat message', "SocketBot: " + username + " has joined the chat.");
  //Disconnected
  socket.on( 'disconnect', function(){
    console.log( username + ' disconnected' );
    io.emit('chat message', "SocketBot: " + username + " has left the chat.");
    delete clients[socket.id]; // remove the client from the array
    delete users[username]; // remove connected user & socket.id
  } );

  //New message
  socket.on('chat message', function(msg){
    io.emit('chat message', username + ": " + msg); //Send message to everyone TODO: Don't send back to sender!
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
