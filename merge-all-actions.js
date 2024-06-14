/**
 * This is the main entry point for the script on Roll20 for the D&D 4th Edition Character Sheet.
 *
 * The following actions are available/handled by this script for the character/token selected:
 * - setHP - Sets the value of the HP bar (Red bar)
 * - useActionPoint - Uses an action point
 * - spendHealingSurge - Spends a healing surge
 * - makeMeleeBasicAttack - Makes a basic attack
 * - takeShortRest - Takes a short rest
 * - takeLongRest - Takes a long rest
 */
on('chat:message', function(msg) {
	// Check if the message type is "api"
	if (msg.type === "api") {
		// Split the message content into arguments
		let args = msg.content.split(' ');
		// Extract the command from the arguments
		let command = args.shift();

		// Set the selected token
		let character = new CharacterActions(msg.selected, msg.playerid);

		// Determine the command and execute corresponding action
		switch (command) {
			case '!setHP':
				// Handle setting HP
				character.handleSetHP(args);
				break;
			case '!useActionPoint':
				// Handle using an action point
				character.handleUseActionPoint();
				break;
			case '!spendHealingSurge':
				// Handle spending a healing surge
				character.spendHealingSurge(args);
				break;
			case '!makeMeleeBasicAttack':
				// Handle making a melee basic attack
				character.makeMeleeBasicAttack(args);
				break;
			case '!takeShortRest':
				// Handle taking a short rest
				character.handleShortRest(args);
				break;
			case '!takeLongRest':
				// Handle taking a long rest
				character.handleLongRest(args);
				break;
			default:
				// Send a chat message for unknown command
				ChatActions.sendChat("Unknown command: " + command);
		}
	}
});
