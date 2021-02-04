// get config variables
const config = require('./config.json')

const Discord = require('discord.js');
const Client = require('./src/Bot.js');

global.__basedir = __dirname;

const client = new Client(config);

function init() {
  client.loadCommands('./src/commands');
  client.login(config.token);
}

init();
