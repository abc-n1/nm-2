const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: 'ytstalk', // Command pattern
  alias: ['ytinfo', 'ytc'], // Aliases for the command
  desc: 'Get details about a YouTube channel.', // Command description
  react: '🔍', // Reaction emoji
  category: 'search', // Command category
  filename: __filename
}, async (Void, citel, text, { from, quoted, q, reply }) => {
  try {
    if (!q) return reply('❌ Please provide a valid YouTube channel username or ID.'); // Check if query is provided

    // Send loading reaction
    await Void.sendMessage(from, { react: { text: '⏳', key: citel.key } });

    // Fetch YouTube channel data using an API
    const url = `https://delirius-apiofc.vercel.app/tools/ytstalk?channel=${encodeURIComponent(q)}`;
    const { data } = await axios.get(url);

    // Check if valid data is received
    if (!data || !data.status || !data.data) {
      return reply('⚠️ Failed to fetch YouTube channel details. Ensure the username or ID is correct.');
    }

    // Extract channel details
    const channelData = data.data;
    const message = `╭━━━〔 *YOUTUBE STALKER* 〕━━━⊷\n` +
                    `┃👤 *Username:* ${channelData.username}\n` +
                    `┃📊 *Subscribers:* ${channelData.subscriber_count}\n` +
                    `┃🎥 *Videos:* ${channelData.video_count}\n` +
                    `┃🔗 *Channel Link:* (${channelData.channel})\n` +
                    `╰━━━⪼\n\n` +
                    `🔹 *Powered by 𝐒𝐈𝐋𝐄𝐍𝐓-𝐌𝐃*`;

    // Send channel details with avatar image
    await Void.sendMessage(from, {
      image: { url: channelData.avatar },
      caption: message
    }, { quoted: citel });

  } catch (err) {
    console.error('Error:', err);
    reply('❌ An error occurred while processing your request. Please try again.');
  }
});
