if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config()
} 

const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const {
    getUserFromMention,
    getRandomColor,
    getEmojis,
    getMentionFromText,
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
                const type = args[0];
                const possibleTypes = ['dogs', 'cats']
                if (!type || !possibleTypes.includes(type)) {
                    toSend = [
                        `Please provide type of random image, ex:`,
                        'random dogs - display random dog image',
                        'random cats - display random cat image'
                    ];
                    embed.setTitle('Oops')
                        .setDescription(toSend.join('\n'))
                        .setColor('#df0000')
                    break;
                } else if (type == 'dogs') {
                    const resp = await fetch('https://api.thedogapi.com/v1/images/search');
                    const dogs = await resp.json();
                    embed.setImage(dogs[0].url);
                    break;
                } else {
                    const resp = await fetch('https://api.thecatapi.com/v1/images/search');
                    const cats = await resp.json();
                    embed.setImage(cats[0].url);
                    break;
                }
            case 'poll':
                const filter = m => m.author.id == message.author.id;
                const collector = message.channel.createMessageCollector(filter, { max: 1, idle: 30000 });
                embed.setDescription("What do you want to ask?");
                message.channel.send(embed);

                collector.on('end', async collected => {
                    let [title] = [
                        ...collected.values(),
                    ].map(msg => msg.content)
                    let { title: newTitle, id } = getMentionFromText(title);
                    const user = getUserFromMention(client, id); 
                    if (user) {
                        embed.setTitle(newTitle.replace('[user]', user.username))
                    } else {
                        embed.setTitle(title)
                    }
                    embed.setDescription("");
                    const postedPoll = await message.channel.send(embed)
                    postedPoll.react('🟢');
                    postedPoll.react('🔴');
                    postedPoll.react('🟡');
                });
                return;
            case 'help':
                toSend = [
                    'test - returns a message to check if bot\'s working',
                    'server - provide server detail (name and user count)',
                    'random - gets random picture',
                    'user - gets user information (mention to get other people\'s info)',
                    'poll - create a poll on that channel'
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
                .setTimestamp()
            message.channel.send(embed);
        }, 7200000)
    }
});

client.login(token);