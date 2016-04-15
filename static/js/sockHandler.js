
var person = prompt("Please enter your name...", "");

var socket = io({ query: "username=" + person });

$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat message', function(msg){
  //$('#messages').append($('<li>').text(msg));

  $("#messages").append('<li class="list-group-item"><strong class="messageUser" style="color:'+msg.color+'">'+msg.user+'</strong><span class="message">'+msg.message+'</span></li>');
  $( "#messages li:last-child" ).addClass("pullDown");
  window.scrollTo(0,document.body.scrollHeight);

});
