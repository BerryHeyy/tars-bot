const discord = require('discord.js');
const Bot = require('../Bot.js')

class Command {

    constructor(bot, options) {

        /**
         * The bot.
         * @type {Bot}
         */
        this.bot = bot;

        /**
         * The name of the command.
         * @type {string}
         */
        this.name = options.name;

        /**
         * The aliases of the command. Allows users to access command using multiple command names.
         * @type {Array<string>}
         */
        this.aliases = options.aliases || null;

        this.usage = options.usage || "No usage provided.";

        this.description = options.description || "";

        this.rolesRequired = options.rolesRequired || null;

        this.examples = options.examples || null;

        this.ownerOnly = options.ownerOnly || false;

    }

    /**
     * Runs the command
     * 
     * @param {discord.Message} message 
     * @param {Array<string>} args 
     */
    async run(message, args) {
        throw new Error("The $(this.name) command has no run() method.");
    }

}

module.exports = Command;