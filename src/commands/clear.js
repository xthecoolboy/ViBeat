module.exports = {
  name: 'clear',
  description: 'Clears the music queue',
  execute(message) {
    // Import music queue from play.js
    const { queue } = require('./play');
    if (!queue.length) {
      return message.reply('The music queue is empty');
    }
    try {
      // Clears queue
      queue.length = 0;
      message.channel.send('\u{1F4A5} **Cleared music queue**');
    } catch(err) {
      console.error(err);
      message.reply('There was trouble completing your request');
    } 
  }
};