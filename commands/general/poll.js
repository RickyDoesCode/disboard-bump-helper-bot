const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const { getChannelFromText } = require("../../functions");
const colors = require("../../utils/colors.json");

module.exports = class PollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'poll',
            aliases: [ 'p' ],
            group: 'general',
            memberName: 'poll',
            description: '',
            args: [
                {
                    key: "description",
                    prompt: "What do you wish to ask?",
                    type: "string",
                },
                {
                    key: "channel",
                    prompt: "Which channel do you wish to send this to?",
                    type: "string",
                    validate: text => text[ 0 ] == '<' &&
                        text[ 1 ] == '#' &&
                        text[ text.length - 1 ] == '>'
                },
                {
                    key: "time",
                    prompt: "How long should I wait before I send it? (in minutes)",
                    type: "string",
                    validate: text => !isNaN(Number(text))
                }
            ]
        });
    }

    async run(msg, { description, channel, time }) {
        let customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("SUCCESS")
            .setDescription(`Your poll has been scheduled successfully.`)
            .setTimestamp()
            .setFooter(`Poll scheduled by ${msg.author.username}`);

        const foundChannel = this.client.channels.resolve(getChannelFromText(channel));

        if (time != 0) msg.embed(customEmbed);

        setTimeout(async () => {
            customEmbed = new MessageEmbed()
                .setColor(colors.green)
                .setTitle("POLL")
                .setDescription(description)
                .setTimestamp()
                .setFooter(`Poll initiated by ${msg.author.username}`);

            const postedPoll = await foundChannel.send(customEmbed);

            postedPoll.react('🟢');
            postedPoll.react('🔴');
            postedPoll.react('🟡');

            if (getChannelFromText(channel) !== msg.channel.id) {
                customEmbed.setTitle("Success")
                    .setDescription("Successfully sent poll!")
                    .setColor(colors.green);
                msg.embed(customEmbed);
            }
        }, time * 60000);
    }
};