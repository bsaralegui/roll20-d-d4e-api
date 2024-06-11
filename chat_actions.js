var ChatActions = {
	// Add properties here for your actions
	gmWhisperPrefix: "/w gm ",
	systemSender: "System",
	sendChat: function(message, sender) {
		if(sender) {
			sendChat(sender, message);
		} else {
			sendChat(this.systemSender, message);
		}
	},
	sendGmChat: function(message, sender) {
		this.sendChat(`${this.gmWhisperPrefix} {message}`, sender);
	}
};