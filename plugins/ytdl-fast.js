const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

cmd({
  pattern: 'video3', // Command for downloading YouTube video
  alias: ['video4'], // Alias for the command
  react: '🎥', // Reaction emoji
  desc: 'Download YouTube video', // Command description
  category: 'main', // Command category
  use: '.mp4 <YouTube URL or Name>', // Example usage
  filename: __filename
}, async (Void, citel, text, { from, prefix, quoted, q, reply }) => {
  try {
    if (!q) return reply('Please provide a YouTube URL or video name.');

    // Search for the video
    const searchResults = await ytsearch(q);
    if (searchResults.results.length < 1) return reply('No results found!');

    // Get the first result
    const video = searchResults.results[0];
    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if download URL is available
    if (data.status !== 200 || !data.result || !data.result.download_url) {
      return reply('Failed to fetch the video. Please try again later.');
    }

    // Format the caption
    const caption = `📹 *Video Downloader*\n🎬 *Title:* ${video.title}\n⏳ *Duration:* ${video.timestamp}\n👀 *Views:* ${video.views}\n👤 *Author:* ${video.author.name}\n🔗 *Link:* ${video.url}\n>\ Powered By 𝐒𝐈𝐋𝐄𝐍𝐓-𝐌𝐃 ☠`;

    // Send the video
    await Void.sendMessage(from, {
      video: { url: data.result.download_url },
      caption: caption,
      mimetype: 'video/mp4'
    }, { quoted: citel });

  } catch (err) {
    console.log(err);
    reply('An error occurred. Please try again later.');
  }
});

cmd({
  pattern: 'song1', // Command for downloading YouTube song (MP3)
  alias: ['song', 'mp3'], // Aliases for the command
  react: '🎶', // Reaction emoji
  desc: 'Download YouTube song', // Command description
  category: 'main', // Command category
  use: '.song <query>', // Example usage
  filename: __filename
}, async (Void, citel, text, { from, sender, reply, q }) => {
  try {
    if (!q) return reply('Please provide a song name or YouTube link.');

    // Search for the song
    const searchResults = await ytsearch(q);
    if (!searchResults.results.length) return reply('No results found!');

    // Get the first result
    const song = searchResults.results[0];
    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if download URL is available
    if (!data?.result?.downloadUrl) return reply('Download failed. Try again later.');

    // Send the audio with metadata
    await Void.sendMessage(from, {
      audio: { url: data.result.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${song.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: song.title.length > 25 ? song.title.substring(0, 22) + '...' : song.title,
          body: 'Join our WhatsApp Channel',
          mediaType: 1,
          thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
          sourceUrl: 'https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j',
          mediaUrl: 'https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j',
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: citel });

  } catch (err) {
    console.error(err);
    reply('An error occurred. Please try again.');
  }
});
