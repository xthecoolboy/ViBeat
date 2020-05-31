module.exports = {
  name: 'leave',
  description: 'Disconnects from the voice channel',
  execute(message) {
    // Gets the voice channel the bot is currently in
    const voiceChannel = message.guild.me.voice.channel;
    const { dispatcher, queue } = require('./play');
    if (voiceChannel) {
      try {
        // Clears queue
        queue.length = 0;
        // Stops current song
        dispatcher.end();
        voiceChannel.leave();
        return message.channel.send('\u23FB **Successfully disconnected**');
      } catch (err) {
        console.error(err);
        message.reply('There was trouble completing your request');
      } 
    }
  }
};