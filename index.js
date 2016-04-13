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
  var userColour = getRandomColor();

  //connected
  console.log( username + ' connected.' );
    var messageBundle = getMessageBundle("red", "SocketBot", username + " has joined the chat");
  io.emit('chat message', messageBundle);
  //Disconnected
  socket.on( 'disconnect', function(){
    console.log( username + ' disconnected' );

    var messageBundle = getMessageBundle("red", "SocketBot", username + " has left the chat");
    io.emit('chat message', messageBundle);
    delete clients[socket.id]; // remove the client from the array
    delete users[username]; // remove connected user & socket.id
  } );

  //New message
  socket.on('chat message', function(msg){


    io.emit('chat message', getMessageBundle(userColour, username, msg)); //Send message to everyone TODO: Don't send back to sender!
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getMessageBundle(userColour, username, msg)
{
  var messageBundle = {
    message: msg,
    user: username,
    color: userColour
  }

  return messageBundle;
}
