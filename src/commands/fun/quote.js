const Command = require("../Command.js");
const discord = require('discord.js');
const Utils = require('../../util/utils.js');
const logger = require('../../util/logger.js');

module.exports = class QuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'quote',
      aliases: [],
      usage: 'quote <message-id> || <target-user>',
      description: 'Add quote to the bot quote database. Need developermode turned on to be able to access message IDs.',
    });
  }

  /**
     * Runs the command
     * 
     * @param {discord.Message} message 
     * @param {Array<string>} args 
     */
  async run(message, args) {
    if (args.length === 0) {
      if (this.bot.db.quotes.selectRowCount.pluck().get() == 0) return;

      const quotesLength = this.bot.db.quotes.selectRowCount.pluck().get();
      logger.info(quotesLength);
      const randomIndex = Math.floor(Math.random() * quotesLength);
      logger.info(randomIndex);

      const selectedQuote = this.bot.db.quotes.selectRowByIndex.get(randomIndex + 1);
      logger.info(selectedQuote);

      const user_id = selectedQuote["user_id"];
      const message_content = selectedQuote["message_content"];
      const message_date = selectedQuote["message_date"];
      const message_url = selectedQuote["message_url"];
      const message_id = selectedQuote["message_id"];

      const guild = await this.bot.guilds.fetch("667000338196463617");
      const author = await guild.members.fetch(user_id);

      const embed = new discord.MessageEmbed()
      .setDescription(`[Quote](${message_url}) by ${author} (${message_date})\n\`\`\`${message_content}\`\`\``);

      message.channel.send(embed);

      return;
    }
    if (Utils.isNumeric(args[0])) { // add quote to database
      
      try {
        if (this.bot.db.quotes.selectRowExists.pluck().get(args[0])) { // Row exists
          message.channel.send(`A quote for Message ${args[0]} already exists in the database.`);
          return;
        } 

        const foundMessage = await message.channel.messages.fetch(args[0]);

        const user_id = foundMessage.author.id;
        const message_content = foundMessage.content;
        let md = foundMessage.createdAt;
        const message_date = `${md.getDate()}-${md.getMonth()}-${md.getFullYear()} ${md.getHours()}:${md.getMinutes()}`;
        const message_url = foundMessage.url;
        const message_id = args[0];

        this.bot.db.quotes.insertRow.run(user_id, message_content, message_date, message_url, message_id);
        
        const embed = new discord.MessageEmbed()
        .setDescription(`[Quote](${message_url}) by ${foundMessage.author} (${message_date})\n\`\`\`${message_content}\`\`\``);

        message.channel.send(embed);

      } catch (e) {
        logger.info("Failed.");
        console.error(e);
      }
    } else { // Get user specific quote
      try {
        const mentionedUserId = message.mentions.members.first().id;
        
        const quotes = this.bot.db.quotes.selectRowByUserId.all(mentionedUserId);
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const selectedQuote = quotes[randomIndex];
        
        const user_id = selectedQuote["user_id"];
        const message_content = selectedQuote["message_content"];
        const message_date = selectedQuote["message_date"];
        const message_url = selectedQuote["message_url"];
        const message_id = selectedQuote["message_id"];

        const guild = await this.bot.guilds.fetch("667000338196463617");
        const author = await guild.members.fetch(user_id);

        const embed = new discord.MessageEmbed()
        .setDescription(`[Quote](${message_url}) by ${author} (${message_date})\n\`\`\`${message_content}\`\`\``);

        message.channel.send(embed);
      } catch (e) {
        console.error(e);
      }
    }
        
        
  }
}