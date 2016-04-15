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

  io.emit('chat message', getSocketBotBundle( username + " has joined the chat") );
  //Disconnected
  socket.on( 'disconnect', function(){
    console.log( username + ' disconnected' );

    io.emit('chat message', getSocketBotBundle( username + " has left the chat") );
    delete clients[socket.id]; // remove the client from the array
    delete users[username]; // remove connected user & socket.id
  } );

  //New message
  socket.on('chat message', function(message){
    io.emit('chat message', getMessageBundle(userColour, username, message.message, message.time)); //Send message to everyone TODO: Don't send back to sender!
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

function getMessageBundle(userColour, username, msg, timestamp)
{
  var messageBundle = {
    message: msg,
    user: username,
    color: userColour,
    time: timestamp
  }

  return messageBundle;
}

function getSocketBotBundle(message)
{
  var messageBundle = getMessageBundle(
    "red",
    "SocketBot",
     message,
    "Server Time: " + timeStamp(new Date()) );

    return messageBundle;
}

/**
 * Return a timestamp with the format "h:MM:ss TT"
 * @type {Date}
 */
function timeStamp(now) {

// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12 time[0] = time[0] || 12;
  time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

// Return the formatted string
  return time.join(":") + " " + suffix;
}
