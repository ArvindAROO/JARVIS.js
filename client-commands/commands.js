const BOTDEV = 750556082371559485;
const MOD = 742798158966292640;
const ADMIN = 742800061280550923;

module.exports = {
    init: function (client) {
        this.client = client;
    },
    canManageServer: function (message) {
        //see if the current message author is worthy of the command
        return message.member.roles.cache.some(
            (role) => role.id == BOTDEV || role.id == MOD || role.id == ADMIN
        );
    },
    ping: function (message) {
        message.channel.send({
            content: `Latency is ${
                Date.now() - message.createdTimestamp
            }ms. API Latency is ${this.client.ws.ping}ms`,
        });
    },

    getUserFromMention: function (message, mention) {
        // The id is the first and only match found by the RegEx.
        // a mention will be in the form of <@userid> or <@!userid>
        const matches = mention.match(/^<@!?(\d+)>$/);

        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches) return;

        const id = matches[1];

        return message.guild.members.cache.get(id);
    },
    mute: function (message, args) {
        if (this.canManageServer(message)) {
            if (args[0]) {
                const userObj = this.getUserFromMention(message, args[0]);

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
                        content:
                            "The role @Pruned has been added to " +
                            userObj.displayName,
                    });
                }
            } else {
                return message.reply("Mention the user");
            }
        } else {
            message.reply("No");
        }
    },
    unmute: function (message, args) {
        if (this.canManageServer(message)) {
            if (args[0]) {
                const userObj = this.getUserFromMention(message, args[0]);

                if (!userObj) {
                    return message.reply("Mention the user");
                }
                var role = message.guild.roles.cache.find(
                    (role) => role.name === "Pruned"
                );
                if (role && userObj) {
                    userObj.roles.remove(role);
                    message.channel.send({
                        content:
                            "The role @Pruned has been removed from " +
                            userObj.displayName,
                    });
                }
            } else {
                return message.reply("Mention the user");
            }
        } else {
            return messagereply("No");
        }
    },
    kick: function (message, args) {
        if (this.canManageServer(message)) {
            if (args[0]) {
                const userObj = this.getUserFromMention(message, args[0]);

                if (!userObj) {
                    return message.reply("Mention the user");
                }
                userObj.kick();
                return message.channel.send({ content: "kick successful" });
            }
            message.reply("User Not Found, mention properly");
        }
    },
    kid: function (message, args) {
        if (args[0]) {
            const userObj = this.getUserFromMention(message, args[0]);
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
	support: function(message) {
		return message.reply("You can contribute to the bot here\nhttps://github.com/ArvindAROO/JARVIS.js")
	}
};
