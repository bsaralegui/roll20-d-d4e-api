/**
 * A collection of Roll20 Character Actions
 * @module CharacterActions
 * @class CharacterActions
 *
 * The following actions are available:
 * - getHalfLevel - Returns half of the current level
 * - getAbilityModifier - Calculates and returns the ability modifier for the specified ability
 * - getAbilityScore - Calculates and returns the ability score for the specified ability
 * - getCharacterAttribute - Returns the current value of the specified attribute
 * - setCharacterAttribute - Sets the value of the specified attribute
 *
 */
class CharacterActions extends TokenActions{
	constructor(selected, playerId) {
		super(selected);
		this.playerId = playerId;

		// Add properties here for your actions
		this.hp = "hp";
		this.hpTemp = "tmp-hp";
		this.hpBloodied = "hp-bloodied";
		this.deathSavingThrow1 = "deathone";
		this.deathSavingThrow2 = "deathtwo";
		this.deathSavingThrow3 = "deaththree";
		this.surges = "surges";
		this.surgeValue = "surge-value";
		this.surgeBonusValue = "surge-value-bonus";
		this.actionPoints = "action-points";
		this.actionPointEffects = "additiona-effects";
		this.ac = "ac";
		this.fort = "fort";
		this.ref = "ref";
		this.will = "will";
		this.cha = "cha";
		this.armor = "armor";
		this.strengthMod = "strength-mod";
		this.dexterityMod = "dexterity-mod";
		this.intelligenceMod = "intelligence-mod";
		this.wisdomMod = "wisdom-mod";
		this.constitutionMod = "constitution-mod";
		this.charismaMod = "charisma-mod";
		this.weaponName1 = "weapon-1-name";
		this.weaponName2 = "weapon-2-name";
		this.weaponName3 = "weapon-3-name";
		this.weaponName4 = "weapon-4-name";
		this.weaponName5 = "weapon-5-name";
		this.weaponName6 = "weapon-6-name";
		this.weaponAttack1 = "weapon-1-attack";
		this.weaponAttack2 = "weapon-2-attack";
		this.weaponAttack3 = "weapon-3-attack";
		this.weaponAttack4 = "weapon-4-attack";
		this.weaponAttack5 = "weapon-5-attack";
		this.weaponAttack6 = "weapon-6-attack";
		this.weaponDamage1 = "weapon-1-damage";
		this.weaponDamage2 = "weapon-2-damage";
		this.weaponDamage3 = "weapon-3-damage";
		this.weaponDamage4 = "weapon-4-damage";
		this.weaponDamage5 = "weapon-5-damage";
		this.weaponDamage6 = "weapon-6-damage";
	}

	/**
	 * Returns half of the current level of the character.
	 * @returns {number} Half of the current level
	 */
	getHalfLevel() {
		// Get the current level of the character
		const currentLevel = this.getCharacterAttribute("level", "current");

		// Calculate and return half of the current level
		return Math.floor(currentLevel / 2);
	}

	/**
	 * Calculates and returns the ability modifier for the specified ability.
	 *
	 * @param {string} abilityName - The name of the ability to calculate the modifier for.
	 * @returns {number} - The calculated ability modifier value.
	 */
	getAbilityMod(abilityName) {
		// Calculate the ability modifier based on the current attribute value
		return Math.floor((this.getCharacterAttribute(abilityName, "current") - 10) / 2);
	}

	// Use magic getters and setters
	/**
	 * Gets the character attribute based on the provided attribute name and whether it is 'current' or 'max'.
	 *
	 * @param {string} attribute - The name of the attribute to retrieve.
	 * @param {string} currentOrMax - Specifies whether to get the 'current' or 'max' value of the attribute.
	 * @returns {string|number} - The value of the specified attribute.
	 */
	getCharacterAttribute(attribute, currentOrMax) {
		return getAttrByName(this.character.id, attribute, currentOrMax);
	}

