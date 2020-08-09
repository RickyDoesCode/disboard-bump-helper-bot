const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const colors = require("../../utils/colors.json");

module.exports = class MemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            aliases: [ 'm' ],
            group: 'general',
            memberName: 'meme',
            description: ''
        });
    }

    async run(msg) {
        const resp = await fetch('https://meme-api.herokuapp.com/gimme');
        const { url: image } = await resp.json();

        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("MEME")
            .setImage(image)
            .setTimestamp()
            .setFooter(`Meme requested by ${msg.author.username}`);

        return msg.embed(customEmbed);
    }
};