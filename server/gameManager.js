var Game = require('./game');

function GameManager() {
	this.privateGames = [];
	this.publicGames = [];
	this.playerWaiting;
}

GameManager.prototype = {
	joinMatchMaking: function(socket, io) {
		var gameJoined;

		if(this.publicGames.length){
			for(var i = 0; i < this.publicGames.length; i++){
				if(!this.publicGames[i].isFull()){
					gameJoined = true;
					this.setUpSocketEvents(socket, this.publicGames[i]);
				}
			}

			if(!gameJoined){
				this.createGame(true, socket, io);
			}
		}else{
			this.createGame(true, socket, io);
		}
	},
	createGame: function(public, socket, io) {
		var game = new Game(io);

		if(public)
			this.publicGames.push(game);
		else
			this.privateGames.push(game);
		
		this.setUpSocketEvents(socket, game);

		return game;
	},
	joinGame: function(id, socket) {
		var game = this.getGame(id);

		if(game){
			if(!game.isFull()){
				this.setUpSocketEvents(socket, game);
			}else{
				return 'full';
			}
		}else{
			return false;
		} 
	},
	leaveGame: function(id, user) {
		var game = this.getGame(id);

		if(game){
			game.leaveGame(user);
		}
	},
	getPrivateGame: function(id) {
		return this.publicGames.map(v => v.id === id)[0];
	},
	setUpSocketEvents: function(socket, game) {
		socket.on('login', (name, cb) => game.login(name, socket, cb));
	    socket.on('drawCard', (cb) => game.drawCard(socket.id, cb));
	    socket.on('playCard',(card, cb) => game.playCard(socket.id, card, cb));
	    socket.on('removeCardFromPlay',(card, cb) => game.removeCardFromPlay(socket.id, card, cb));
	    socket.on('endTurn', () => game.endTurn(socket.id));
	    socket.on('tradeResource', (a, b, cb) => game.tradeResource(socket.id, a, b, cb));
	    socket.on('tradeCard', (a, cb) => game.tradeCard(socket.id, a, cb));
	    socket.on('replay',() => game.replay());
	    socket.on('disconnect', () => game.removePlayer(socket.id));
	}
}

module.exports = new GameManager;