	/**
	 * Get the current attribute value.
	 * @param {string} attribute - The attribute to retrieve the current value for.
	 * @returns {any} - The current value of the specified attribute.
	 */
	getCurrentAttributeValue(attribute) {
		return this.getCharacterAttribute(attribute, "current");
	}

	/**
	 * Gets the maximum attribute value for a given attribute.
	 *
	 * @param {string} attribute - The attribute to retrieve the maximum value for.
	 * @returns {number} - The maximum value of the attribute.
	 */
	getMaxAttributeValue(attribute) {
		return this.getCharacterAttribute(attribute, "max");
	}

	getAttributeObject(attribute) {
		return findObjs({ type: 'attribute', characterid: this.character.id, name: attribute })[0];
	}

	/**
	 * Gets the total healing surge value for the character.
	 *
	 * @param {number} bonus - The additional bonus value to add to the total healing surge.
	 * @returns {number} - The total healing surge value including any bonus.
	 */
	getHealingSurgeTotal(bonus = 0) {
		// Parse the base healing surge value and add the bonus
		return Number(this.getCurrentAttributeValue(this.surgeValue))
			+ Number(this.getCurrentAttributeValue(this.surgeBonusValue))
			+ bonus;
	}

	/**
	 * Handles setting an attribute for a character.
	 *
	 * @param {string} attribute - The attribute to be updated.
	 * @param {string|number} value - The new value for the attribute.
	 * @returns {CharacterActions} - Returns the CharacterActions object.
	 */
	setCurrentAttributeValue(attribute, value) {
		// Check if a character is selected
		if (this.character) {
			// Get the attribute object
			const attributeObject = this.getAttributeObject(attribute);
			// Set the current value of the attribute
			attributeObject.set('current', value);
			// Send a GM chat message about the attribute update
			this.sendChat(`${this.getCharacterName()}: Current Surges updated to ${value}`);
		} else {
			// Send an error message if no character is selected
			this.sendChat("Error: No character selected.", "System");
		}
		// Return the CharacterActions object
		return this;
	}

	/**
	 * Gets the name of the character.
	 * @returns {string} The name of the character.
	 */
	getCharacterName() {
		return this.character.get('name');
	}

	/**
	 * Sends a chat message as a player.
	 *
	 * @param {string} message - The message to be sent
	 */
	sendChatAsPlayer(message) {
		// Call sendChatFromPlayer with the message and player ID
		this.sendChatFromPlayer(message, this.playerId);
	}

	/**
	 * Function to heal the character's HP by a specified amount.
	 *
	 * Will perform the following actions:
	 * - Get the maximum HP of the character
	 * - Get the current HP of the character
	 * - Calculate the new HP after healing, ensuring it does not exceed the maximum HP
	 * - Set the character's HP to the new value
	 *
	 * @param {number} amount - The amount by which to heal the character's HP.
	 */
	healHp(amount) {
		if (this.token) {
			// Get the maximum HP of the character
			let maxHp = this.getMaxAttributeValue(this.hp);
			// Get the current HP of the character
			let currentHp = this.getCurrentAttributeValue(this.hp);
			// Calculate the new HP after healing, ensuring it does not exceed the maximum HP
			let newHp = Math.min(amount + currentHp, maxHp);
			log(`Current HP: ${currentHp}, Max HP: ${maxHp}, Healing: ${amount}, New HP: ${newHp}`);
			// Set the character's HP to the new value
			this.setRedBar(newHp);
		}
	}

	/**
	 * Handles setting the character's HP to the value provided. If no value is provided, sets the HP to 0.
	 *
	 * Will perform the following actions:
	 * - Parse the new HP value from the arguments
	 * - Set the red bar to the new HP value
	 * - Notify the GM about the HP update
	 *
	 * @param {Array} args - An array containing the new HP value.
	 */
	handleSetHP(args) {
		// Parse the new HP value from the arguments
		const newHp = parseInt(args[0], 10) || 0;
		const previousHp = this.getCurrentAttributeValue(this.hp);

		// Set the red bar to the new HP value
		this.setRedBar(newHp);

		// Notify the GM about the HP update
		this.sendGmChat(`HP updated to ${newHp} from ${previousHp}`);
	}

