function Chat(io, id) {
	this.io = io;
	this.allMessages = [];
	this.id = id;
}

Chat.prototype = {
	init: function(socket) {
		socket.join(this.id);
		socket.emit('allMessages', this.allMessages);
		this.listeners(socket);
	},
	listeners: function(socket) {
		socket.on('msg', (msg) => {
			var message = {id: socket.id, msg: msg};
			this.allMessages.push(message);
			this.io.to(this.id).emit('msg', message);
		})
	}

}

module.exports = Chat;