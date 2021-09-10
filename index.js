/*
	TODO: The commands must be exported to `client-commands/commands.js`
	TODO: Improve readability of code
	TODO: All the command access are given by hardcodeduserid values, need to shift them to role based perms
	! Warning: Use only discord.js v13 and Node 16.6 or higher !
*/



require('dotenv').config();
const TOKEN = process.env.TOKEN;
const prefix = "+";
const { Client, Intents } = require('discord.js');
const botIntents = new Intents()
botIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES);
// Create a new client instance
const client = new Client(
	{intents : botIntents}
);

const BOTDEV = 750556082371559485;
const MOD = 742798158966292640;
const ADMIN = 742800061280550923;

client.once('ready', () => {
	console.log('Ready!');
});
function getUserFromMention(message, mention) {
	// The id is the first and only match found by the RegEx.
	// a mention will be in the form of <@userid> or <@!userid>
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	const id = matches[1];

	return message.guild.members.cache.get(id);
}
function canManageServer(message){
	//see if the current message author is worthy of the command
	return message.member.roles.cache.some(role => role.id == BOTDEV ||  role.id == MOD || role.id == ADMIN );

}

client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	//ignore if no prefix


	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send({ content:`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${(client.ws.ping)}ms`});
  	}else if (command === 'beep') {
		message.channel.send('Boop.');
	}else if(command === 'hello') {
		//testing reply functions
        message.channel.send({ content: 'hello', reply: { messageReference: message.id } });
		message.reply("Hi");
    }else if(command == "mute"){
		if(canManageServer(message)){

			if (args[0]) {
				const userObj = getUserFromMention(message, args[0]);

				if (!userObj) {
					return message.reply('Mention the user');
				}
				var role = message.guild.roles.cache.find(role => role.name === "Pruned");
				if(role && userObj){
					//see if the user and role obj creation was successful
					userObj.roles.add(role);
					message.channel.send({content: "The role @Pruned has been added to " + userObj.displayName});
				}
			}else{
				return message.reply('Mention the user');
			}
		}else{
			message.reply('No');
		}
		
	}else if(command == "unmute"){
		if(canManageServer(message)){
			if (args[0]) {
				const userObj = getUserFromMention(message, args[0]);

				if (!userObj) {
					return message.reply('Mention the user');
				}
				var role = message.guild.roles.cache.find(role => role.name === "Pruned");
				if(role && userObj){
					userObj.roles.remove(role);
					message.channel.send({content: "The role @Pruned has been removed from " + userObj.displayName});
				}
			}else{
				return message.reply('Mention the user');
			}
		}else{
			return messagereply('No');
		}
	}
	else if(command === "kick"){
		if(canManageServer(message)){
			if (args[0]) {
				const userObj = getUserFromMention(message, args[0]);
				

				if (!userObj) {
					return message.reply('Mention the user');
				}
				userObj.kick();
				return message.channel.send({content: "kick successful"});
			}
			message.reply("User Not Found, mention properly");
		}
	}
	else if(command === "kid"){
		if(args[0]){
			const userObj = getUserFromMention(message, args[0]);
			if (canManageServer(message)) {
				

				if (!userObj) {
					return message.reply('Mention the user');
				}
				var justJoined = message.guild.roles.cache.find(role => role.name === "Just Joined");
				var keed = message.guild.roles.cache.find(role => role.name === "This Just In");
				if(justJoined && keed && userObj){
					userObj.roles.remove(justJoined);
					userObj.roles.add(keed);
					return message.channel.send({content: "successful " + userObj.displayName});
				}
				else{
					message.reply("failed, try again");
				}

			}else{
				return message.reply("You aint worthy");
			}
			message.reply("User Not Found, mention properly");
		}
	}
	else{
		message.channel.send({content: "I have no response for this shit", reply: {messageReference: message.id}});
	}
});

process.on('uncaughtException', function(err) {
	console.log('Caught exception: ' + err);
	
});

// Login to Discord with your client's token
client.login(TOKEN);
