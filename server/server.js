var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 2222;

var model = {
  users: [],
  history: []
};

var count = {
  idMessage: 0,
  idMessage: 0
};

app.get('/', function(req, res){
  res.send('<h1>Welcon in the React-Messenger app :)</h1>');
});

io.on('connection', function(socket){

  socket.on('new user', function(data) {
    model.users.push( {name: data, id: count.idUsers++} );
  });

  socket.on('disconnect', function(){
    var i = model.users.indexOf(socket);
    model.users.splice(i, 1);
  });

});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
