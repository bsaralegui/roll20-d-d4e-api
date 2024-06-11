on('chat:message', function(msg) {
	if (msg.type === "api") {
		let args = msg.content.split(' ');
		let command = args.shift();

		// Set the selected token
		CharacterActions.setSelected(msg.selected);

		switch (command) {
			case '!setHP':
				CharacterActions.handleSetHP(args);
				break;
			case '!useActionPoint':
				CharacterActions.handleUseActionPoint(msg.who);
				break;
			default:
				ChatActions.sendGmChat("Unknown command: " + command);
		}
	}
});
