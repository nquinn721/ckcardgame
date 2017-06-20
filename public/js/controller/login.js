app.controller('login', function (socket, $location, game, $timeout) {
    var self = this;

    // autologin
    var autologin = false;

    this.gameType = 'public';
    this.tab = 'login';
    this.privateGame;
    this.joinGameChosen;
    this.pw;
    this.name;

    this.login = function () {
        if(this.joinGame){
            this.privateGame = this.joinGame.name;
        }

        if(this.tab === 'login' && this.gameType === 'public'){
            this.pw = null;
            this.privateGame = null;
        }


        if(this.isValidToSend()){
            socket.emit(this.tab, this.name, this.privateGame, this.pw, (player, name) => {
                self.privateGame = '';
                if(player.error){
                    this.showError(player.msg);
                }else{
                	game.init(player, name);
                    $location.path('/game');
                }


            });
        }
    };

    this.setGameChosen = function () {
        
        this.joinGame = game.games.filter(v => v.name === this.joinGameChosen)[0];
    }

    this.isValidToSend = function() {
        if((this.tab === 'join' && this.joinGame && this.joinGame.gameType === 'private') || (this.tab === 'login' && this.gameType === 'private')){
            if(!this.pw || this.pw.length < 3)
                return false;
        }

        if(!this.name || this.name.length < 3)
            return false;


        return true;
    };

    this.showError = function(msg) {
        this.error = msg;
        $timeout(() => this.createError = null, 2000);
    }




    if(autologin){
        this.name = 'Admin';
        this.login();   
    }

});