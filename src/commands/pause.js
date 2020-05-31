module.exports = {
  name: 'pause',
  description: 'Pauses the music currently playing',
  execute(message) {
    const { dispatcher } = require('./play');
    if (dispatcher) {
      try {
        dispatcher.pause();
        message.channel.send('\u23F8 **Music has been paused**');
      } catch (err) {
        console.error(err);
        message.reply('There was trouble completing your request');
      }
    }
  }
};