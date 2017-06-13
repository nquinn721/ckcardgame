
app.factory('game', function (Player, $timeout) {
    function Game() {
        this.cards;
    }

    Game.prototype = {
        init: function(playerObj, cards) {
            this.cards = cards;
            this.createPlayer(playerObj);
        },
        setupController: function(controller) {
            this.controller = controller;
        },
        turnAvailable: function (opponent) {
            if(opponent)
                this.updateOpponent(opponent);
            this.controller.turnAvailable = true;

            if(this.controller.autoplay){
                this.controller.drawCard();
                this.controller.drawCard();
            }
            
        },
        finishAttack: function(players) {
            var self = this;
            $timeout(function(){
                self.updatePlayers(players);
            }.bind(this), 2000);  
        },
        createPlayer: function (playerObj) {
            this.player = new Player(playerObj);
            this.player.type = 'player';
        },
        createOpponent: function(opponent) {
            this.opponent = new Player(opponent);
            this.opponent.type = 'opponent';
        },
        updatePlayers: function(players) {
            console.log(players);
            for(var i = 0; i < players.length; i++){
                if(players[i].id === this.player.id)this.player.update(players[i]);
                else this.opponent.update(players[i]);
            }
        },
        updatePlayer: function(player) {
            this.player.update(player);
        },
        updateOpponent: function(opponent) {
            if(this.opponent)
                this.opponent.update(opponent);
        },
        getCard: function(id) {
            var card;
            for(var i = 0; i < this.cards.length; i++)
                if(this.cards[i].id == id)card = this.cards[i];
            return card;
        },
        end: function (lose) {
            if(lose){
                this.lose = true;
            }else{
                this.win = true;
            }

            this.gameEnded = true;
        }
    };

    return new Game;
});
