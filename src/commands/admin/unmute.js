const Command = require("../Command.js");
const discord = require('discord.js');

module.exports = class UnmuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            aliases: [],
            usage: 'unmute [target-user]',
            description: 'Unmutes target user.',
            modCommand: true
        });
    }

    /**
     * Runs the command
     * 
     * @param {discord.Message} message 
     * @param {Array<string>} args 
     */
    run(message, args) {
        const mutedRole = message.member.guild.roles.cache.find(r => r.name === "muted");

        if (mutedRole && args.length > 0) {
            const targetMember = message.mentions.members.first();

            if (targetMember) targetMember.roles.remove(mutedRole);
        }
    }
}