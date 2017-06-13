app.controller('main', function (socket, game, $location) {
    var self = this;
    this.game = game;
    this.title = 'Welcome to the card game!';



	socket.on('updatePlayers', v => this.game.updatePlayers(v));
    socket.on('updatePlayer', v => this.game.updatePlayer(v));
    socket.on('updateOpponent', v => this.game.updateOpponent(v));
    socket.on('finishAttack', v => this.game.finishAttack(v));
    socket.on('turnAvailable', v => this.game.turnAvailable(v));
    socket.on('endGame', v => this.game.end(v));

    socket.on('redirect', function () {
        $location.path('/');
    });

    socket.on('disconnected', function () {
        self.disconnected = true;
    });
});



