var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 2222;

var model = {
  users: [
    // {name: "TEST", userId: 1},
    // {name: "SERVEUR", userId: 2}
  ],
  history: [
    /*{name: "Jonathan", text: "Message de Jon", date: "13 janvier 2017 à 16h28", id: '1', userId: 4},
    {name: "Thomas", text: "Message de Thomas", date: "14 janvier 2017 à 18h00", id: '2', userId: '6'}*/
  ]
};

var messageId = 0;
var userId = 0;

function findUserIndex(id) {
  var len = model.users.length;
    for(var i = 0; i < len; i++) {
        if (model.users[i]["userId"] === id)
          return i;
    }
    return -1;
}

app.get('/', function(req, res){
  res.send('');
});

io.on('connection', function(socket){
  socket.on('new user', function(data) {
    model.users.push( {name: data.user, userId: userId} );

    io.to(socket.id).emit('initialize data', {
      history: model.history,
      activeUsers: model.users,
      userId: userId
    });

    socket.broadcast.emit('update users', {
      newUser: {name: data.user, userId: userId}
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
        name: data.user,
        text: data.text,
        date: data.date,
        id: messageId,
        userId: data.userId
      }
    });
  });

  socket.on('disconnect user', function(userId){
    var index = findUserIndex(userId);
    model.users = model.users.slice(0, index).concat(model.users.slice(index + 1));
    socket.broadcast.emit('slice user', index);
  });

});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
