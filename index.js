if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config()
} 

const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const {
    PREFIX: prefix,
    TOKEN: token
} = process.env;

client.once('ready', () => {
    client.user.setActivity(prefix, { type: 'LISTENING' });
});

client.on('message', message => {
    const embed = new MessageEmbed()
            .setTimestamp()
	        .setFooter('Made with ❤️️');
    if (message.content.indexOf(prefix) > -1) {
        const text = message.content.replace(prefix, "");
        let toSend = [];
        switch (text) {
            case 'test':
                embed.setDescription('Oh hello there!')
                    .setColor("#005bbe");
                break;
            case 'server': 
                toSend = [
                    `Server name: ${message.guild.name}`,
                    `Total members: ${message.guild.memberCount}`,
                ]
                embed.setDescription(toSend.join("\n"))
                .setColor("#19eb3b");
                break;
            case 'random':
                const id = Math.floor( Math.random() * 1085 ) + 1;
                console.log(id);
                embed.setImage(`https://picsum.photos/id/${id}/500`)
                break;
            case 'help':
                toSend = [
                    'test - returns a message to check if bot\'s working',
                    'server - provide server detail (name and user count)',
                    'random - gets random picture'
                ]
                embed.setDescription(toSend.join('\n'))
                    .setColor("#f1d400");
                break;
            default:
                toSend = [
                    'Oops!',
                    'We didn\'t find that command!',
                    'Try ${prefix}help for more info!'
                ]
                embed.setDescription(toSend.join('\n'))
                    .setColor("#df0000");
                break;
        }
        message.channel.send(embed);
    }
    if (
        message.embeds.length &&
        message.author.username == 'DISBOARD' &&
        message.embeds[0].description.indexOf("Bump done") > -1
    ) {
        setTimeout(() => {
            embed
                .setTitle("Bump timer's out!")
                .setDescription("It's time to bump again!")
            message.channel.send(embed);
        }, 7200000)
    }
});

client.login(token);