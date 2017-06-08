var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);


app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
var file = fs.readFileSync('./bower_components/angular/angular.js', 'utf-8');
console.log(file);

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

        if(opponent.cardPlayed){
            this.getUser().cardPlayed = {att: opponent.cardPlayed.def, def: 0};
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
    }

    socket.getUser = function () {
        return users.filter(v => v.id === this.id)[0];
    }

});

function attack(opponent) {
    var user1 = users[0],
        user2 = users[1];
    user1.hp = user2.cardPlayed.att - user1.cardPlayed.def;
    user2.hp = user1.cardPlayed.att - user2.cardPlayed.def;

    io.to(user1.id).emit('endRound', user1.hp, user2.hp);
    io.to(user2.id).emit('endRound', user2.hp, user1.hp);
    io.to(opponent.id).emit('turnAvailable');
}