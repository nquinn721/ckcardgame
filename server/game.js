var Player = require('./player'),
	Card = require('./card'),
	cards = require('./lib/cards'),
	Chat = require('./chat');

function Game(io, name) {
	this.player1;
	this.player2;

	this.io = io;
	this.id = Date.now();
	this.name = name || null;

	this.cards = cards.map(v => new Card(v));

	this.chat = new Chat(io, this.id);
}

Game.prototype = {
	login: function (name, socket, cb) {
        var player = this.addPlayer({
            name: name,
            hp: 100,
            id: socket.id,
            ip: socket.handshake.address,
            socket: socket
        });
        socket.loggedIn = true;
        if(this.isFull()){
            this.getOpponent(socket.id).socket.emit('turnAvailable');
        }
        this.chat.init(socket);
        cb(player, this.name);
    },
	addPlayer: function(playerObj) {
		if(!this.player1){
			this.player1 = new Player(playerObj);
			this.player1.turnAvailable = true;
			return this.player1.client();
		} else if(!this.player2){
			this.player2 = new Player(playerObj);
			this.player1.createOpponent(this.player2.client());
			this.player2.createOpponent(this.player1.client());
			return this.player2.client();
		} else{
			return false;
		}
	},
	removePlayer: function(id) {
		if(this.player1 && this.player1.id === id)
			this.player1 = null;
		if(this.player2 && this.player2.id === id)
			this.player2 = null;
	},

	// Turn
	drawCard: function(id, cb) {
		var player = this.getPlayer(id),
			card;

		if(player.turnAvailable){
			card = this.cards[Math.floor(Math.random() * this.cards.length)];
			player.drawCard(card);
		}
		
		cb(card);
	},
	playCard: function(id, card, cb) {
		var player = this.getPlayer(id);
		if(player.turnAvailable)
			player.playCard(card, cb);
	},
	removeCardFromPlay: function(id, card, cb) {
		var player = this.getPlayer(id);
		if(player.turnAvailable)
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

		
		player.turnAvailable = false;
		opponent.turnAvailable = true;
		opponent.socket.emit('turnAvailable', player.client());

		if(opponent.playedCards.length){
			this.calculateDamage();
			if(this.player1.hp <= 0 || this.player2.hp <= 0){
				this.player1.socket.emit('endGame', 'win');
				this.player2.socket.emit('endGame');
			}else{
				this.io.emit('finishAttack', [this.player1.client(), this.player2.client()]);
			}
		}
	},
	// End Turn

	isFull: function () {
		return this.player1 && this.player2;	
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
		this.io.emit('replay', [this.player1.client(), this.player2.client()]);
	},
	clearPlayers: function() {
		this.player1 = null;
		this.player2 = null;
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
	    player1.playedCards = {};
	    player2.playedCards = {};
	    player1.hasPlayedCards = false;
	    player2.hasPlayedCards = false;

	}
}


module.exports = Game;