	/**
	 * Handles the usage of an action point by a character.
	 *
	 * Will perform the following actions:
	 * - Check if a character is selected
	 * - Get the remaining action points
	 * - If the remaining points are less than or equal to 0
	 *   - Send a chat message about the character attempting to use an action point with no points left
	 * - Otherwise
	 *   - Get the action point effects
	 *   - Decrease the current action points by 1
	 *   - Send a chat message about the character using an action point with the remaining points and effects
	 *
	 * @returns {CharacterActions} - Returns the CharacterActions object
	 */
	handleUseActionPoint() {
		// Check if a character is selected
		if (this.character) {
			// Get the remaining action points
			let remainingPoints = this.getCharacterAttribute(this.actionPoints);

			// If the remaining points are less than or equal to 0
			if (remainingPoints <= 0) {
				// Send a chat message about the character attempting to use an action point with no points left
				this.sendChatAsPlayer(`${this.getCharacterName()} attempted to use an Action Point, but has no more gas left in the tank`);

			} else {
				// Get the action point effects
				const actionPointEffects = this.getCharacterAttribute(this.actionPointEffects);

				// Decrease the current action points by 1
				this.setCurrentAttributeValue(this.actionPoints, remainingPoints - 1);

				// Send a chat message about the character using an action point with the remaining points and effects
				this.sendChatAsPlayer(`${this.getCharacterName()} uses an Action Point (${this.getCurrentAttributeValue(this.actionPoints)} remaining).\n${(actionPointEffects === '') ? '' : actionPointEffects}`);
			}
		}

		// Return the CharacterActions object
		return this;
	}

	/**
	 * Spends a healing surge for the character with an optional bonus.
	 *
	 * Bonus defaults to 0 if not provided.
	 *
	 * @param {Array} args - An array of arguments, with the first element being the bonus value to add to each healing
	 * surge used.
	 */
	spendHealingSurge(args) {
		// Parse the bonus value from the arguments or default to 0 if not a number
		let bonus = isNaN(args[0]) ? 0 : Number(args[0]);

		// Call the useHealingSurge function with the bonus value
		this.useHealingSurge(bonus);
	}

	/**
	 * Uses a healing surge to heal the character
	 *
	 * Will perform the following actions:
	 * - Get the current number of healing surges
	 * - Check if there are any healing surges left
	 * - Calculate the total healing amount including any bonus
	 * - Heal the character by the calculated amount
	 * - Send a chat message about the character using a healing surge
	 *
	 * @param {number} bonus - The bonus amount to be added to the healing surge
	 */
	useHealingSurge(bonus) {
		// Get the current number of healing surges
		const surges = this.getCharacterAttribute(this.surges);

		// Check if there are any healing surges left
		if (surges > 0) {
			// Calculate the total healing amount including any bonus
			const heal = this.getHealingSurgeTotal(bonus);

			// Heal the character by the calculated amount
			this.healHp(heal);

			// Send a chat message about the character using a healing surge
			this.sendChatAsPlayer(`${this.getCharacterName()} used a Healing Surge to recover ${heal} HP (${bonus} bonus). ${surges - 1} healing surges remaining`);

			// Decrease the number of healing surges by 1
			this.setCurrentAttributeValue(this.surges, surges - 1);
		} else {
			// Send a chat message if there are no healing surges left
			this.sendChatAsPlayer(`${this.getCharacterName()} attempted to use a Healing Surge, but has no more gas left in the tank`);
		}
	}

