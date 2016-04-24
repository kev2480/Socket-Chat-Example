(function()
{
  var person = prompt( "Please enter your name...", "" );

  var socket = io( { query: "username=" + person } );

  //Store users and messages for Angular
  var usernames = [];
  var messages  = [];

  //Define Chat angular module
  var chatAngular = angular.module( "chat", [] );

  //Define Messages Controller for angular
  chatAngular.controller('MessageController', function() {
    this.chats = messages;
  } );

  //Define Users Controller for angular
  chatAngular.controller('UserController', function() {
    this.people = usernames;
  } );

  $('form').submit( function(){
    //On submit.. get date/message and emit.
    var now = new Date();
    socket.emit('chat message', getSendBundle( $('#m').val(), now ) );
    $('#m').val('');
    return false;
  } );

  socket.on( 'chat message', function(msg){
    //Add Element to messages
    messages.push(msg);
    //Alert Angular its updated (only needed if outside of controller function)
    angular.element($("#messages")).scope().$apply();
    //Add animation to last child
    $( "#messages li:last-child" ).addClass( "pullDown" );
    //Pull down to bottom of window
    window.scrollTo(0,document.body.scrollHeight);

  } );

  /*On new user empty and re add*/
  socket.on( 'new user', function(users)
  {
    //Empty array
   usernames.length = 0;

   //Loop and push (bit of a hack.. doesn't work by specifying usernames = users)
   for ( var i = 0; i < users.length; i++ ) {
     usernames.push(users[i]);
   }

   //Alert Angular its updated (only needed if outside of controller function)
   angular.element($("#users")).scope().$apply();
   //Add animation to last child
   $( "#users li:last-child" ).addClass("pullDown");
  } );

} )();

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
