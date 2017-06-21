var Player = require('./player'),
	Card = require('./card'),
	cards = require('./lib/cards'),
	Chat = require('./chat');

function Game(io, id, pw) {
	this.player1;
	this.player2;

	this.io = io;
	this.id = id || Date.now();
	this.pw = pw;
	this.gameType = pw ? 'private' : 'public';

	this.cards = cards.map(v => new Card(v));

	this.chat = new Chat(io, this.id);

	this.createdAt = Date.now();
}

Game.prototype = {
	login: function (name, socket, cb) {
        var player = this.addPlayer(name, socket, cb);
        socket.loggedIn = true;
        
    },
	addPlayer: function(name, socket, cb) {
		var player;
		if(!this.player1){
			this.player1 = this.createPlayer(name, socket, this.oldPlayer);
			this.player1.turnAvailable = true;
			player = this.player1.client();
		} else if(!this.player2){
			this.player2 = this.createPlayer(name, socket, this.oldPlayer);
			player = this.player2.client();
			
		}

		this.player1 && this.player1.createOpponent(this.player2);
		this.player2 && this.player2.createOpponent(this.player1);

		this.oldPlayer = null;


		if(this.isFull()){
            this.getOpponent(socket.id).socket.emit('turnAvailable');
        }
        this.chat.init(socket);
        cb(player, this.id);


	},
	createPlayer: function(name, socket, oldPlayer) {
		return new Player(name, socket, socket.id, socket.handshake.address, oldPlayer);
	},
	removePlayer: function(id) {
		var opponent = this.getOpponent(id),
			player = this.player1 && this.player1.id === id ? 'player1' : 'player2';


		this.oldPlayer = this[player].client();
		
		this[player] = null;

		delete this.oldPlayer.id;
		delete this.oldPlayer.name;
		delete this.oldPlayer.ip;
		if(opponent)
			opponent.updateOpponent(null);
	},

	// Turn
	drawCard: function(id, cb) {
		var player = this.getPlayer(id),
			opponent = this.getOpponent(id),
			card;

		if(!opponent){
			this.sendToGame('globalError', 'Waiting on opponent');
			cb();
			return;
		}

		if(player.turnAvailable){
			card = this.cards[Math.floor(Math.random() * this.cards.length)];
			player.drawCard(card);
		}
		
		cb(card);
	},
	playCard: function(id, card, cb) {
		var player = this.getPlayer(id);
		if(player && player.turnAvailable)
			player.playCard(card, cb);
	},
	removeCardFromPlay: function(id, card, cb) {
		var player = this.getPlayer(id);
		if(player && player.turnAvailable)
			player.removeCardFromPlay(card, cb);
	},
	barterResources: function(id) {
		var player = this.getPlayer(id);
		if(player.turnAvailable){}

	},
	tradeResource: function(id, resource, getResource, cb) {
		var player = this.getPlayer(id);

		if(!player)return;

		if(player[resource] >= player.costOfResourceTrade){
			player[resource] -= player.costOfResourceTrade;
			player[getResource]++
			player.updateClient();
		}else{
			cb();
		}

	},
	tradeCard: function(id, card, cb) {
		var player = this.getPlayer(id);

		if(!player)return;

		if(player.hasCard(card)){
			for(var i in card.resourcesNeeded)
				player[i] += card.resourcesNeeded[i];
			player.removeCard(card);
			player.updateClient();
		}else{
			cb();
		}
	},
	endTurn: function(id) {
		var player = this.getPlayer(id),
			opponent = this.getOpponent(id);

		if(!player || !opponent)return;


		player.turnAvailable = false;

		if(opponent.playedCards.length){
			this.calculateDamage();
			if(this.player1.hp <= 0 || this.player2.hp <= 0){
				this.sendToGame('finishAttack', [this.player1.client(), this.player2.client()]);
				setTimeout(() => {
					this.player1.socket.emit('endGame', 'win');
					this.player2.socket.emit('endGame');
				}, 3000);
			}else{
				this.sendToGame('finishAttack', [this.player1.client(), this.player2.client()]);
				setTimeout(() => opponent.setTurnAvailable(player), 2000);
			}
		}else{
			opponent.setTurnAvailable(player);
		}
	},
	// End Turn

	isFull: function () {
		return this.player1 && this.player2;	
	},
	isEmpty: function() {
		return !this.player1 && !this.player2;	
	},
	updatePlayers: function() {
		if(this.player1)this.player1.updateClient();
		if(this.player2)this.player2.updateClient();	
	},
	getOpponent: function(id) {
		return this.player1 && this.player1.id === id ? this.player2 : this.player1;
	},
	getPlayer: function(id) {
		return this.player1 && this.player1.id === id ? this.player1 : this.player2;
	},
	getPlayerClients: function() {
		var Players = [];
		if(this.player1)Players.push(this.player1.client());
		if(this.player2)Players.push(this.player2.client());
		return Players;	
	},
	replay: function() {
		var player1 = this.player1.originalObj,
			player2 = this.player2.originalObj;
		this.player1 = null;
		this.player2 = null;

		this.addPlayer(player1);
		this.addPlayer(player2);
		this.sendToGame('replay', [this.player1.client(), this.player2.client()]);
	},
	sendRemoveToUsers: function() {
		if(this.player1)
			this.player1.logout();
		if(this.player2)
			this.player2.logout();
		this.sendToGame('disband');	
	},
	clearPlayers: function() {
		this.player1 = null;
		this.player2 = null;
	},
	sendToGame: function (event, data) {
		this.io.to(this.id).emit(event, data);
	},
	calculateDamage: function () {
		var player1 = this.player1,
	        player2 = this.player2,
	        dam1, dam2;


	    for(var i = 0; i < player1.playedCards.length; i++){
	        player1.playedCard.att += player1.playedCards[i].att || 0;
	        player1.playedCard.def += player1.playedCards[i].def || 0;
	    }
	    for(var i in player2.playedCards){
	        player2.playedCard.att += player2.playedCards[i].att || 0;
	        player2.playedCard.def += player2.playedCards[i].def || 0;
	    }

	    if(player1.playedCard && player2.playedCard){
	        dam1 = (player2.playedCard.att - player1.playedCard.def);
	        dam2 = (player1.playedCard.att - player2.playedCard.def);

	        if(dam1 > 0)
	            player1.hp -= dam1;
	        if(dam2 > 0)
	            player2.hp -= dam2;
	    }else if(player1.playedCard){
	        player2.hp -= player1.playedCard.att;
	    }else if(player2.playedCard){
	        player1.hp -= player2.playedCard.att;
	    }

	    player1.playedCard = {att: 0, def: 0};
	    player2.playedCard = {att: 0, def: 0};
	    player1.playedCards = [];
	    player2.playedCards = [];
	    player1.hasPlayedCards = false;
	    player2.hasPlayedCards = false;

	}
}

module.exports = Game;
