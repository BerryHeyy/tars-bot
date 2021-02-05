// get config variables
require('dotenv').config();

const Discord = require('discord.js');
const Client = require('./src/Bot.js');

global.__basedir = __dirname;

const client = new Client();

function init() {
  client.loadCommands('./src/commands');
  client.login(process.env.DISCORD_TOKEN);
}

init();
