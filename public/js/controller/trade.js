app.controller('trade', function(game, socket, $timeout) {
	var self = this;
	this.resources = ['meat', 'water', 'brick'];
	this.currentResourcePurchase = 'meat';

	this.changePurchaseResource = function() {
		var index = this.resources.indexOf(this.currentResourcePurchase);
		if(index < this.resources.length - 1)index++;
		else index = 0;
		this.currentResourcePurchase = this.resources[index];
	}

	this.tradeResource = function(resource) {
		socket.emit('tradeResource', resource, this.currentResourcePurchase, function() {
			self.notEnoughResources = true;
			$timeout(() => (self.notEnoughResources = false), 2000);
		});
	}
	this.sellCard = function(card) {
		socket.emit('tradeCard', card, function() {
			self.cardNotAvailable = true;
			$timeout(() => (self.cardNotAvailable = false), 2000);
		});
	}
});