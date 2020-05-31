module.exports = {
  name: 'stop',
  description: 'Stops all the music',
  execute(message) {
    // Import dispatcher and music queue from play.js
    const { dispatcher, queue } = require('./play');
    if (dispatcher) {
      try {
        // Clears queue
        queue.length = 0;
        // Stops current song
        dispatcher.end();
        message.channel.send('\u23F9 **Stopped all songs**');
      } catch(err) {
        console.error(err);
        message.reply('There was trouble completing your request');
      } 
    }
  }
};