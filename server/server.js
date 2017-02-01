var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 2222;

var model = {
  users: [
    // {name: "Jon", id: 1},
    // {name: "Thomas", id: 2},
  ],
  history: [
    // {name: "Jonathan", text: "Message de Jon", date: "13 janvier 2017 à 16h28", id: 1},
    // {name: "Thomas", text: "Message de Thomas", date: "14 janvier 2017 à 18h00", id: 2}
  ]
};

var count = {
  user: 0,
  message: 0
};

app.get('/', function(req, res){
  res.send('<h1>Welcome in the React-Messenger app :)</h1>');
});

io.on('connection', function(socket){

  socket.on('new user', function(data) {
    model.users.push( {name: data.user, id: count.user++} );
    io.emit('update users', model.users);
    console.log(model.users);
  });

  socket.on('disconnect', function(){
    var i = model.users.indexOf(socket);
    model.users.splice(i, 1);
  });

});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
