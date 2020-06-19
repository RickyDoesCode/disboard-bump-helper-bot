if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config()
} 

const { Client, MessageEmbed } = require('discord.js');
const {
    getUserFromMention,
    getRandomColor,
    getEmojis,
} = require('./functions')

const client = new Client();

const {
    PREFIX: prefix,
    TOKEN: token
} = process.env;

client.once('ready', () => {
    console.log("Bot has started");
    client.user.setActivity(prefix, { type: 'LISTENING' });
});

client.on('message', async message => {
    const embed = new MessageEmbed()
        .setColor(getRandomColor())
        .setTimestamp()
        .setFooter(
            'Made with ❤️️',
            'https://cdn.discordapp.com/avatars/404342560551731201/cdc1a88b47c0c847966d0f37c37ee2a0.png?size=1024',
        );
    if (message.content.startsWith(prefix)) {
        const text = message.content.replace(prefix, "");
        const [ command, ...args ] = text.split(" ")
        let toSend = [];
        switch (command) {
            case 'test':
                embed.setDescription('Oh hello there! 👋')
                break;
            case 'server': 
                embed.setTitle(message.guild.name)
                    .setDescription(`${message.guild.memberCount} members`)
                    .setImage(message.guild.iconURL({
                        dynamic: true,
                        format: 'png',
                        size: 1024
                    }))
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
                    embed.setTitle("User Information")
                        .addFields(
                            { name: "Username", value: user.username },
                            { name: "Status", value: user.bot ? 'Bot' : 'Human' }
                        )
                        .setImage(user.displayAvatarURL({
                            dynamic: true,
                        format: 'png',
                        size: 1024
                        }))
                    break;
                }
                embed.setTitle("User Information")
                    .addFields(
                        { name: "Username", value: message.author.username },
                        { name: "Status", value: message.author.bot ? 'Bot' : 'Human' }
                    )
                    .setImage(message.author.displayAvatarURL({
                        dynamic: true,
                        format: 'png',
                        size: 1024
                    }))
                break;
            case 'random':
                const id = Math.floor( Math.random() * 1085 ) + 1;
                embed.setImage(`https://picsum.photos/id/${id}/500`)
                break;
            case 'poll':
                console.log(args);
                // if (!args.length) {
                //     embed.setTitle("Oops!")
                //         .setDescription("Please mention a channel you want to post!")
                //         .setColor('#df0000');
                //     break;
                // }
                const filter = m => m.author.id == message.author.id;
                const collector = message.channel.createMessageCollector(filter);
                let counter = 1;
                toSend = [
                    "What should this poll be called?",
                    "(We currently only hold up to 10 options)"
                ]
                embed.setDescription(toSend.join('\n'));
                message.channel.send(embed);

                collector.on('collect', m => {
                    if (m.content == 'stop') {
                        collector.stop();
                        return;
                    }
                    toSend = [
                        `What should option #${counter} be?`,
                        `(enter 'stop' to exit)`
                    ]
                    embed.setDescription(toSend.join('\n'))
                    counter++;
                    message.channel.send(embed);
                });

                collector.on('end', collected => {
                    let [title, ...args] = [
                        ...collected.values(),
                    ].map(msg => msg.content)
                        .filter(text => text !== 'stop')
                    const emojis = getEmojis();
                    args = args.map(
                        (text, index) => `> ${emojis[index]} ${text}\n${
                            index == args.length - 1 ?
                            '' : '> '
                        }`
                    )
                    embed.setTitle(title)
                    .setDescription(args.join('\n'))
                    message.channel.send(embed)
                });
                return;
            case 'help':
                toSend = [
                    'test - returns a message to check if bot\'s working',
                    'server - provide server detail (name and user count)',
                    'random - gets random picture',
                    'user - gets user information (mention to get other people\'s info)',
                    'poll <channel> - create a poll on that channel'
                ]
                embed.setDescription(toSend.join('\n'))
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