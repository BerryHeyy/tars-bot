const discord = require('discord.js');
const AsciiTable = require('ascii-table');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
//const Command = require('./commands/Command');

class Bot extends discord.Client {

  constructor(options = {}) {

    super(options);

    this.logger = require('./util/logger.js');

    this.token = process.env.DISCORD_TOKEN;

    this.ownerId = process.env.OWNER_ID;
    
    this.prefix = process.env.PREFIX;

    this.commands = new discord.Collection();

    this.aliases = new discord.Collection();

    this.db = require('./util/db.js');

    super.on('message', async message => {
      if (message.channel.type === 'dm') {
        message.channel.send('I currently don\'t support DMs.');
        return;
      }
      if (message.author.bot) return;
      if (message.content[0] !== this.prefix) return;

      const args = message.content.slice(1).trim().split(' ');
      const cmd = args.shift().toLowerCase();
      
      let command = this.commands.get(cmd) || this.aliases.get(cmd);

      if (!command) return; // Return if no command was found      

      if (command.ownerOnly) if (message.author.id === this.ownerId) return await command.run(message, args);
      else return;

      return await command.run(message, args);

    });

  }

  loadCommands(path) {
    this.logger.info('Loading commands...');
    let table = new AsciiTable('Commands');
    table.setHeading('File', 'Aliases', 'Status');
    readdirSync(path).filter( f => !f.endsWith('.js')).forEach( dir => {
      const commands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
      commands.forEach(f => {
        const Command = require(resolve(__basedir, join(path, dir, f)));
        const command = new Command(this); // Instantiate the specific command
        if (command.name && !command.disabled) {
          // Map command
          this.commands.set(command.name, command);
          // Map command aliases
          let aliases = '';
          if (command.aliases) {
            command.aliases.forEach(alias => {
              this.aliases.set(alias, command);
            });
            aliases = command.aliases.join(', ');
          }
          table.addRow(f, aliases, 'pass');
        } else {
          this.logger.warn(`${f} failed to load`);
          table.addRow(f, '', 'fail');
          return;
        }
      });
    });
    this.logger.info(`\n${table.toString()}`);
    return this;
  }

  

}

module.exports = Bot;
