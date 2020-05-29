module.exports = {
  name: 'leave',
  description: 'Disconnects from the voice channel',
  execute(message) {
    // Gets the voice channel the bot is currently in
    const channel = message.guild.me.voice.channel;
    if (channel) {
      try {
        return channel.leave();
      } catch (err) {
        console.error(err);
        message.reply('There was trouble completing your request');
      } finally {
        message.channel.send('**Successfully disconnected**');
      }
    }
  }
};