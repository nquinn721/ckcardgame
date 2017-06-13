function Chat(io) {
	this.io = io;
	this.allMessages = [];
}

Chat.prototype = {
	init: function(socket) {
		socket.emit('allMessages', this.allMessages);
		this.listeners(socket);
	},
	listeners: function(socket) {
		socket.on('msg', (msg) => {
			var message = {id: socket.id, msg: msg};
			this.allMessages.push(message);
			this.io.emit('msg', message);
		})
	}

}

module.exports = Chat;