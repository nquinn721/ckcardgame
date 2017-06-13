app.controller('chat', function(game, chat, socket) {
	this.messages = [];

	this.sendMessage = function() {
		socket.emit('msg', this.chatMessage);
		this.chatMessage = null;
	}

	this.updateChat = function(msg) {
		var player = game.getPlayer(msg.id);
		this.messages.push({msg: msg.msg, user: player.name});
	}

	chat.allMessages.map((msg) => this.updateChat(msg));

	socket.on('msg', (msg) => this.updateChat(msg))
	
});