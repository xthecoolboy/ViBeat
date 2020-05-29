const ytdl = require('ytdl-core-discord');
const fetch = require('node-fetch');

const YOUTUBE_URL = 'https://www.youtube.com/watch?';
const API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1';

let playMusicFromUrl = async (url, connection, message) => {
  // Get info to display the song title
  const songInfo = await ytdl.getInfo(url);
  message.channel.send(`Playing \`${songInfo.title}\``); 
  // Play the music by sending opus packets as a stream from YouTube
  // Returns a dispatcher, which is a writable stream that takes opus audio
  const dispatcher = connection.play(await ytdl(url), { type: 'opus' });
  return dispatcher;
};

let getUrlFromSearch = async (args) => {
  // Refers to the accumulation of all the raw words the user entered
  const searchQuery = args.reduce((result, curr) => `${result}+${curr}`);
  // Request the YouTube Data API for the video id of the first video for a particular search
  const response = await fetch(`${API_ENDPOINT}&key=${process.env.GOOGLE_API_KEY}&q=${searchQuery}`);
  const jsonResponse = await response.json();
  const videoId = jsonResponse.items[0].id.videoId;
  // Return the complete url of the video, which includes the video id
  return `${YOUTUBE_URL}v=${videoId}`;
};

module.exports = {
  name: 'play',
  description: 'Plays Music',
  async execute(message, args) {
    // Ensure arguments are provided
    if (!args.length) {
      return message.reply('You didn\'t enter any arguments');
    }
    // Voice channel of the message's author
    const userVoiceChannel = message.member.voice.channel; 
    // Ensure user is in a voice channel
    if (!userVoiceChannel) {
      return message.reply('**You must be in a voice channel to use this command.**');
    }
    // Bot joins the user's voice channel, and the UDP socket connection is returned
    const connection = await userVoiceChannel.join();
    let url = args[0];
    // When the user enters only words and not a URL
    if (!url.startsWith(YOUTUBE_URL)) {
      // Get the url from the user's search query
      url = await getUrlFromSearch(args);
    }
    // This is to export the dispatcher to other commands
    this.dispatcher = await playMusicFromUrl(url, connection, message);
  },
};
