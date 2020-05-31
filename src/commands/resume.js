module.exports = {
  name: 'resume',
  description: 'Resumes music playback if paused',
  execute(message) {
    const { dispatcher } = require('./play');
    if (dispatcher) {
      try {
        dispatcher.resume();
        message.channel.send('\u23EF **Resumed music playback**');
      } catch (err) {
        console.error(err);
        message.reply('There was trouble completing your request');
      }
    }
  }
};