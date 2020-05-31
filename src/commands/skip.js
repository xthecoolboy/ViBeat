module.exports = {
  name: 'skip',
  description: 'Skips the currently playing song',
  execute(message) {
    // Import dispatcher from play.js
    const { dispatcher } = require('./play');
    if (dispatcher) {
      try {
        // Skips song
        dispatcher.end();
        message.channel.send('\u23ED **Skipped current song**');
      } catch(err) {
        console.error(err);
        message.reply('There was trouble completing your request');
      } 
    }
  }
};