var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 2222;
var model = {
  users: [
    // {name: "TEST", userId: 1, socketId: "4515efs2wsc" },
    // {name: "SERVEUR", userId: 2, socketId: "qzdq84d5d1q2s" }
  ],
  history: [
    /*{name: "Jonathan", text: "Message de Jon", date: "13 janvier 2017 à 16h28", id: '1', userId: 4},
    {name: "Thomas", text: "Message de Thomas", date: "14 janvier 2017 à 18h00", id: '2', userId: '6'}*/
  ]
};

var messageId = 0;
var userId = 0;

function findUserIndex(socketId) {
  for(var i = 0; i < model.users.length; i++) {
    if (model.users[i]["socketId"] === socketId)
      return i;
  }
  return -1;
}

function disconnectUser(socketId) {
  var index = findUserIndex(socketId);
  model.users = model.users.slice(0, index).concat(model.users.slice(index + 1));
  return index;
}

io.on('connection', function(socket){
  socket.on('new user', function(data) {
    var currentUser = {name: data.user, userId: userId, socketId: socket.id };
    model.users.push(currentUser);

    // Send message to current user
    io.to(socket.id).emit('initialize data', {
      history: model.history,
      activeUsers: model.users,
      userId: userId
    });

    // Send message to every users except current user
    socket.broadcast.emit('update users', {
      newUser: currentUser
    });

    userId++;
  });

  socket.on('new message', function(data) {
    messageId++;

    model.history.push({
      user: data.user,
      text: data.text,
      date: data.date,
      id: messageId,
      userId: data.userId
    });

    io.emit('update history', {
      newMessage: {
        user: data.user,
        text: data.text,
        date: data.date,
        id: messageId,
        userId: data.userId
      }
    });
  });

  socket.on('disconnect user', function(){
    socket.broadcast.emit('slice user', disconnectUser(socket.id));
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('slice user', disconnectUser(socket.id));
   });

});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
