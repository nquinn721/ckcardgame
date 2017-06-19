app.controller('game', function (game, socket, $location, $timeout) {
    var self = this;
    this.isadmin = false;
    this.autoplay = false;
    this.game = game;

    this.game.setupController(this);

    if(this.game.player && this.game.player.name.match(/admin/i)){
        this.isadmin = true;
    }


    this.playCard = function (card) {
        if(this.turnAvailable){
            this.attackComing = true;
            socket.emit('playCard', card, () => this.game.player.showCantPlayCard());
        }
    };

    this.drawCard = function () {
        if(this.turnAvailable && !this.drawnCard){
            socket.emit('drawCard', (card) => this.game.player.drawCard(card, this.isadmin));
            this.drawnCard = true;
        }else{
            this.turnAvailable = false;
            this.drawnCard = false;
            socket.emit('endTurn');
        }

    };
    this.removeCardFromPlay = function(card) {
        console.log('removing');
        socket.emit('removeCardFromPlay', card);
    }

    this.pause = function() {
        this.autoplay = !this.autoplay;
    }
    this.replay = function() {
        socket.emit('replay');
    }

    this.leave = function() {
        $location.path('/');
    }

    this.reset = function() {
        socket.emit('reset');  
    };



    

    
});