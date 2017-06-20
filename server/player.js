function Player(name, socket, id, ip, playerObj) {
	this.hp = 100;
	this.id = id;
	this.ip = ip;
	this.name = name;
	this.meat = 0;
	this.water = 0;
	this.brick = 0;
	this.creature = {};
	this.defense  = {};
	this.playedCards = [];
	this.playedCard = {att: 0, def: 0};
	this.costOfResourceTrade = 3;

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
        	cb();
        }

	},
	removeCardFromPlay: function(card, cb) {

		this.drawCard(card);

		for(var i in card.resourcesNeeded)
			this[i] += card.resourcesNeeded[i];

		this.playedCards.splice(this.playedCards.indexOf(card), 1);


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
	updateClient: function() {
		this.socket.emit('updatePlayer', this.client());	
	},
	updateOpponent: function(opponent) {
		opponent = opponent && opponent.client ? opponent.client() : opponent;
		this.socket.emit('updateOpponent', opponent);
	},
	createOpponent: function(opponent) {
		opponent = opponent && opponent.client ? opponent.client() : opponent;
		this.socket.emit('createOpponent', opponent);
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
			playedCards: this.playedCards,
			costOfResourceTrade: this.costOfResourceTrade
		}
	}
}

module.exports = Player;