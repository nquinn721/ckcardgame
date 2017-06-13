app.factory('chat', function(){
	function Chat() {
		this.allMessages = [];
	}

	Chat.prototype = {
		setAllMessages: function(msgs){
			this.allMessages = msgs;
		}
	}

	return new Chat;
});