	/**
	 * Splits and retrieves auto-calculated attributes.
	 *
	 * @param {string} calculatedAttribute - The auto-calculated attribute to process. Will contain the `+` and `@`
	 * characters. For example, `+@{str}`.
	 * @returns {Array} - An array of current attribute values for the specified auto-calculated attribute.
	 */
	splitAutoCalculatedAttributes(calculatedAttribute) {
		// Get the current attribute value
		let attributeValue = this.getCurrentAttributeValue(calculatedAttribute);

		// Split the attribute value into an array of current attribute values, then reduce it to a single string
		return attributeValue.split('+').reduce( (acc, val) => {
			// Initialize the start and end positions
			let startPosition = val.indexOf(`{`);
			let endPosition = val.indexOf(`}`);

			// Check if the start and end positions are valid
			if (startPosition === -1 || endPosition === -1) {
				// If not, return the accumulator
				return acc;
			}

			// Process the current value and add it to the accumulator
			acc += `${this.getCurrentAttributeValue(val.slice(startPosition + 1, endPosition))} [${val.slice(startPosition + 1, endPosition)}] +`;

			// Return the accumulator
			return acc;
		}, '').slice(0, -1);
	}

	/**
	 * Makes a melee attack using the specified weapon number.
	 *
	 * Sends a chat message about to roll the attack using the specified weapon number hit and damage bonuses:
	 * - Weapon Proficiency
	 * - Weapon Enhancement
	 * - Weapon Class
	 * - Feat
	 * - Misc
	 * - Strength modifier
	 * - Half level
	 *
	 * @param {number} weaponNumber - The number of the weapon to use for the attack.
	 */
	makeMeleeAttack(weaponNumber = 1) {
		// Get the Attack bonus for the weaponNumber
		const weaponAttackBonuses = this.splitAutoCalculatedAttributes(this[`weaponAttack${weaponNumber}`]);

		// Get the Damage bonuses for the weaponNumber
		const weaponDamageBonuses = this.splitAutoCalculatedAttributes(this[`weaponDamage${weaponNumber}`]);

		const numberOfDamageDice = this.getCurrentAttributeValue(`weapon-${weaponNumber}-num-dice`);
		const sizeOfDamageDice = this.getCurrentAttributeValue(`weapon-${weaponNumber}-dice`);

		// Construct the roll text for the attack
		const rollText = '/roll [[1d20 + ' + weaponAttackBonuses
			+ ' + ' + this.getAbilityMod('strength') + ' [Strength mod] '
			+ ' + ' + this.getHalfLevel() + ' [Half level] ]] vs AC. Damage: [['
			+ numberOfDamageDice + 'd' + sizeOfDamageDice
			+ ' + ' + this.getAbilityMod('strength') + ' [Strength mod] '
			+ ' + ' + weaponDamageBonuses + ']] damage';
		log(rollText);

		// Send the attack roll text
		this.sendChatAsPlayer(rollText);
	}

	/**
	 * This function makes a melee basic attack based on the arguments provided.
	 * If the weapon number is not a valid number or greater than 6, it defaults to 1.
	 * It then calls makeMeleeAttack with the weapon number.
	 *
	 * @param {array} args - An array of arguments for the attack
	 */
	makeMeleeBasicAttack(args) {
		let weaponNumber = Number(args[0]);
		weaponNumber = isNaN(weaponNumber) || weaponNumber > 6 || weaponNumber < 1 ? 1 : weaponNumber;

		// Get the total bonuses for the character
		this.makeMeleeAttack(weaponNumber);
	}

	/**
	 * Handles a short rest action for the character.
	 *
	 * The following actions are performed:
	 * - Spend healing surges, if any
	 * - Reset any Encounter powers
	 * - Send a chat message
	 *
	 * @param {Array} args - An array of arguments, with the first element representing the number of healing surges and
	 * the second element being a bonus value.
	 *
	 * If the number of surges is not a number, it defaults to 0.
	 * If the bonus value is not a number, it defaults to 0.
	 */
	handleShortRest(args) {
		// Initialize audit text for logging
		let auditText = `${this.getCharacterName()} takes a short rest.`;

		// Parse the number of surges and bonus value from the arguments
		let surges = Number(args[0]);
		surges = isNaN(surges) || surges < 0 ? 0 : surges;
		let bonus = Number(args[1]);
		bonus = isNaN(bonus) ? 0 : bonus;

		// Loop through all 100 powers on the character sheet and reset any Encounter powers that were used
		for(let i = 1; i <= 100; i++) {
			const powerName = this.getCurrentAttributeValue(`power-${i}-name`);
			const powerType = this.getCurrentAttributeValue(`power-${i}-useage`);
			const isPowerUsed = this.getCurrentAttributeValue(`power-${i}-used`);
			if(powerType.toLowerCase() === 'encounter' && isPowerUsed === '1') {
				this.setCurrentAttributeValue(`power-${i}-used`, '0');
				auditText += `\n${powerName} was reset.`;
			}
		}

		// Log the audit text for the short rest action
		this.sendChatAsPlayer(auditText);

		// Use the healing surges, if any, with the provided bonus
		if(surges > 0) {
			for (let i = 0; i < surges; i++) {
				this.useHealingSurge(bonus);
			}
		}
	}

