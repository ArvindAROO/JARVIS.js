require('dotenv').config();
const TOKEN = process.env.TOKEN;
const prefix = "+";
const { Client, Intents } = require('discord.js');
// const { token } = require('./config.json');
const botIntents = new Intents()
botIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES);
// Create a new client instance
const client = new Client(
	{intents : botIntents}
);

client.once('ready', () => {
	console.log('Ready!');
});
client.on('message', message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	console.log(command);
	if (command === 'ping') {
		message.channel.send('Pong.\nI am JARVIS.js');
		console.log(client.late);
	} else if (command === 'beep') {
		message.channel.send('Boop.');
	}
	// ...
});

// Login to Discord with your client's token
client.login(TOKEN);
