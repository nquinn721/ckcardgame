
app.factory('game', function (Player) {
    function Game() {
        this.cards;
    }

    Game.prototype = {
        init: function(playerObj, cards) {
            this.cards = cards;
            this.createPlayer(playerObj);
        },
        createPlayer: function (playerObj) {
            this.player = new Player(this, playerObj);
        },
        createOpponent: function(opponent) {
            this.opponent = new Player(this, opponent);
        },
        updatePlayers: function(players) {
            for(var i = 0; i < players.length; i++){
                if(players[i].name === this.player.name)this.player.update(players[i]);
                else this.opponent.update(players[i]);
            }
        },
        updatePlayer: function(player) {
            this.player.update(player);
        },
        updateOpponent: function(opponent) {
            this.opponent.update(opponent);
        },
        clearPlayedCards: function() {
            this.player.hideCards();
            this.opponent.hideCards();  
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
