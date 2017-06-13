app.controller('login', function (socket, $location, game) {
    var self = this;

    // autologin
    var autologin = true;

    console.log('login');

    this.name;

    this.login = function () {
        if(!this.name)return;
        socket.emit('login', this.name, function (player, cards) {
        	game.init(player, cards);
            $location.path('/game');
        });
    };

    socket.on('createOpponent', v => game.createOpponent(v));


    if(autologin){
        this.name = 'Nate';
        this.login();   
    }

});