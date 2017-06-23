app.controller('chat', function(game, chat, socket) {
	this.messages = [];

	this.sendMessage = function() {
		console.log(this.chatMessage);
		socket.emit('msg', this.chatMessage);
		this.chatMessage = null;
	}

	this.updateChat = function(msg) {
		console.log(msg);
		this.messages.push(msg);
	}

	chat.allMessages.map((msg) => this.updateChat(msg));

	socket.on('msg', (msg) => this.updateChat(msg))
	
});