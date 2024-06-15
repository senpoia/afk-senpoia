const express = require("express");
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const app = express();

// Discord Client
const client = new Client();

// Discord Client Events
client.on('ready', () => {
    console.log(`${client.user.username} is ready!`);

    const channelID = process.env.channel;
    let voiceConnection;

    client.channels.fetch(channelID)
        .then(async (channel) => {
            const guildID = channel.guild.id;

            // Function to join voice channel
            const joinVoice = () => {
                voiceConnection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: guildID,
                    adapterCreator: channel.guild.voiceAdapterCreator
                });

                console.log(`Joined voice channel ${channel.id}`);

                // Handle connection state changes
                voiceConnection.on(VoiceConnectionStatus.Ready, () => {
                    if (voiceConnection.state.subscription) {
                        voiceConnection.state.subscription.setDeaf(false); // Ensure not deafened
                        voiceConnection.state.subscription.setMute(true); // Set to mute
                    } else {
                        console.warn('Voice subscription state is undefined.');
                    }
                });

                // Handle disconnect event
                voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
                    console.log(`Disconnected from voice channel ${channel.id}.`);
                    // Clear the voice connection variable
                    voiceConnection = undefined;

                    // Attempt to reconnect after 5 minutes (300000 milliseconds)
                    setTimeout(() => {
                        joinVoice();
                    }, 300000); // 5 minutes in milliseconds
                });
            };

            // Initial join
            joinVoice();

        })
        .catch((error) => {
            console.error('Failed to fetch voice channel:', error);
        });
});

// Express Server
const listener = app.listen(process.env.PORT || 2000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});

// Express Routes
app.get('/', (req, res) => {
    res.send(`
    <body>
    <center><h1>Bot 24H ON!</h1></center>
    </body>`);
});

// Start Discord Bot
client.login(process.env.token);

// Log that the bot is ready to work
console.log("I'm Ready To Work..! 24H");
