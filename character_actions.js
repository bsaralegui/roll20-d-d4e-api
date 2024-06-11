var CharacterActions = {
	// Add properties here for your actions
	hpBar: "bar3",
	actionPoints: "action-points",
	actionPointEffects: "additiona-effects",

	// Use magic getters and setters
	get selected() {
		if(this._selected === null) {
			ChatActions.sendChat("Error: No token selected.", "System");
		}
		return this._selected;
	},

	set selected(selected) {
		if (selected && selected.length > 0) {
			this._selected = selected;
		} else {
			this._selected = null;
		}
	},

	setSelected: function(selected) {
		this.selected = selected;
		return this;
	},

	get token() {
		return getObj('graphic', this.selected[0]._id);
	},

	get character() {
		return getObj('character', this.token.get('represents'));
	},

	getCharacterAttribute: function(attribute) {
		return getAttrByName(this.character.id, attribute);
	},

	getAttributeObject: function(attribute) {
		return findObjs({ type: 'attribute', characterid: this.character.id, name: attribute })[0];
	},

	handleSetHP: function(args) {
		let newHP = parseInt(args[0], 10);
		if (this.token) {
			this.token.set(`${this.hpBar}_value`, newHP);
			ChatActions.sendGmChat("HP updated to " + newHP);
		}
	},

	handleUseActionPoint: function(sender) {
		if (this.character) {
			let remainingPoints = this.getCharacterAttribute(this.actionPoints);
			if (remainingPoints <= 0) {
				ChatActions.sendChat(`${this.character.get('name')} attempted to use an Action Point, but has no more gas left in the tank`, sender);
			} else {
				const actionPointEffects = this.getCharacterAttribute(this.actionPointEffects);
				let actionPoints = this.getAttributeObject(this.actionPoints);
				actionPoints.set('current', remainingPoints - 1);
				ChatActions.sendChat(`${this.character.get('name')} uses an Action Point (${actionPoints.get('current')} remaining). ${(actionPointEffects === '') ? '' : actionPointEffects}`, sender);
			}
		}
	}
};