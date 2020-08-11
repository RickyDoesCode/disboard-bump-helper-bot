const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: [ 'h' ],
            group: 'utils',
            memberName: 'help',
            description: '',
        });
    }

    run(msg) {
        const toSend = [
            '**ping** - Checks the bot\'s ping to the Discord server.',
            '**uptime** - Checks the bot\'s uptime.',
            '**greet** - Greets sender or mentioned user with a personalized message.',
            '**quote** - Generates a random quote.',
            '**server** - Provides basic server details.',
            '**random** - Generates a random fact or image based on category.',
            '**user** - Generates sender or mentioned user\'s information.',
            '**poll** - Creates an agree/disagree poll.',
            '**8ball** - Returns an 8ball response to a question.',
            '**meme** - Generates a random meme.',
            '**help** - Displays a list of all commands.',
        ];
        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setDescription(toSend.join('\n'))
            .setTimestamp()
            .setFooter(
                'Made with ❤️️',
                'https://cdn.discordapp.com/avatars/404342560551731201/cdc1a88b47c0c847966d0f37c37ee2a0.png?size=1024',
            );
        return msg.embed(customEmbed);
    }
};