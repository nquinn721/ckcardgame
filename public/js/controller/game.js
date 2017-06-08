app.controller('game', function (socket, game, $routeParams) {
    var self = this;

    this.game = new game($routeParams.user);


    this.playCard = function (card) {
        if(this.turnAvailable && this.game.player.playCard(card)){
            socket.emit('playCard', card);
            this.turnAvailable = false;
        }
    };

    this.drawCard = function () {
        if(this.turnAvailable){
            this.game.player.drawCard();
            this.turnAvailable = false;
            socket.emit('turnPlayed');
        }

    };

    socket.emit('getUsers');
    socket.on('updateUsers', function (users) {
        self.game.createPlayers(users);
    });

    socket.on('turnAvailable', function () {
        self.turnAvailable = true;
    });

    socket.on('playCard', function (card) {
        self.game.opponent.showCard(card);
    });

    socket.on('endRound', function (points, opponentPoints) {
        self.game.player.hp -= points;
        self.game.opponent.hp -= opponentPoints
        self.game.player.playedCard = null;
        self.game.opponent.playedCard = null;

        if(self.game.player.hp <= 0){
            self.game.end(false);
            socket.emit('endGame', false);
        }
    });

    socket.on('endGame', function () {
        self.game.end();
    });
});