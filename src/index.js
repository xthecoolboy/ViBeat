const Discord = require('discord.js');
const client = new Discord.Client(); // Refers to the bot
client.commands = new Discord.Collection(); // Stores all the bot commands

const fs = require('fs');
const path = require('path');
const { prefix } = require('../config.json');

require('dotenv').config(); // Configures environment variables

// Gets an array of the file names of all the commands 
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(fileName => fileName.endsWith('.js'));

// Adds all the commands to the bot's command collection
commandFiles.forEach(fileName => {
  const command = require(`./commands/${fileName}`);
  client.commands.set(command.name, command);
});

// Message Event Listener
client.on('message', message => {
  // Ensure message comes from a server, has the right prefix, and isn't sent by the bot
  if (!message.guild || !message.content.startsWith(prefix) || message.author.bot) return;
  // Splitting the message with regex to allow for an arbitrary number of spaces between arguments
  const args = message.content.slice(prefix.length).split(/ +/); 
  // Returns the first element from args and removes it from the array
  const commandName = args.shift().toLowerCase();
  // Check if a valid command was provided
  if (!client.commands.has(commandName)) {
    return;
  }
  // Retrieves the command object from the bot's command collection
  const command = client.commands.get(commandName);
  try {
    command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply('There was trouble completing your request');
  }
});

client.login(process.env.DISCORD_TOKEN); // Token is the password