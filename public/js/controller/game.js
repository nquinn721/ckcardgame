app.controller('game', function (socket, game, $routeParams, $location, $timeout) {
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

    socket.on('endRound', function (userhp, opponenthp) {
        self.playerDamaged = self.game.player.hp - userhp;

        self.game.player.hp = userhp;
        self.game.opponent.hp = opponenthp;

        $timeout(function () {
            self.game.player.playedCard = null;
            self.game.opponent.playedCard = null;
            self.playerDamaged = null;
        }, 4000);


        if(self.game.player.hp <= 0){
            self.game.end(true);
            socket.emit('endGame', false);
        }
    });

    socket.on('endGame', function () {
        self.game.end();
    });

    socket.on('redirect', function () {
        $location.path('/');
    });

    socket.on('disconnected', function () {
        self.disconnected = true;
    });
});