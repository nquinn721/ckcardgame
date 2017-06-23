
app.factory('game', function (Player, $timeout) {
    function Game() {
        this.name;
    }

    Game.prototype = {
        init: function(playerObj, name) {
            this.name = name;
            this.createPlayer(playerObj);
        },
        showGameMessage: function(msg) {
            this.gameMessage = msg;
            $timeout(() => this.gameMessage = null, 2000);
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
            $timeout(() => {
                this.updatePlayers(players);
                
            }, 2000);
        },
        createPlayer: function (playerObj) {
            this.player = new Player(playerObj);
            this.player.type = 'player';
        },
        createOpponent: function(opponent) {
            if(!opponent){
                this.opponent = null;
                return;
            }
            this.opponent = new Player(opponent);
            this.opponent.type = 'opponent';
        },
        updatePlayers: function(players) {
            for(var i = 0; i < players.length; i++){
                if(players[i].id === this.player.id)this.player.update(players[i]);
                else this.opponent.update(players[i]);
            }
            this.updateAttackDamage();
        },
        updatePlayer: function(player) {
            this.player.update(player);
            this.updateAttackDamage();

        },
        updateOpponent: function(opponent) {
            if(!opponent)delete this.opponent;
            else if(this.opponent)
                this.opponent.update(opponent);

            this.updateAttackDamage();
        },

        updateAttackDamage: function() {
            if(this.player && this.opponent){
                this.damageToOpponent = this.player.totalAttack - this.opponent.totalDefense;
                this.damageToPlayer = this.opponent.totalAttack - this.player.totalDefense;
            }
        },
        replay: function(players) {
            this.gameEnded = false;
            this.updatePlayers(players);  
        },
        getCard: function(id) {
            var card;
            for(var i = 0; i < this.cards.length; i++)
                if(this.cards[i].id == id)card = this.cards[i];
            return card;
        },
        getPlayer: function(id) {
            if(this.player.id === id)return this.player;
            else return this.opponent;
        },
        end: function (win) {
            $timeout(() =>{
                if(win){
                    this.win = true;
                }else{
                    this.lose = true;
                }

                this.gameEnded = true;
                
            }, 3000);

        }
    };

    return new Game;
});
