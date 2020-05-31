const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const fetch = require('node-fetch');

const YOUTUBE_URL = 'https://www.youtube.com/watch?';

let playMusicFromUrl = async (url, connection, message) => {
  try {
    // Get info to display the song title
    const songInfo = await ytdl.getInfo(url);
    message.channel.send(`\u{1F3B6} **Now Playing** \`${songInfo.title}\``); 
    // Play the music by sending opus packets as a stream from YouTube
    // Returns a dispatcher, which is a writable stream that takes opus audio
    const dispatcher = connection.play(await ytdl(url), { type: 'opus' });
    return { dispatcher, songTitle: songInfo.title };
  } catch (err) {
    console.error(err);
    message.reply('There was trouble completing your request');
  }
};

let getUrlFromSearch = async (args) => {
  try {
    // Refers to the accumulation of all the raw words the user entered
    const searchQuery = args.reduce((result, curr) => `${result}+${curr}`);
    // Request the YouTube Data API for the video id of the first video for a particular search
    const YT_API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1';
    const response = await fetch(`${YT_API_ENDPOINT}&key=${process.env.GOOGLE_API_KEY}&q=${searchQuery}`);
    const jsonResponse = await response.json();
    const videoId = jsonResponse.items[0].id.videoId;
    return `${YOUTUBE_URL}v=${videoId}`;
  } catch (err) {
    console.error(err);
  }
};

let getEmbedInfo = async (url, message) => {
  try {
    // Get the song title and duration in seconds
    const { title: songTitle, length_seconds } = await ytdl.getInfo(url);
    // Get the name and avatar of the person that entered the command
    const messageAuthor = message.author.username;
    const messageAuthorAvatar = message.author.avatarURL();
    // Retrieve the videoId to construct the thumbnail URL
    const videoId = getVideoIdFromUrl(url);
    // Format the duration into minutes:seconds format
    const duration = formatTime(length_seconds);
    // Return all the info necessary to create the embed
    return { songTitle, messageAuthor, messageAuthorAvatar, videoId, duration };
  } catch (err) {
    console.error(err);
    message.reply('There was trouble completing your request');
  }
};

module.exports = {
  name: 'play',
  description: 'Plays Music',
  queue: [],
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
    // If a song is currently playing
    if (this.songTitle) {
      // Retrieve the info necessary for an 'Added to queue' embed
      const { songTitle, messageAuthor, messageAuthorAvatar, videoId, duration } = await getEmbedInfo(url, message);
      const LIGHT_PINK = '#ca3782';
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      // Configure the embed
      const queueEmbed = new Discord.MessageEmbed()
        .setColor(LIGHT_PINK)
        .setTitle(songTitle)
        .setURL(url)
        .setAuthor(`Added to queue by ${messageAuthor}`, messageAuthorAvatar)
        .setThumbnail(thumbnailUrl)
        .addField('Song Duration', duration);
      message.channel.send(queueEmbed);
      return this.queue.push({message, args, songTitle});
    }
    const playback = await playMusicFromUrl(url, connection, message);
    // This is to export the dispatcher and song title to other commands
    this.dispatcher = playback.dispatcher;
    this.songTitle = playback.songTitle;
    // When a song finishes
    this.dispatcher.on('finish', async () => {
      // Delete song title for 'now playing' to work correctly
      delete this.songTitle;
      // If there are songs remaining in the queue
      if (this.queue.length) {
        const { message, args } = this.queue[0];
        this.queue.shift();
        // Recursively play the next song
        await this.execute(message, args);
      }
    });
  },
};

// Helper function to convert from 'seconds' to 'minutes:seconds'
function formatTime(length_seconds) {
  const SECONDS_PER_MIN = 60;
  const CUTOFF = 10;
  const minutes = Math.floor(length_seconds / SECONDS_PER_MIN);
  const rawSeconds = length_seconds % SECONDS_PER_MIN;
  // Edge case: Need to add a leading zero if the raw seconds is less than 10 
  const seconds = rawSeconds >= CUTOFF ? rawSeconds : `0${rawSeconds}`;
  const duration = `${minutes}:${seconds}`;
  return duration;
}

// Helper function to extract the video id from the full URL
function getVideoIdFromUrl(url) {
  const VIDEO_PARAM = 'v=';
  const videoIdStartIndex = url.indexOf(VIDEO_PARAM) + VIDEO_PARAM.length;
  const videoId = url.slice(videoIdStartIndex);
  return videoId;
}
