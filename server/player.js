function Player(name, socket, id, ip, playerObj) {
	this.hp = 100;
	this.id = id;
	this.ip = ip;
	this.name = name;
	this.meat = 0;
	this.water = 0;
	this.brick = 0;
	this.leaf = 0;
	this.creature = {};
	this.defense  = {};
	this.playedCards = [];
	this.playedCard = {att: 0, def: 0};

	this.costOfResourceTrade = 3;
	this.maxCardsPlayedAtATime = 4;

	this.socket = socket;

	for(var i in playerObj)
		this[i] = playerObj[i];

}

Player.prototype = {
	drawCard: function(card) {
		if(card){
            if(card.type === 'resource'){
                this[card.id] += card.total;
            }else{
                if(!this[card.type][card.id]){
                    this[card.type][card.id] = [];
                }
                this[card.type][card.id].push(card);
            }

        }
	},
	playCard: function(card, cb) {
		if(!card)return;
		
		var cardCanBePlayed = true;

		// Check if we have available resources
        for(var i in card.resourcesNeeded){
            if(this[i] < card.resourcesNeeded[i]){
                cardCanBePlayed = false;
            }
        }

        // Check if we have the card
        if(cardCanBePlayed && card && this[card.type] && this[card.type][card.id]){
        	if(this.playedCards.length >= this.maxCardsPlayedAtATime){
        		this.socket.emit('gameMessage', 'You can only play 4 cards at a time');
        		return;
        	}
        	// Remove resources
            for(var i in card.resourcesNeeded)
                this[i] -= card.resourcesNeeded[i];

            card.isPlayed = true;
            this.playedCards.push(card);
            
            // Remove card
            for(var i in this[card.type])
                if(this[card.type][i].length && this[card.type][i][0].id === card.id)this[card.type][i].pop();


        	this.updateClient();
        }else{
    		this.socket.emit('gameMessage', 'Not enough resources');
        }

	},
	removeCardFromPlay: function(card, cb) {

		// Put card back in inventory
		this.drawCard(card);

		// Get resources back
		for(var i in card.resourcesNeeded)
			this[i] += card.resourcesNeeded[i];

		// Remove card from played
		for(var i = 0; i < this.playedCards.length; i++){
			if(this.playedCards[i].id === card.id){
				this.playedCards.splice(i, 1);
				break;
			}
		}

		console.log(this.playedCards);
		this.updateClient();
	},
	hasCard: function(card) {
		return this[card.type][card.id].length;
	},
	removeCard: function(card) {
		this[card.type][card.id].pop();
	},
	// [{name: 'T-Rex', total: 10}, {name: 'Pteradactol', total 3}]
	getList: function (type) {
		return Object.keys(this[type]).map(v => ({name: v, total: this[type][v].length}));
	},
	emit: function(event, data) {
		this.socket.emit(event, data);
	},
	updateClient: function() {
		this.socket.emit('updatePlayer', this.client());	
	},
	updateOpponent: function(opponent) {
		this.socket.emit('updateOpponent', this.getOpponentClient(opponent));
	},
	createOpponent: function(opponent) {
		this.socket.emit('createOpponent', this.getOpponentClient(opponent));
	},
	setTurnAvailable: function(opponent) {
		this.turnAvailable = true;
		this.socket.emit('turnAvailable', this.getOpponentClient(opponent));	
	},
	getOpponentClient: function (opponent) {
		return opponent && opponent.client ? opponent.client() : opponent;
	},

	logout: function() {
		this.socket.loggedIn = false;
	},
	client: function() {
		return {
			name: this.name,
			id: this.id,
			hp: this.hp,
			creature: this.creature,
			defense: this.defense,
			meat: this.meat,
			water: this.water,
			brick: this.brick,
			leaf: this.leaf,
			playedCards: this.playedCards,
			costOfResourceTrade: this.costOfResourceTrade
		}
	}
}

module.exports = Player;