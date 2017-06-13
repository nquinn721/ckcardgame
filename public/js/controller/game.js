app.controller('game', function (socket, game, $location, $timeout) {
    var self = this;
    this.isadmin = false;
    this.autoplay = false;
    this.game = game;

    if(this.game.player && this.game.player.name.match(/admin|nate/i)){
        this.isadmin = true;
    }


    this.playCard = function (card) {
        if(this.turnAvailable){
            this.attackComing = true;
            socket.emit('playCard', card, () => this.game.player.showCantPlayCard());
        }
    };

    this.drawCard = function () {
        this.attackComing = false;
        if(this.turnAvailable && !this.drawnCard){
            socket.emit('drawCard', (card) => this.game.player.drawCard(card, this.isadmin));
            this.drawnCard = true;
        }else{
            this.turnAvailable = false;
            this.drawnCard = false;
            socket.emit('endTurn');
        }

    };
    this.pause = function() {
        this.autoplay = !this.autoplay;
    }

    this.reset = function() {
        socket.emit('reset');  
    };

    socket.on('updatePlayers', v => this.game.updatePlayers(v));
    socket.on('updatePlayer', v => this.game.updatePlayer(v));
    socket.on('updateOpponent', v => this.game.updateOpponent(v));
    socket.on('clearPlayedCards', v => this.game.clearPlayedCards());

    socket.on('turnAvailable', function (opponent) {
        if(opponent)
            self.game.updateOpponent(opponent);
        if(opponent && opponent.playedCards.length){
            self.attackComing = true;
        }else{
            self.attackComing = false;
        }
        self.turnAvailable = true;

        if(self.autoplay){
            self.drawCard();
            self.drawCard();
        }
    });

    socket.on('endGame', this.game.end);

    socket.on('redirect', function () {
        $location.path('/');
    });

    socket.on('disconnected', function () {
        self.disconnected = true;
    });
});