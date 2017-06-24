app.controller('main', function (socket, game, chat, $location, $timeout, sound) {
    var self = this;
    this.game = game;
    this.title = 'Welcome to the card game!';
    this.sound = sound;  
 

	socket.on('updatePlayers', v => this.game.updatePlayers(v));
    socket.on('updatePlayer', v => this.game.updatePlayer(v));
    socket.on('createOpponent', v => this.game.createOpponent(v));
    socket.on('updateOpponent', v => this.game.updateOpponent(v));
    socket.on('finishAttack', v => this.game.finishAttack(v));
    socket.on('turnAvailable', v => this.game.turnAvailable(v));
    socket.on('replay', v => this.game.replay(v))
    socket.on('endGame', v => this.game.end(v));
    socket.on('allMessages', msgs => chat.setAllMessages(msgs));
    socket.on('games', games => this.game.games = games);
    socket.on('gameMessage', msg => this.game.showGameMessage(msg));
    socket.on('disband', () => {
        this.showGlobalError('Your opponent left');
        $location.path('/');
    });
    socket.on('globalError', (msg) => this.showGlobalError(msg));
    socket.on('redirect', () => $location.path('/'));

    this.showGlobalError = function(msg) {
        this.globalError = msg;
        $timeout(() => this.globalError = false, 4000);
    }

    this.logout = function() {
        socket.emit('logout');
        $location.path('/');
    }


    this.game.setupController(this);

    if(this.game.player && this.game.player.name.match(/admin/i)){
        this.isadmin = true;
    }



});



