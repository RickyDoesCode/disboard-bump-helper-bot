const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");
const { getUserFromMention } = require("../../functions");

module.exports = class UserCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'user',
            aliases: [ 'u' ],
            group: 'general',
            memberName: 'user',
            description: '',
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to get information about? (please mention)",
                    type: "string"
                }
            ]
        });
    }

    run(msg, { user }) {
        let ID = getUserFromMention(user);
        ID = ID.slice(3, ID.length - 1);
        const foundUser = this.client.users.cache.get(ID);
        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("User Information")
            .addFields(
                { name: "Username", value: foundUser.username },
                { name: "Status", value: foundUser.bot ? "Bot" : "Human" }
            )
            .setImage(foundUser.displayAvatarURL({
                dynamic: true,
                format: 'png',
                size: 1024
            }))
            .setTimestamp()
            .setFooter(
                'Made with ❤️️',
                'https://cdn.discordapp.com/avatars/404342560551731201/cdc1a88b47c0c847966d0f37c37ee2a0.png?size=1024',
            );
        return msg.embed(customEmbed);
    }
};