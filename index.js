if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config()
} 

const { Client, MessageEmbed } = require('discord.js');
const { getUserFromMention } = require('./functions')

const client = new Client();

const {
    PREFIX: prefix,
    TOKEN: token
} = process.env;

client.once('ready', () => {
    console.log('Bot is ready!');
    client.user.setActivity(prefix, { type: 'LISTENING' });
});

client.on('message', async message => {
    const embed = new MessageEmbed()
            .setTimestamp()
            .setFooter('Made with ❤️️');
    if (message.content.startsWith(prefix)) {
        const text = message.content.replace(prefix, "");
        const [ command, ...args ] = text.split(" ")
        let toSend = [];
        switch (command) {
            case 'test':
                embed.setDescription('Oh hello there!')
                    .setColor("#005bbe");
                break;
            case 'server': 
                // message.guild.icon;
                embed.setTitle(message.guild.name)
                    .setDescription(`${message.guild.memberCount} members`)
                    .setColor("#19eb3b");
                break;
            case 'user':
                if (args[0]) {
                    const user = getUserFromMention(client, args[0]);
                    if (!user) {
                        embed.setTitle('Error')
                        .setDescription('Please use a proper mention if you want to see someone else\'s avatar.')
                        .setColor('#df0000')
                        break;
                    }
                    toSend = [
                        `Username: ${user.username}`,
                        `This person is ${user.bot ? '' : 'not '}a bot`
                    ]
                    embed.setTitle("User Information")
                        .setDescription(toSend.join('\n'))
                        .setImage(user.displayAvatarURL({ dynamic: true }))
                    break;
                }
                toSend = [
                    `Username: ${message.author.username}`,
                    `This person is ${message.author.bot ? '' : 'not '}a bot`
                ]
                embed.setTitle("User Information")
                    .setDescription(toSend.join('\n'))
                    .setImage(message.author.displayAvatarURL({ dynamic: true }))
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
                    'random - gets random picture',
                    'user - gets user information (mention to get other people\'s info)'
                ]
                embed.setDescription(toSend.join('\n'))
                    .setColor("#f1d400");
                break;
            default:
                toSend = [
                    'Oops!',
                    'We didn\'t find that command!',
                    `Try ${prefix}help for more info!`
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