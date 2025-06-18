const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
  const youtubeRegex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

cmd({
  pattern: 'song2', // Command pattern
  alias: ['play3', 'mp5', 'ytmp3'], // Aliases for the command
  react: '🎵', // Reaction emoji
  desc: 'Download Ytmp3', // Command description
  category: '𓆩chamindu𓆪', // Command category
  use: '.song <Text or YT URL>', // Example usage
  filename: __filename
}, async (Void, citel, text, { from, q, reply }) => {
  try {
    if (!q) return reply('❌ Please provide a Query or Youtube URL!');

    // Extract video ID or search for video
    let videoId = q.startsWith('https://') ? replaceYouTubeID(q) : null;
    if (!videoId) {
      const searchResults = await dy_scrap.ytsearch(q);
      if (!searchResults?.results?.length) return reply('❌ No results found!');
      videoId = searchResults.results[0].videoId;
    }

    // Fetch video details
    const videoDetails = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${videoId}`);
    if (!videoDetails?.results?.length) return reply('❌ Failed to fetch video!');

    const { url, title, image, timestamp, ago, views, author } = videoDetails.results[0];

    // Prepare selection message
    const message = `🍄 *𝚂𝙾𝙽𝙶 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁* 🍄\n\n` +
                    `🎵 *Title:* ${title || 'Unknown'}\n` +
                    `⏳ *Duration:* ${timestamp || 'Unknown'}\n` +
                    `👀 *Views:* ${views || 'Unknown'}\n` +
                    `🌏 *Release Ago:* ${ago || 'Unknown'}\n` +
                    `👤 *Author:* ${author?.name || 'Unknown'}\n` +
                    `🖇 *Url:* ${url || 'Unknown'}\n\n` +
                    `🔽 *Reply with your choice:*\n` +
                    `1️⃣ *Audio Type* 🎵\n` +
                    `2️⃣ *Document Type* 📁\n\n` +
                    `${config.FOOTER || '☠𝐒𝐈𝐋𝐄𝐍𝐓-𝐌𝐃☠'}`;

    // Send selection message with thumbnail
    const sentMessage = await Void.sendMessage(from, {
      image: { url: image },
      caption: message
    }, { quoted: citel });

    const messageId = sentMessage.key.id;

    // Add reaction
    await Void.sendMessage(from, { react: { text: '🎶', key: sentMessage.key } });

    // Listen for user reply
    Void.ev.on('messages.upsert', async (msgUpdate) => {
      try {
        const message = msgUpdate?.messages[0];
        if (!message?.message) return;

        const replyText = message?.message?.conversation || message?.message?.extendedTextMessage?.text;
        const isReplyToSentMessage = message?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageId;
        if (!isReplyToSentMessage) return;

        const choice = replyText.trim();
        let processingMessage, media;

        if (choice === '1') {
          // Audio download
          processingMessage = await Void.sendMessage(from, { text: '⏳ Processing...' }, { quoted: citel });
          const downloadData = await dy_scrap.mp5(`https://youtube.com/watch?v=${videoId}`);
          const downloadUrl = downloadData?.result?.song?.url;

          if (!downloadUrl) return reply('❌ Download link not found!');

          media = { audio: { url: downloadUrl }, mimetype: 'audio/mpeg' };
        } else if (choice === '2') {
          // Document download
          processingMessage = await Void.sendMessage(from, { text: '⏳ Processing...' }, { quoted: citel });
          const downloadData = await dy_scrap.mp5(`https://youtube.com/watch?v=${videoId}`);
          const downloadUrl = downloadData?.result?.song?.url;

          if (!downloadUrl) return reply('❌ Download link not found!');

          media = {
            document: { url: downloadUrl },
            fileName: `${title}.mp3`,
            mimetype: 'audio/mpeg',
            caption: title
          };
        } else {
          return reply('❌ Invalid choice! Reply with 1 or 2.');
        }

        // Send media
        await Void.sendMessage(from, media, { quoted: citel });

        // Update processing message
        await Void.sendMessage(from, {
          text: '✅ Media Upload Successful ✅',
          edit: processingMessage.key
        });

      } catch (err) {
        console.error(err);
        reply(`❌ *An error occurred:* ${err.message || 'Error!'}`);
      }
    });

  } catch (err) {
    console.error(err);
    await Void.sendMessage(from, { react: { text: '❌', key: citel.key } });
    reply(`❌ *An error occurred while processing:* ${err.message || 'Error!'}`);
  }
});
