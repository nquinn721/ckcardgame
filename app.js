var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);
var fs = require('fs');


app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));


server.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port 3000');
});



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});


var users = [],
    cards = require('./lib/cards'),
    beginRound = 0;
io.on('connection', function (socket) {
    // console.log('Connected socket: ' + socket.id);
    if(!users.length)
        socket.emit('redirect');

    socket.on('login', function (name, cb) {
        var user = {name: name, hp: 100, id: this.id, cards: cards};
        this.user = user;
        var opponent = this.getOpponent();
        users.push(this.user);

        if(opponent){
            io.to(opponent.id).emit('turnAvailable');
        }
        cb();
    });

    socket.on('turnPlayed', function () {
        var opponent = this.getOpponent();

        if(opponent && opponent.cardPlayed){
            attack(opponent);
        }
        io.to(opponent.id).emit('turnAvailable');
    });

    socket.on('getUsers', function (cb) {
        io.emit('updateUsers', users);
    });

    socket.on('playCard', function (card) {
        var opponent = this.getOpponent();
        this.user.cardPlayed = card;


        if(opponent){
            io.to(opponent.id).emit('playCard', card);
            beginRound++;

        }


        if(opponent.cardPlayed){
            attack(opponent);
        }else{
            io.to(opponent.id).emit('turnAvailable');
        }
    });

    socket.on('endGame', function () {
        var opponent = this.getOpponent();
        io.to(opponent.id).emit('endGame');
    });

    socket.getOpponent = function(){
        return users.filter(v => v.id !== this.id)[0];
    };

    socket.getUser = function () {
        return users.filter(v => v.id === this.id)[0];
    };

    socket.on('disconnect', function () {
        io.emit('redirect');
        users = [];
    });

});

function attack(opponent) {
    var user1 = users[0],
        user2 = users[1],
        dam1, dam2;

    if(user1.cardPlayed && user2.cardPlayed){
        dam1 = (user2.cardPlayed.att - user1.cardPlayed.def);
        dam2 = (user1.cardPlayed.att - user2.cardPlayed.def);

        if(dam1 > 0)
            user1.hp -= dam1;
        if(dam2 > 0)
            user2.hp -= dam2;
    }else if(user1.cardPlayed){
        user2.hp -= user1.cardPlayed.att;
    }else if(user2.cardPlayed){
        user1.hp -= user2.cardPlayed.att;
    }


    io.to(user1.id).emit('endRound', user1.hp, user2.hp);
    io.to(user2.id).emit('endRound', user2.hp, user1.hp);
    io.to(opponent.id).emit('turnAvailable');


    user1.cardPlayed = null;
    user2.cardPlayed = null;
}