app.controller('login', function (socket, $location, game, $timeout) {
    var self = this;

    // autologin
    var autologin = false;

    this.gameType = 'public';
    this.privateGame = '';
    this.name;

    this.login = function () {
        if(!this.name)return;
        socket.emit(this.tab, this.name, (this.privateGame !== 'choose' ? this.privateGame : null), (player, name) => {
            if(player === 'full'){
                this.joinError = 'Game is full';
            } else if(player === 'not available'){
                this.createError = 'Game name is not available';
            }else{
            	game.init(player, name);
                $location.path('/game');
            }

            $timeout(() => this.error = null, 2000);

        });
    };



    if(autologin){
        this.name = 'Admin';
        this.login();   
    }

});