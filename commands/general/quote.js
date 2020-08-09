const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const { getRandomQuote } = require("../../functions");
const colors = require("../../utils/colors.json");

module.exports = class QuoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            aliases: [ 'q' ],
            group: 'general',
            memberName: 'quote',
            description: '',
        });
    }

    run(msg) {
        const quote = getRandomQuote();
        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setDescription(quote.author)
            .setAuthor(quote.quote)
            .setTimestamp()
            .setFooter(
                'Made with ❤️️',
                'https://cdn.discordapp.com/avatars/404342560551731201/cdc1a88b47c0c847966d0f37c37ee2a0.png?size=1024',
            );
        return msg.embed(customEmbed);
    }
};