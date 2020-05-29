module.exports = {
  name: 'stop',
  description: 'Stops all the music',
  execute(message) {
    // Import dispatcher from play.js
    const { dispatcher } = require('./play');
    if (dispatcher) {
      try {
        // Stops song
        dispatcher.end();
      } catch(err) {
        console.error(err);
        message.reply('There was trouble completing your request');
      } finally {
        message.channel.send('**Stopped All Songs**');
      }
    }
  }
};