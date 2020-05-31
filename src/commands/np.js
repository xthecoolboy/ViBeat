module.exports = {
  name: 'np',
  description: 'Now Playing',
  execute(message) {
    const { songTitle } = require('./play');
    if (!songTitle) {
      return message.reply('There is no music playing');
    }
    message.channel.send(`\u{1F3B6} **Playing** \`${songTitle}\``);
  }
};