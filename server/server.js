var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 2222;

var model = {
  users: [
    // {name: "TEST", id: 1},
    // {name: "SERVEUR", id: 2}
  ],
  history: [
    /*{name: "Jonathan", text: "Message de Jon", date: "13 janvier 2017 à 16h28", id: '1'},
    {name: "Thomas", text: "Message de Thomas", date: "14 janvier 2017 à 18h00", id: '2'}*/
  ]
};

var messageId = 0;

app.get('/', function(req, res){
  res.send('<h1>Welcome in the React-Messenger app :)</h1>');
});

io.on('connection', function(socket){

  socket.on('new user', function(data) {
    model.users.push( {name: data.user, id: socket.id} );
    console.log("new user: "+data.user);

    io.to(socket.id).emit('initialize data', {
      history: model.history,
      activeUsers: model.users,
      userId: socket.id
    });

    socket.broadcast.emit('update users', {
      newUser: {name: data.user, id: socket.id}
    });
  });

  socket.on('new message', function(data) {
    messageId++;
    console.log("message count: "+messageId);

    model.history.push({
      user: data.user,
      text: data.text,
      date: data.date,
      id: messageId,
      userId: socket.id
    });

    io.emit('update history', {
      newMessage: {
        name: data.user,
        text: data.text,
        date: data.date,
        id: messageId,
        userId: socket.id
      }
    });
  });

  // socket.on('disconnect', function(){
  //   var i = model.users.indexOf(socket);
  //   model.users.splice(i, 1);
  // });

});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
