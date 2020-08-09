const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const {
    getMentionFromText,
    getUserFromMention,
    getRandom8BallResponse,
} = require("../../functions");
const colors = require("../../utils/colors.json");

module.exports = class EightBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            aliases: [ '8', '8b' ],
            group: 'general',
            memberName: '8ball',
            description: '',
            args: [
                {
                    key: "question",
                    prompt: "What do you wish to ask?",
                    type: "string",
                }
            ]
        });
    }

    async run(msg, { question }) {
        let { title: formattedQuestion, id } = getMentionFromText(question);
        const user = getUserFromMention(id);

        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("8 BALL")
            .addFields([
                {
                    name: 'You Asked :',
                    value: user ? formattedQuestion.replace('[user]', user) : question,
                },
                {
                    name: "8-Ball replied :",
                    value: getRandom8BallResponse()
                }
            ])
            .setTimestamp()
            .setFooter(`Question asked by ${msg.author.username}`);

        return msg.embed(customEmbed);
    }
};