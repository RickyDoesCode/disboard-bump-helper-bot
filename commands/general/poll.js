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
                }
            ]
        });
    }

    async run(msg, { description, channel }) {
        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("POLL")
            .setDescription(description)
            .setTimestamp()
            .setFooter(`Poll initiated by ${msg.author.username}`);

        const foundChannel = this.client.channels.resolve(getChannelFromText(channel));

        const postedPoll = await foundChannel.send(customEmbed);

        postedPoll.react('🟢');
        postedPoll.react('🔴');
        postedPoll.react('🟡');

        if (getChannelFromText(channel) !== msg.channel.id) {
            customEmbed.setTitle("Success")
                .setDescription("Successfully sent poll!")
                .setColor('#3dff00');
            msg.embed(customEmbed);
        }
    }
};