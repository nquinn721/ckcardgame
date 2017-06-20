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

var gm = require('./server/gameManager');

gm.init(io);



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});



io.use(function(socket, next) {
    if(!socket.loggedIn)
        socket.emit('redirect');

    next();
});
io.on('connection', function (socket) {

    socket.emit('games', gm.getGamesList());

    socket.on('login', function(name, gameName, pw, cb) {
        this.name = name;
        if(!gameName){
            gm.joinPublicGame(name, this, cb);
        }else{
            if(pw){
                gm.createPrivateGame(name, gameName, pw, this, cb);
            }else{
                cb({error: true, msg: 'password'});
            }
        }
    });

    socket.on('join', function(name, gameName, pw, cb) {
        this.name = name;
        gm.joinPrivateGame(name, gameName, pw, this, cb);
    });

});