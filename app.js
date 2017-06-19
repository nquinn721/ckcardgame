var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    fs = require('fs');


app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));


server.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port 3000');
});

var gm = require('./server/gameManager'),
    game;



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});



io.use(function(socket, next) {
    if(!socket.loggedIn)
        socket.emit('redirect');

    next();
});
io.on('connection', function (socket) {

    socket.emit('games', gm.getPrivateGamesList());

    socket.on('login', function(name, gameName, cb) {
        if(!gameName){
            gm.joinPublicGame(name, this, io, cb);
        }else{
            gm.createPrivateGame(name, gameName, io, this, cb);
        }
    });

    socket.on('join', function(name, gameName, cb) {
        gm.joinPrivateGame(name, gameName, io, this, cb);
    });

});