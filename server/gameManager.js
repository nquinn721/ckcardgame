var Game = require('./game');

function GameManager() {
	this.privateGames = [];
	this.publicGames = [];
	this.playerWaiting;
}

GameManager.prototype = {
	init: function(io) {
		this.io = io;
	},
	joinPublicGame: function(name, socket, cb) {
		var gameJoined;

		for(var i = 0; i < this.publicGames.length; i++){
			if(!this.publicGames[i].isFull()){
				gameJoined = true;
				this.setUpSocketEvents(name, socket, this.publicGames[i], cb);
			}
		}

		if(!gameJoined){
			this.createGame(name, null, null, true, socket, cb);
		}
	},
	joinPrivateGame: function(name, gameId, pw, socket, cb) {
		var game = this.getPrivateGame(gameId);

		if(game && !game.isFull() && game.pw === pw){
			this.setUpSocketEvents(name, socket, game, cb);
		}else if(game){
			if(game.isFull())
				cb({error: true, msg: 'full'});
			if(game.pw !== pw)
				cb({error: true, msg: 'password'});
		}else{
			cb({error: true, msg: 'not available'});
		}
	},
	createPrivateGame: function(name, gameId, pw, socket, cb){
		var game = this.getPrivateGame(gameId);

		if(!game){
			this.createGame(name, gameId, pw, false, socket, cb);
		}else{
			cb({error: true, msg: 'Game isnot available'});
		}
	},
	createGame: function(name, gameId, pw, public, socket, cb) {
		var game = new Game(this.io, gameId, pw);

		if(public)
			this.publicGames.push(game);
		else
			this.privateGames.push(game);

		this.setUpSocketEvents(name, socket, game, cb);
		this.io.emit('games', this.getGamesList());
	},
	
	leaveGame: function(id, user) {
		var game = this.getGame(id);

		if(game){
			game.leaveGame(user);
		}
	},
	removePlayer: function(game, playerId) {
		game.removePlayer(playerId);

		if(game.isEmpty()){
			this.removeGame(game);
		}
	},
	removeGame: function(gameId) {
		var game = gameId || this.getGame(gameId);
		this[game.gameType + 'Games'].splice(this[game.gameType + 'Games'].indexOf(game), 1);
		this.io.emit('games', this.getGamesList());
	},

	getGame: function(gameId) {
		return this.getPrivateGame(gameId) || this.getPublicGame(gameId);
	},
	getPrivateGame: function(gameId) {
		return this.privateGames.filter(v => v.id === gameId)[0];
	},
	getPublicGame: function(gameId) {
		return this.publicGames.filter(v => v.id === gameId)[0];
	},
	getPrivateGamesList: function() {
		return this.privateGames.filter(v => !v.isFull()).map(v => ({name: v.id, gameType: v.gameType}));
	},
	getPublicGamesList: function() {
		return this.publicGames.filter(v => !v.isFull()).map(v => ({name: v.id, gameType: v.gameType}));
	},
	getGamesList: function() {
		return this.getPrivateGamesList();
		// return [].concat(this.getPrivateGamesList()).concat(this.getPublicGamesList());
	},
	setUpSocketEvents: function(name, socket, game, cb) {
	    socket.on('drawCard', (cb) => game.drawCard(socket.id, cb));
	    socket.on('playCard',(card, cb) => game.playCard(socket.id, card, cb));
	    socket.on('removeCardFromPlay',(card, cb) => game.removeCardFromPlay(socket.id, card, cb));
	    socket.on('endTurn', () => game.endTurn(socket.id));
	    socket.on('tradeResource', (a, b, cb) => game.tradeResource(socket.id, a, b, cb));
	    socket.on('tradeCard', (a, cb) => game.tradeCard(socket.id, a, cb));
	    socket.on('replay',() => game.replay());
	    socket.on('disconnect', () => this.removePlayer(game, socket.id));

		game.login(name, socket, cb)

	}
}

module.exports = new GameManager;