const Discord = require('discord.js');
const client = new Discord.Client(); // Refers to the bot

require('dotenv').config(); // Environment Variables

client.on('message', message => {
	if (message.content === '!play') {
		message.channel.send('Playing Music');
	}
});

client.login(process.env.TOKEN);