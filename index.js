const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

//  New client instance

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//  When the client is ready, run this code once.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


// Log in via token
client.login(token);