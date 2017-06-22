app.controller('main', function (socket, game, chat, $location) {
    var self = this;
    this.title = 'Welcome to the card game!';

	socket.on('updatePlayers', v => game.updatePlayers(v));
    socket.on('updatePlayer', v => game.updatePlayer(v));
    socket.on('updateOpponent', v => game.updateOpponent(v));
    socket.on('finishAttack', v => game.finishAttack(v));
    socket.on('turnAvailable', v => game.turnAvailable(v));
    socket.on('replay', v => game.replay(v))
    socket.on('endGame', v => game.end(v));
    socket.on('allMessages', (msgs) => chat.setAllMessages(msgs));
    socket.on('redirect', function () {
        $location.path('/');
    });

    socket.on('disconnected', function () {
        self.disconnected = true;
    });
});



