const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const {
    getUserFromMention,
    getRandomGreeting
} = require("../../functions");
const colors = require("../../utils/colors.json");

module.exports = class GreetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'greet',
            aliases: [ 'g' ],
            group: 'general',
            memberName: 'greet',
            description: '',
            args: [
                {
                    key: "user",
                    prompt: "which user do you want to greet?",
                    type: "string",
                },
            ]
        });
    }

    run(msg, { user }) {
        const ID = getUserFromMention(user);
        const greeting = getRandomGreeting(ID);
        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setDescription(greeting)
            .setTimestamp()
            .setFooter(
                'Made with ❤️️',
                'https://cdn.discordapp.com/avatars/404342560551731201/cdc1a88b47c0c847966d0f37c37ee2a0.png?size=1024',
            );
        return msg.embed(customEmbed);
    }
};