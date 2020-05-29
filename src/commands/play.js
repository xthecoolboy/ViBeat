module.exports = {
	name: 'play',
	description: 'Plays Music',
	execute(message, args) {
		if (!args.length) {
			return message.reply('You didn\'t enter any arguments');
		}
		message.channel.send(`Playing music from ${args[0]}`);
	},
};