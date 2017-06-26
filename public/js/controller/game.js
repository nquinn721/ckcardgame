app.controller('game', function (game, socket, $location, $timeout, sound) {
    var self = this;
    this.isadmin = false;
    this.autoplay = false;
    this.game = game;


    this.playCard = function (card) {
        if(this.game.turnAvailable){
            this.attackComing = true;
            socket.emit('playCard', card, () => this.game.player.showCantPlayCard());
        }
    };

    this.drawCard = function () {
        if(this.game.turnAvailable && !this.drawnCard){
            socket.emit('drawCard', (card) => this.game.player.drawCard(card, this.isadmin));
            this.drawnCard = true;
        }else{
            this.game.turnAvailable = false;
            this.drawnCard = false;
            socket.emit('endTurn');
        }

    };
    this.removeCardFromPlay = function(card) {
        socket.emit('removeCardFromPlay', card);
    };

    this.pause = function() {
        this.autoplay = !this.autoplay;
    };
    this.replay = function() {
        socket.emit('replay');
    };

    this.leave = function() {
        $location.path('/');
    };

    this.reset = function() {
        socket.emit('reset');  
    };



    

    
});