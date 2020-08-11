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
                    key: "delay",
                    prompt: "How long should I wait before I send it? (in minutes)",
                    type: "string",
                    validate: text => !isNaN(Number(text))
                },
                {
                    key: "duration",
                    prompt: "How long should this poll be alive for (in days)? Please pick a number between 1 ~ 7.",
                    type: "string",
                    error: "Please pick a number between 1 ~ 7.",
                    validate: text => !isNaN(Number(text)) &&
                        Number(text) >= 1 &&
                        Number(text) <= 7
                },
                {
                    key: "channel",
                    prompt: "Which channel do you wish to send this to?",
                    type: "string",
                    error: "Please mention a channel to which you want to send this poll.",
                    validate: text => text[ 0 ] == '<' &&
                        text[ 1 ] == '#' &&
                        text[ text.length - 1 ] == '>'
                },
            ]
        });
    }

    async run(msg, { description, delay, duration, channel }) {
        let customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("SUCCESS")
            .setDescription(`Your poll has been scheduled successfully.`)
            .setTimestamp()
            .setFooter(`Poll scheduled by ${msg.author.username}`);

        const foundChannel = this.client.channels.resolve(getChannelFromText(channel));

        if (delay != 0) msg.embed(customEmbed);

        setTimeout(async () => {
            customEmbed = new MessageEmbed()
                .setColor(colors.green)
                .setTitle("POLL")
                .setDescription(description)
                .setTimestamp()
                .setFooter(`Poll initiated by ${msg.author.username}`);

            const postedPoll = await foundChannel.send(customEmbed);

            await postedPoll.react('🟢');
            await postedPoll.react('🟡');
            await postedPoll.react('🔴');

            if (getChannelFromText(channel) !== msg.channel.id) {
                customEmbed.setTitle("Success")
                    .setDescription("Successfully sent poll!")
                    .setColor(colors.green);
                msg.embed(customEmbed);
            }

            const filter = (reaction) => [ '🟢', '🟡', '🔴' ].includes(reaction.emoji.name);

            const results = await postedPoll.awaitReactions(filter, { time: duration * 86400000 });
            const agree = {
                "map": results.get("🟢"),
                "count": 0,
            };
            const normal = {
                "map": results.get("🟡"),
                "count": 0,
            };
            const disagree = {
                "map": results.get("🔴"),
                "count": 0,
            };
            console.log(agree.map);

            if (agree.map) agree.count = agree.map.users.cache.filter(u => !u.bot).size;
            if (normal.map) normal.count = normal.map.users.cache.filter(u => !u.bot).size;
            if (disagree.map) disagree.count = disagree.map.users.cache.filter(u => !u.bot).size;

            customEmbed = new MessageEmbed()
                .setColor(colors.green)
                .setTitle("POLL RESULTS")
                .setDescription(`The result to the poll "${description}" shows that:\n${agree.count} user(s) agreed\n${normal.count} user(s) were neutral\n${disagree.count} user(s) disagreed`)
                .setTimestamp()
                .setFooter(
                    'Made with ❤️️',
                    'https://cdn.discordapp.com/avatars/404342560551731201/cdc1a88b47c0c847966d0f37c37ee2a0.png?size=1024',
                );

            msg.embed(customEmbed);

        }, delay * 60000);
    }
};