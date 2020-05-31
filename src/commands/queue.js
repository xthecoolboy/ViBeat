module.exports = {
  name: 'queue',
  description: 'Displays the music queue',
  execute(message) {
    // Import music queue from play.js
    const { queue } = require('./play');
    if (!queue.length) {
      return message.reply('The music queue is empty');
    }
    try {
      const displayQueue = formatQueueData(queue);
      message.channel.send(displayQueue);
    } catch(err) {
      console.error(err);
      message.reply('There was trouble completing your request');
    } 
  }
};

function formatQueueData(queue) {
  let formattedQueue = '```\nMusic Queue:\n\n';
  queue.forEach((song, index) => {
    const queuePosition = index + 1;
    formattedQueue += `${queuePosition}. ${song.songTitle}\n`;
  });
  formattedQueue += '```';
  return formattedQueue;
}