
var person = prompt("Please enter your name...", "");

var socket = io({ query: "username=" + person });

$('form').submit(function(){
  var now = new Date();
  socket.emit('chat message', getSendBundle( $('#m').val(), now ) );
  $('#m').val('');
  return false;
});

socket.on('chat message', function(msg){

  $("#messages").append('<li class="list-group-item">'
                          + '<strong class="messageUser" style="color:'+msg.color+'">'+msg.user+'</strong>'
                          + '<span class="message">'+msg.message+'</span>'
                          + '<span class="time">'+ msg.time+'</span>'
                          + '</li>');

  $( "#messages li:last-child" ).addClass("pullDown");
  window.scrollTo(0,document.body.scrollHeight);
});

/*On new user empty and re add*/
socket.on('new user', function(usernames)
{
  $("#users").empty();
  $("#users").append('<li class="list-group-item list-group-item-info">Online </li>');
  for (var i = 0; i < usernames.length; i++) {
    var user = usernames[i];
    addUser(user);
  }
});

/**
  * Add user to online list
  */
function addUser(user)
{
  $("#users").append('<li class="list-group-item">'
                          + '<strong style="color:'+user.color+'">'+user.user+'</strong>'
                          + '</li>');

  $( "#users li:last-child" ).addClass("pullDown");
}

/**
  * Message to send back to server
  */
function getSendBundle(msg, now)
{
  var messageBundle = {
    message: msg,
    time: timeStamp(now)
  }

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

// If hour is 0, set it to 12
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
