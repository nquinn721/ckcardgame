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



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});


var Game = require('./server/game');
var game = new Game(io);
io.use(function(socket, next) {
    if(!socket.loggedIn)
        socket.emit('redirect');

    next();
});
io.on('connection', function (socket) {

    socket.on('login', function (name, cb) {
        var player = game.addPlayer({
            name: name,
            hp: 100,
            id: this.id,
            ip: this.handshake.address,
            socket: this
        });
        this.loggedIn = true;
        if(game.isFull())
            game.getOpponent(this.id).socket.emit('turnAvailable');
        cb(player, game.cards);
    });


    socket.on('drawCard', (cb) => game.drawCard(socket.id, cb));

    socket.on('playCard',(card, cb) => game.playCard(socket.id, card, cb));

    socket.on('endTurn', () => game.endTurn(socket.id));

    socket.on('endGame',() => {
        var opponent = this.getOpponent();
        io.to(opponent.id).emit('endGame');
    });

    socket.on('reset', () => {
        game.clearPlayers();
        io.emit('redirect');
    });


    socket.on('disconnect', () => {
        game.removePlayer(socket.id);
        socket.emit('disconnected');
    });

});