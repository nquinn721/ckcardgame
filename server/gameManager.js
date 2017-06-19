var Game = require('./game');

function GameManager() {
	this.privateGames = [];
	this.publicGames = [];
	this.playerWaiting;
}

GameManager.prototype = {
	joinPublicGame: function(name, socket, io, cb) {
		var gameJoined;

		if(this.publicGames.length){
			for(var i = 0; i < this.publicGames.length; i++){
				if(!this.publicGames[i].isFull()){
					gameJoined = true;
					this.setUpSocketEvents(name, socket, this.publicGames[i], cb);
				}
			}

			if(!gameJoined){
				this.createGame(name, null, true, socket, io, cb);
			}
		}else{
			this.createGame(name, null, true, socket, io, cb);
		}
	},
	joinPrivateGame: function(name, gameName, io, socket, cb) {
		var game = this.getPrivateGame(gameName);
		if(game && !game.isFull()){
			this.setUpSocketEvents(name, socket, game, cb);
		}else{
			cb('full');
		}
	},
	createPrivateGame: function(name, gameName, io, socket, cb){
		var game = this.getPrivateGame(gameName);

		if(!game){
			this.createGame(name, gameName, false, socket, io, cb);
		}else{
			cb('not available');
		}
	},
	createGame: function(name, gameName, public, socket, io, cb) {
		var game = new Game(io, gameName);

		if(public)
			this.publicGames.push(game);
		else
			this.privateGames.push(game);

		this.setUpSocketEvents(name, socket, game, cb);
		return game;
	},
	
	leaveGame: function(id, user) {
		var game = this.getGame(id);

		if(game){
			game.leaveGame(user);
		}
	},
	getPrivateGame: function(name) {
		return this.privateGames.filter(v => v.name === name)[0];
	},
	getPrivateGamesList: function() {
		return this.privateGames.filter(v => !v.isFull()).map(v => ({name: v.name, id: v.id}));
	},
	setUpSocketEvents: function(name, socket, game, cb) {
	    socket.on('drawCard', (cb) => game.drawCard(socket.id, cb));
	    socket.on('playCard',(card, cb) => game.playCard(socket.id, card, cb));
	    socket.on('removeCardFromPlay',(card, cb) => game.removeCardFromPlay(socket.id, card, cb));
	    socket.on('endTurn', () => game.endTurn(socket.id));
	    socket.on('tradeResource', (a, b, cb) => game.tradeResource(socket.id, a, b, cb));
	    socket.on('tradeCard', (a, cb) => game.tradeCard(socket.id, a, cb));
	    socket.on('replay',() => game.replay());
	    socket.on('disconnect', () => game.removePlayer(socket.id));

		game.login(name, socket, cb)

	}
}

module.exports = new GameManager;