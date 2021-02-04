const Command = require("../Command.js");
const discord = require('discord.js');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['poke'],
            usage: 'ping',
            description: 'Pings the bot.',
        });
    }

    run(message) {
        message.channel.send("Pong.");
    }
}