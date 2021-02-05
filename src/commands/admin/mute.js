const Command = require("../Command.js");
const discord = require('discord.js');
const logger = require('../../util/logger.js');

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: ['shutup'],
            usage: 'mute [target-user]',
            description: 'Mutes target user.',
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
        logger.info("PSS");
        const mutedRole = message.member.guild.roles.cache.find(r => r.name === "muted");

        if (mutedRole && args.length > 0) {
            logger.info("ASDPAS");
            const targetMember = message.mentions.members.first();

            if (targetMember) targetMember.roles.add(mutedRole);
        }
    }
}