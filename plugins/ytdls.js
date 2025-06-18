const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// Command for downloading YouTube videos
cmd({
    pattern: 'mp4',
    alias: ['ytdl3', 'mp4 <Yt url or Name>'],
    react: '🎥',
    desc: 'Download YouTube video',
    category: 'main',
    use: '.mp4 <YouTube URL or video name>',
    filename: __filename
}, async (client, message, args, { from, prefix, quoted, q, reply }) => {
    try {
        // Check if query is provided
        if (!q) return await reply('Please provide a YouTube URL or video name.');

        // Search YouTube for the video
        const searchResults = await ytsearch(q);
        if (searchResults.results.length < 1) return await reply('No results found!');

        // Get the first result
        const video = searchResults.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`;
        
        // Fetch video download link from API
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status !== 200 || !data.result || !data.result.download_url) {
            return await reply('Failed to fetch the video. Please try again later.');
        }

        // Prepare video details message
        const videoDetails = `
📹 *Video Details*
🎬 *Title*: ${video.title}
⏳ *Duration*: ${video.timestamp}
👀 *Views*: ${video.views}
👤 *Author*: ${video.author.name}
🔗 *Link*: ${video.url}

*Choose download format:*
1️⃣. 📄 Document (no preview)
2️⃣. ▶️ Normal Video (with preview)

_© Powered by 𝐒𝐈𝐋𝐄𝐍𝐓-𝐌𝐃_
        `;
        
        // Prepare context info for forwarded message
        const contextInfo = {
            mentionedJid: [args.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363398452475846@newsletter',
                newsletterName: '𝐒𝐈𝐋𝐄𝐍𝐓 𝐌𝐃',
                serverMessageId: 143
            }
        };

        // Send video details with thumbnail
        const sentMessage = await client.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: videoDetails,
            contextInfo
        }, { quoted: message });

        // Listen for user response to choose format
        client.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const userChoice = msg.message.extendedTextMessage.text.trim();
            if (msg.message.extendedTextMessage.contextInfo?.stanzaId === sentMessage.key.id) {
                await client.sendMessage(from, { react: { text: '📥', key: msg.key } });

                switch (userChoice) {
                    case '1':
                        // Send as document
                        await client.sendMessage(from, {
                            document: { url: data.result.download_url },
                            mimetype: 'video/mp4',
                            fileName: `${video.title}.mp4`,
                            contextInfo
                        }, { quoted: msg });
                        break;
                    case '2':
                        // Send as video
                        await client.sendMessage(from, {
                            video: { url: data.result.download_url },
                            mimetype: 'video/mp4',
                            contextInfo
                        }, { quoted: msg });
                        break;
                    default:
                        await client.sendMessage(from, {
                            text: 'වැරදි වරදක්. කරුණාකර 1 හෝ 2 යොදන්න.'
                        }, { quoted: msg });
                        break;
                }
            }
        });

    } catch (error) {
        console.log(error);
        await reply('An error occurred. Please try again later.');
    }
});

// Command for downloading YouTube songs
cmd({
    pattern: 'song',
    alias: ['play', 'mp3'],
    react: '🎶',
    desc: 'Download YouTube song',
    category: 'main',
    use: '.song <YouTube URL or song name>',
    filename: __filename
}, async (client, message, args, { from, prefix, quoted, q, reply }) => {
    try {
        // Check if query is provided
        if (!q) return await reply('Please provide a YouTube URL or song name.');

        // Search YouTube for the song
        const searchResults = await ytsearch(q);
        if (searchResults.results.length < 1) return await reply('No results found!');

        // Get the first result
        const song = searchResults.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        
        // Fetch song download link from API
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status !== 200 || !data.result || !data.result.download_url) {
            return await reply('Failed to fetch the audio. Please try again later.');
        }

        // Prepare song details message
        const songDetails = `
🎵 *Song Details*
🎶 *Title*: ${song.title}
⏳ *Duration*: ${song.timestamp}
👀 *Views*: ${song.views}
👤 *Author*: ${song.author.name}
🔗 *Link*: ${song.url}

*Choose download format:*
1️⃣. 📄 MP3 as Document
2️⃣. 🎧 MP3 as Audio (Play)
3️⃣. 🎙️ MP3 as Voice Note (PTT)

_© Powered by 𝐒𝐈𝐋𝐄𝐍𝐓-𝐌𝐃_
        `;
        
        // Prepare context info for forwarded message
        const contextInfo = {
            mentionedJid: [args.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363398452475846@newsletter',
                newsletterName: '𝐒𝐈𝐋𝐄𝐍𝐓 𝐌𝐃',
                serverMessageId: 143
            }
        };

        // Send song details with thumbnail
        const sentMessage = await client.sendMessage(from, {
            image: { url: song.thumbnail },
            caption: songDetails,
            contextInfo
        }, { quoted: message });

        // Listen for user response to choose format
        client.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const userChoice = msg.message.extendedTextMessage.text.trim();
            if (msg.message.extendedTextMessage.contextInfo?.stanzaId === sentMessage.key.id) {
                await client.sendMessage(from, { react: { text: '📥', key: msg.key } });

                switch (userChoice) {
                    case '1':
                        // Send as document
                        await client.sendMessage(from, {
                            document: { url: data.result.download_url },
                            mimetype: 'audio/mpeg',
                            fileName: `${song.title}.mp3`,
                            contextInfo
                        }, { quoted: msg });
                        break;
                    case '2':
                        // Send as audio
                        await client.sendMessage(from, {
                            audio: { url: data.result.download_url },
                            mimetype: 'audio/mpeg',
                            contextInfo
                        }, { quoted: msg });
                        break;
                    case '3':
                        // Send as voice note
                        await client.sendMessage(from, {
                            audio: { url: data.result.download_url },
                            mimetype: 'audio/mpeg',
                            ptt: true,
                            contextInfo
                        }, { quoted: msg });
                        break;
                    default:
                        await client.sendMessage(from, {
                            text: 'වැරදි ඇතුලත් කිරීමකි. කරුණාකර නිවැරදි අංකය ඇතුලත් කරන්න (1 or 2 or 3) 🔴'
                        }, { quoted: msg });
                        break;
                }
            }
        });

    } catch (error) {
        console.log(error);
        await reply('An error occurred. Please try again later.');
    }
});
