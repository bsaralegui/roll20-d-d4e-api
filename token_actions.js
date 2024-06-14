/**
 * A collection of Roll20 Token Actions
 * @module TokenActions
 * @class TokenActions
 *
 * The following actions are available for the token selected:
 * - setGreenBar - Sets the value of the green bar
 * - setBlueBar - Sets the value of the blue bar
 * - setRedBar - Sets the value of the red bar
 *
 */
class TokenActions extends ChatActions{
	constructor(selected) {
		super();
		this.setSelected(selected);
		this._token = null;

		// Add properties here for your actions
		this.bar1 = "bar1"; // Green bar on the token
		this.bar2 = "bar2"; // Blue bar on the token
		this.bar3 = "bar3"; // Red bar on the token
	}

	// Use magic getters and setters
	/**
	 * Get the selected item.
	 * If no item is selected, send an error message.
	 * @returns {Object} The selected item
	 */
	get selected() {
		if(this._selected === null) {
			ChatActions.sendChat("Error: No token selected.", "System");
		}
		return this._selected;
	}

	/**
	 * Sets the selected value based on the input.
	 * If the input is valid and not empty, sets the selected value to the input.
	 * Otherwise, sets the selected value to null.
	 *
	 * @param {any} selected - The selected value to set.
	 */
	set selected(selected) {
		if (selected && selected.length > 0) {
			this._selected = selected;
		} else {
			this._selected = null;
		}
	}

	/**
	 * Sets the selected value.
	 *
	 * @param {any} selected - The selected value to set.
	 * @returns {Object} - Returns the current object instance.
	 */
	setSelected(selected) {
		this.selected = selected;
		return this;
	}

	/**
	 * Gets the token associated with the selected graphic.
	 * @returns {object} The token object.
	 */
	get token() {
		return getObj('graphic', this.selected[0]._id);
	}

	/**
	 * Gets the character object associated with the token.
	 *
	 * @returns {object} - The character object represented by the token.
	 */
	get character() {
		return getObj('character', this.token.get('represents'));
	}

	/**
	 * Sets the value of the green bar
	 * @param {number} value - The value to set for the green bar
	 */
	setGreenBar(value) {
		this.token.set(`${this.bar1}_value`, value);
	}

	/**
	 * Sets the value of the blue bar
	 * @param {number} value - The value to set for the blue bar
	 */
	setBlueBar(value) {
		this.token.set(`${this.bar2}_value`, value);
	}

	/**
	 * Sets the value of the red bar
	 * @param {number} value - The value to set for the red bar
	 */
	setRedBar(value) {
		this.token.set(`${this.bar3}_value`, value);
	}
}