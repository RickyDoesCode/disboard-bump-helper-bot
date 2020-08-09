const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const colors = require("../../utils/colors.json");

module.exports = class RandomCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'random',
            aliases: [ 'r' ],
            group: 'general',
            memberName: 'random',
            description: '',
            args: [
                {
                    key: "category",
                    prompt: "Which category do you want to request?",
                    type: "string",
                }
            ]
        });
    }

    async run(msg, { category }) {
        const customEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTimestamp()
            .setFooter(
                'Made with ❤️️',
                'https://cdn.discordapp.com/avatars/404342560551731201/cdc1a88b47c0c847966d0f37c37ee2a0.png?size=1024',
            );
        const possibleCategories = [ 'dog', 'dogfact', 'cat', 'catfact' ];
        if (!possibleCategories.includes(category)) {
            const toSend = [
                `Please provide the category you wish, eg:`,
                'random dog - Displays a random dog image.',
                'random dogfact - Display a random dog fact.',
                'random cat - Displays a random cat image.',
                'random catfact - Displays a random cat fact.',
            ];
            customEmbed.setTitle('Oops')
                .setDescription(toSend.join('\n'))
                .setColor(colors.red);
        } else if (category == 'dog') {
            const resp = await fetch('https://api.thedogapi.com/v1/images/search');
            const dogs = await resp.json();
            customEmbed.setImage(dogs[ 0 ].url);
        } else if (category == 'dogfact') {
            const resp = await fetch('https://dog-api.kinduff.com/api/facts');
            const { facts } = await resp.json();
            customEmbed.setTitle(facts[ 0 ]);
        } else if (category == 'cat') {
            const resp = await fetch('https://api.thecatapi.com/v1/images/search');
            const cats = await resp.json();
            customEmbed.setImage(cats[ 0 ].url);
        } else if (category == 'catfact') {
            const resp = await fetch('https://catfact.ninja/fact');
            const { fact } = await resp.json();
            customEmbed.setTitle(fact);
        }
        return msg.embed(customEmbed);
    }
};