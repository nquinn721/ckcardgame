app.controller('game', function (socket, game, $location, $timeout) {
    var self = this;

    this.game = game;
    // this.turnAvailable = true;

    this.playCard = function (card) {
        if(this.turnAvailable)
            socket.emit('playCard', card, () => this.game.player.showCantPlayCard());
    };

    this.drawCard = function () {
        this.attackComing = false;
        if(this.turnAvailable && !this.drawnCard){
            socket.emit('drawCard', (card) => this.game.player.drawCard(card));
            this.drawnCard = true;
        }else{
            this.turnAvailable = false;
            this.drawnCard = false;
            socket.emit('endTurn');
        }

    };


    this.reset = function() {
        socket.emit('reset');  
    };

    socket.on('updatePlayers', v => this.game.updatePlayers(v));
    socket.on('updatePlayer', v => this.game.updatePlayer(v));
    socket.on('updateOpponent', v => this.game.updateOpponent(v));
    socket.on('clearPlayedCards', v => this.game.clearPlayedCards());

    socket.on('turnAvailable', function (opponentsPlayedCards) {
        if(opponentsPlayedCards && opponentsPlayedCards.length){
            self.game.opponent.showCards(opponentsPlayedCards);
            self.attackComing = true;
        }
        self.turnAvailable = true;
    });

    socket.on('endGame', this.game.end);

    socket.on('redirect', function () {
        $location.path('/');
    });

    socket.on('disconnected', function () {
        self.disconnected = true;
    });
});