const API_KEY = process.env.API_KEY; // API keys for dad jokes API

//get moderation roles and channel ID
const config = require('../config.json');
const canManageBot = config["botManagers"];
const BOTLOGS = config["botLogs"];

let ms = require('ms');
let axios = require("axios").default;

// let base64ToImage = require('base64-to-image');
// import axios from "axios";
module.exports = {
    init: function(client) {
        this.client = client;
        this.message = NaN;
    },
    canManageServer: function(message) {
        //see if the current message author is worthy of the command
        return message.member.roles.cache.some(
            (role) => canManageBot.includes(role.id) 
        );
    },
    ping: function(message) {
        this.message = message;
        message.channel.send({
            content: `Latency is ${
                Date.now() - message.createdTimestamp
            }ms. API Latency is ${this.client.ws.ping}ms`,
        });
    },

    mute: function(message, args) {
        this.message = message;
        let mutetime = args[1];
        if (!mutetime) {
            return message.reply("You didn't specify a time!");
        };
        mutetimeInms = ms(mutetime);
        if (!(mutetimeInms > 29999 && mutetimeInms < 1296000000)) {
            return message.reply("Think this is a joke? How can you mute anyone for that amount");
        };
        //return if time not mentioned and convert the time into milliseconds
        if (this.canManageServer(message)) {
            if (args[0]) {
                const userObj = message.mentions.members.first(); //this.getUserFromMention(message, args[0]);

                if (!userObj) {
                    return message.reply("Mention the user");
                }
                var role = message.guild.roles.cache.find(
                    (role) => role.name === "Pruned"
                );
                if (role && userObj) {
                    //see if the user and role obj creation was successful
                    userObj.roles.add(role);
                    message.channel.send({
                        content: "The role @Pruned has been added to " +
                            userObj.displayName + " for " + mutetime
                    });
                    setTimeout(() => {
                        userObj.roles.remove(role);
                        message.channel.send({
                            content: "The role @Pruned has been removed from " +
                                userObj.displayName
                        });
                    }, mutetimeInms);
                }
            } else {
                return message.reply("Mention the user");
            }
        } else {
            message.reply("No");
        }
    },

    unmute: function(message, args) {
        this.message = message;
        if (this.canManageServer(message)) {
            if (args[0]) {
                const userObj = message.mentions.members.first();

                if (!userObj) {
                    return message.reply("Mention the user");
                }
                var role = message.guild.roles.cache.find(
                    (role) => role.name === "Pruned"
                );
                if (role && userObj) {
                    userObj.roles.remove(role);
                    message.channel.send({
                        content: "The role @Pruned has been removed from " +
                            userObj.displayName,
                    });
                }
            } else {
                return message.reply("Mention the user");
            }
        } else {
            return message.reply("No");
        }
    },

    purge: function(message, args) {
        this.message = message;
        if (this.canManageServer(message)) {
            if (args[0]) {
                let messageCount = 1 + Number(args);
                // if(Number.isNaN(messageCount)|| messageCount < 1){return message.reply("purge what?")}
                message.channel.messages.fetch({
                        limit: messageCount
                    })
                    .then(messages => {
                        message.channel.bulkDelete(messages);

                        message.channel
                            .send(
                                "Deletion of messages successful. \nTotal messages deleted including command: " +
                                messageCount
                            )
                    })

            } else {
                return message.reply("Mention the number of messages to be purged");
            }
        } else {
            return message.reply("No");
        }
    },

    kick: function(message, args) {
        this.message = message;
        if (this.canManageServer(message)) {
            if (args[0]) {
                const userObj = message.mentions.members.first();

                if (!userObj) {
                    return message.reply("Mention the user");
                }
                userObj.kick();
                return message.channel.send({
                    content: "kick successful"
                });
            }
            message.reply("User Not Found, mention properly");
        }
    },

    ban: function(message, args) {
        this.message = message;
        if (this.canManageServer(message)) {
            if (args[0]) {
                const userObj = message.mentions.members.first();

                if (!userObj) {
                    return message.reply("Mention the user lawda, just check if he is on server first");
                }
                userObj.ban();
                return message.channel.send({
                    content: "ban successful"
                });
            }
            message.reply("Mention properly lawda. Last time you didnt mention properly dear PESU bot was kicked");
        }
    },

    unban: function(message, args) {
        // FIXED - * not functional yet, getting userObject without the cache in the server is deprecated *
        this.message = message;
        if (this.canManageServer(message)) {
            if (args[0]) {
                let userID = args[0].includes('<@!') ? args[0].replace('<@!', '').replace('>', '') :
                    args[0].includes('<@') ? args[0].replace('<@', '').replace('>', '') : '';

                if (userID == '') {
                    return message.reply('Invalid user ID or mention.');
                }

                message.guild.bans.fetch().then(bans => {
                    //bans is of type "Map" defined in js.
                    let isBanned = false;
                    bans.forEach((value, key) => {
                        if (key == userID) {
                            //see if the mentioned user is actually banned
                            isBanned = true;
                        }
                    });
                    if (isBanned) {
                        message.reply("yup person is banned");
                        let userObj = bans.find(allBans => allBans.user.id == userID) //get his bannedUserObj from the Map of his bans from the object 'bans'
                        message.guild.members.unban(userObj.user);
                        return message.reply("unban successful");
                    } else {
                        return message.reply("The user isnt banned");
                    }
                });
            } else {
                return message.reply("Mention who you want to unban");
            }
        }
    },

    kid: function(message, args) {
        this.message = message;
        if (args[0]) {
            const userObj = message.mentions.members.first()
            if (this.canManageServer(message)) {
                if (!userObj) {
                    return message.reply("Mention the user");
                }
                var justJoined = message.guild.roles.cache.find(
                    (role) => role.name === "Just Joined"
                );
                var keed = message.guild.roles.cache.find(
                    (role) => role.name === "This Just In"
                );
                if (justJoined && keed && userObj) {
                    userObj.roles.remove(justJoined);
                    userObj.roles.add(keed);
                    return message.channel.send({
                        content: "successful " + userObj.displayName,
                    });
                } else {
                    message.reply("failed, try again");
                }
            } else {
                return message.reply("You aint worthy");
            }
            message.reply("User Not Found, mention properly");
        }
    },

    nick: function(message, args) {
        this.message = message;
        if (args[0]) {
            const userObj = message.mentions.members.first()
            if (this.canManageServer(message)) {
                if (!userObj) {
                    return message.reply("Mention the user");
                }
                args.shift(); //remove the first userid object
                args = args.join(' ') //convert the words into one string
                return userObj.setNickname(args);

            } else {
                return message.reply("Not to you lmao");
            }

        }

    },
    echo:function(message, args){
        //syntax - `+e <#channelname> whatever to be echoed
        this.message = message;
        if (message.author.id == 718845827413442692) {
            if (args[0]) {
                // still too unsafe to give others perms to use the command
                let channel = message.mentions.channels;
                let channelID = channel.keys().next().value;
                if(channelID == undefined){
                    return message.reply("Mention the channel")
                } 
                let channelObj = this.client.channels.cache.get(channelID); 
                args.shift() //remove the first element ie the channel mention
                return channelObj.send(args.join(" "))
            }
            message.reply("what should i even echo");
        } else {
            message.reply("Not to you lol");
        }
    },
    joke: function(message){
        // !The command is pretty irrelevant in the context of the bot, just wanted to try out api calls in Js. Added it into the bot

        //the api used is DAD-JOKES api via rapidapi.com
        //further info can be found at https://rapidapi.com/KegenGuyll/api/dad-jokes
        this.message = message;
        var options = {
            method: 'GET',
            url: 'https://dad-jokes.p.rapidapi.com/random/joke/png',
            headers: {
                'x-rapidapi-host': 'dad-jokes.p.rapidapi.com',
                'x-rapidapi-key': API_KEY
            }
        };

        axios.request(options).then(function (response) {
            //console.log(response.data.body) //uncomment this line to see the entire body of joke
            let joke = response.data.body.setup + "\n\n\n" + response.data.body.punchline
            message.reply(joke);
            
            
            //the joke also sends the text of the joke as a image, pretty useless in darkmode since text in black

            // var path ='path/to the/repo';
            // var optionalObj = {'fileName': 'image.png', 'type':'png'};

            // var imageInfo = base64ToImage(response.data.body.image,path,optionalObj);

            // message.channel.send("", {files: ["../image.png"]});
            // The image isnt useful in the context of sending it as a image on discord since it almost unreadable
        })
    },
    thread: function(message, args){
        //syntax - `+thread <channel mention> <thread mention> whatever message
        //! the thread must be of the same channel as the channel mentioned
        if (this.canManageServer(message)) {
            this.message = message;
            let channel = message.mentions.channels;
            let channelID = channel.keys().next().value;
            let threadID = undefined;
            let i = 0;
            for (let [key, v] of channel) {
                //basically channel[1]
                //but map object doesnt support indexing
                if(i == 1){threadID = key; break;}
                i++;
            }
            if(channelID == undefined){
                return message.reply("Mention the channel")
            }
            if(threadID == undefined){
                return message.reply("Mention thread");
            }
            
            channel = this.client.channels.cache.get(channelID)
            if(channel){
                const thread = channel.threads.cache.find(x => x.id === threadID.toString());
                args.shift();
                args.shift();
                // remove the first 2 parameters ie channel and thread mentions
                string = args.join(" ");
                if(!string){return message.reply("Empty message received");} //if string not found
                if(thread){
                    return thread.send(string);
                }
                return message.reply("no threads found");
            }
            return message.reply("channel not found");
        
        }
    },

    support: function(message) {
        this.message = message;
        return message.reply("You can contribute to the bot here\nhttps://github.com/ArvindAROO/JARVIS.js")
    },
    error: function(err) {
        //upon any errors all will be dumped to BotLogs channel
        let BotLogs = this.client.channels.cache.get(BOTLOGS)
        BotLogs.send({content: "Error occured " + err + " by <@" + this.message.author.id + "> in <#" + this.message.channel + ">"})
        this.message.reply("Error occured " + err);
    }
};