
var person = prompt("Please enter your name...", "");

var socket = io({ query: "username=" + person });

$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
