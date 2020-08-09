const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const colors = require("../../utils/colors.json");

module.exports = class ServerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server',
            aliases: [ 's' ],
            group: 'general',
            memberName: 'server',
            description: '',
        });
    }

    run(msg) {
        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle(msg.guild.name)
            .setDescription(`${msg.guild.memberCount} members`)
            .setImage(msg.guild.iconURL({
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