	/**
	 * Handles the character taking a long rest.
	 *
	 * The following actions are taken, if applicable:
	 * - Reset any Death Saving Throw failures
	 * - Reset any Health
	 * - Reset any Surges
	 * - Reset any Encounter and DailyPowers
	 * - Send the audit text
	 */
	handleLongRest() {
		// Initialize audit text
		let auditText = `${this.getCharacterName()} takes a long rest`;

		// Get previous health and surges values
		const previousHp = this.getCurrentAttributeValue(this.hp);
		const previousSurges = this.getCurrentAttributeValue(this.surges);
		const maxHp = this.getMaxAttributeValue(this.hp);
		const maxSurges = this.getMaxAttributeValue(this.surges);
		const previousHpTemp = this.getCurrentAttributeValue(this.hpTemp);

		// Reset any Death Saving Throw Failures, if needed
		for(let i = 1; i <= 3; i++) {
			const previousDeathFailure = this.getCurrentAttributeValue(this[`deathSavingThrow${i}`]);
			if(previousDeathFailure === '1') {
				this.setCurrentAttributeValue(this[`deathSavingThrow${i}`], '0');
				auditText += `\nDeath Saving Throw ${i} was reset.`;
			}
		}

		// Reset the Action Point to 1, regardless of previous value
		const previousActionPoints = this.getCurrentAttributeValue(this.actionPoints);
		this.setCurrentAttributeValue(this.actionPoints, 1);
		auditText += `\nAction Point set to 1 (was ${previousActionPoints}).`;

		// Log the inputs
		log(`Inputs: previousHp: ${previousHp}, previousSurges: ${previousSurges}, maxHp: ${maxHp}, maxSurges: ${maxSurges}`);

		// Set the current values to their max values
		if(previousHp < maxHp) {
			// Set the HP to the max
			this.setCurrentAttributeValue(this.hp, maxHp);
			auditText += `\nCurrent HP set to ${maxHp} (was ${previousHp}).`;
		}

		if(previousSurges < maxSurges) {
			// Set the surges to the max
			this.setCurrentAttributeValue(this.surges, maxSurges);
			auditText += `\nCurrent Surges set to ${maxSurges} (was ${previousSurges}).`;
		}

		if(previousHpTemp > 0) {
			// Set the temporary HP to 0
			this.setCurrentAttributeValue(this.hpTemp, '0');
			auditText += `\nCurrent HP Temp set to 0 (was ${previousHpTemp}).`;
		}

		// Loop through all 100 powers on the character sheet and reset used powers of type "Encounter" or "Daily"
		for(let i = 1; i <= 100; i++) {
			const powerName = this.getCurrentAttributeValue(`power-${i}-name`);
			const powerType = this.getCurrentAttributeValue(`power-${i}-useage`);
			const isPowerUsed = this.getCurrentAttributeValue(`power-${i}-used`);

			if((powerType.toLowerCase() === 'encounter' || powerType.toLowerCase() === 'daily') && isPowerUsed === '1') {
				this.setCurrentAttributeValue(`power-${i}-used`, '0');
				auditText += `\n${powerName} was reset.`;
			}
		}

		// Send audit text as player chat message
		this.sendChatAsPlayer(auditText);
	}
}