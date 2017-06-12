
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
            this.player = new Player(playerObj);
            this.player.type = 'player';
            console.log(this.player);
        },
        createOpponent: function(opponent) {
            this.opponent = new Player(opponent);
            this.opponent.type = 'opponent';
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
            $timeout(function() {
                this.player.hideCards();
                this.opponent.hideCards();  
            }, 2000);
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
