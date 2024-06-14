/**
 * A collection of Roll20 Chat Actions
 * @module ChatActions
 * @class ChatActions
 *
 * The following actions are available:
 * - sendChat - Sends a chat message
 * - sendChatFromPlayer - Sends a chat message as a player
 * - sendChatToGM - Sends a chat message to the GM
 */
class ChatActions {

	// Add properties here for your actions
	constructor() {
		// Add properties here for your actions
		this.gmWhisperPrefix = "/w gm ";
		this.systemSender = "System";
	}

	/**
	 * Sends a chat message.
	 *
	 * @param {string} message - The message to be sent
	 * @param {string} sender - Optional. The sender of the message. Defaults to "System"
	 */
	sendChat(message, sender = this.systemSender) {
		sendChat(this.systemSender, message);
	}

	/**
	 * Sends a chat message as a player.
	 *
	 * @param {string} message - The message to be sent
	 * @param {string} playerid - The player ID for sending the message
	 */
	sendChatFromPlayer(message, playerid) {
		// Implementation for sending a chat message as a player
		sendChat(`player|${playerid}`, message);
	}

	/**
	 * Sends a chat message to the GM
	 *
	 * @param {string} message - The message to be sent
	 * @param {string} sender - Optional. The sender of the message. Defaults to "System"
	 */
	sendGmChat(message, sender) {
		this.sendChat(`${this.gmWhisperPrefix} {message}`, sender);
	}
}