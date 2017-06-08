
app.factory('game', function (Player) {
    function Game(user) {
        this.user = user;
    }

    Game.prototype = {
        createPlayer: function (playerObj) {
            return new Player(this, playerObj);
        },
        createPlayers: function (players) {
            for(var i = 0; i < players.length; i++){
                if(players[i].name === this.user)
                    this.player = this.createPlayer(players[i]);
                else
                    this.opponent = this.createPlayer(players[i]);
            }
        },
        end: function (lose) {
            if(lose){
                this.lose = true;
            }else{
                this.win = true;
            }
        }
    };

    return Game;
});
