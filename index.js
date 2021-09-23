/*
	DONE - TODO: The commands must be exported to `client-commands/commands.js`
	TODO: Improve readability of code
	DONE - TODO: All the command access are given by hardcodeduserid values, need to shift them to role based perms
	! Warning: Use only discord.js v13 and Node 16.6 or higher !
*/

require("dotenv").config();
const TOKEN = process.env.TOKEN;

const config = require('./config.json');
const prefix = config["prefix"];
const availableCommands = config["commands"];


const { Client, Intents } = require("discord.js");
const botIntents = new Intents();
botIntents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES
);
// Create a new client instance
const client = new Client({ intents: botIntents });

const commandFunctions = require("./client-commands/commands.js");

client.once("ready", () => {
    console.log("Ready!");
    commandFunctions.init(client);
});

client.on("messageCreate", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    //ignore if no prefix

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (availableCommands.includes(command)){
        if (command === "ping") {
            commandFunctions.ping(message);
        } else if (command === "beep") {
            message.channel.send("Boop.");
        } else if (command === "hello") {
            //testing reply functions
            message.channel.send({
                content: "hello",
                reply: { messageReference: message.id },
            });
            message.reply("Hi");
        } else if (command == "mute") {
            commandFunctions.mute(message, args);
        } else if (command == "unmute") {
            commandFunctions.unmute(message, args);
        } else if (command === "kick") {
            commandFunctions.kick(message, args);
        } else if (command === "kid") {
            commandFunctions.kid(message, args);
        } else if (command == "contribute" || command == "support") {
            commandFunctions.support(message);
        } else if (command == "nick" || command ==  "changenick"){
            commandFunctions.nick(message, args);
        } else if (command == "ban"){
            commandFunctions.ban(message, args);
        } else if (command == "unban"){
            commandFunctions.unban(message, args);
        } else if(command == "p" || command == "purge"){
            commandFunctions.purge(message, args);
        }
    } else {
        message.channel.send({
            content: "I have no response for this shit",
            reply: { messageReference: message.id },
        });
    }
});

process.on("uncaughtException", function (err) {
    commandFunctions.error(err);
    // console.log("Caught exception: " + err);
});

// Login to Discord with your client's token
client.login(TOKEN);
