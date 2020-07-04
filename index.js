if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

const { Client,MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const {
    getRandomColor,
    getRandomQuote,
    getRandomGreeting,
    getRandom8BallResponse,
    getUserFromMention,
    getMentionFromText,
    getChannelFromText,
} = require('./functions');

const client = new Client();

const {
    PREFIX: prefix,
    TOKEN: token
} = process.env;

client.once('ready',() => {
    console.log("Bot has started");
    client.user.setActivity(prefix,{ type: 'LISTENING' });
});

client.on('message',async message => {
    const embed = new MessageEmbed()
        .setColor(getRandomColor())
        .setTimestamp()
        .setFooter(
            'Made with ❤️️',
            'https://cdn.discordapp.com/avatars/404342560551731201/cdc1a88b47c0c847966d0f37c37ee2a0.png?size=1024',
        );
    if (message.content.startsWith(prefix)) {
        const text = message.content.replace(prefix,"");
        const [ command,...args ] = text.split(" ");
        let toSend = [];
        switch (command) {
            case 'ping':
                const ping = client.ws.ping;
                embed.setTitle('PONG!')
                    .setDescription(`Took me ${ping}ms`);
                break;
            case 'greet':
                const ID = getUserFromMention(args[ 0 ]) || `<@${message.author.id}>`;
                const greeting = getRandomGreeting(ID);
                embed.setDescription(greeting);
                break;
            case 'quote':
                const quote = getRandomQuote();
                embed.setDescription(quote.author)
                    .setAuthor(quote.quote);
                break;
            case 'server':
                embed.setTitle(message.guild.name)
                    .setDescription(`${message.guild.memberCount} members`)
                    .setImage(message.guild.iconURL({
                        dynamic: true,
                        format: 'png',
                        size: 1024
                    }));
                break;
            case 'user':
                let user;
                if (args[ 0 ]) {
                    let ID;
                    ID = getUserFromMention(args[ 0 ]);
                    ID = ID.slice(3,ID.length - 1);
                    user = client.users.cache.get(ID);
                } else {
                    user = message.author;
                }
                if (!user) {
                    embed.setTitle('Error')
                        .setDescription('Please use a proper mention if you want to see someone else\'s avatar.')
                        .setColor('#df0000');
                    break;
                }
                embed.setTitle("User Information")
                    .addFields(
                        { name: "Username",value: user.username },
                        { name: "Status",value: user.bot ? "Bot" : "Human" }
                    )
                    .setImage(user.displayAvatarURL({
                        dynamic: true,
                        format: 'png',
                        size: 1024
                    }));
                break;
            case 'random':
                const type = args[ 0 ];
                const possibleTypes = [ 'dog','dogfact','cat','catfact' ];
                if (!type || !possibleTypes.includes(type)) {
                    toSend = [
                        `Please provide type of random image, ex:`,
                        'random dog - display random dog image',
                        'random dogfact - display random dog fact',
                        'random cat - display random cat image',
                        'random catfact - display random cat fact',
                    ];
                    embed.setTitle('Oops')
                        .setDescription(toSend.join('\n'))
                        .setColor('#df0000');
                    break;
                } else if (type == 'dog') {
                    const resp = await fetch('https://api.thedogapi.com/v1/images/search');
                    const dogs = await resp.json();
                    embed.setImage(dogs[ 0 ].url);
                    break;
                } else if (type == 'dogfact') {
                    const resp = await fetch('https://dog-api.kinduff.com/api/facts');
                    const { facts } = await resp.json();
                    embed.setTitle(facts[ 0 ]);
                    break;
                } else if (type == 'cat') {
                    const resp = await fetch('https://api.thecatapi.com/v1/images/search');
                    const cats = await resp.json();
                    embed.setImage(cats[ 0 ].url);
                    break;
                } else if (type == 'catfact') {
                    const resp = await fetch('https://catfact.ninja/fact');
                    const { fact } = await resp.json();
                    embed.setTitle(fact);
                    break;
                }
            case 'poll':
                const channelToSearch = args.length ? args[ 0 ] : '';
                const channel = getChannelFromText(channelToSearch,message.channel.id);
                const pollFilter = m => m.author.id == message.author.id;
                const pollCollector = message.channel.createMessageCollector(pollFilter,{ max: 1,idle: 30000 });
                embed.setDescription("What do you want to ask?");
                message.channel.send(embed);

                pollCollector.on('end',async collected => {
                    let [ title ] = [
                        ...collected.values(),
                    ].map(msg => msg.content);
                    let { title: newTitle,id } = getMentionFromText(title);
                    const user = getUserFromMention(id);
                    embed.setTitle("POLL");
                    embed.setDescription(user ? newTitle.replace('[user]',user) : title);
                    const fetchedChannel = client.channels.resolve(channel);
                    const postedPoll = await fetchedChannel.send(embed);
                    postedPoll.react('🟢');
                    postedPoll.react('🔴');
                    postedPoll.react('🟡');
                    if (channel !== message.channel.id) {
                        embed.setTitle("Success")
                            .setDescription("Successfully sent poll!")
                            .setColor('#3dff00');
                        message.channel.send(embed);
                    }
                });
                return;
            case '8ball':
                const eightBallFilter = m => m.author.id == message.author.id;
                const eightBallCollector = message.channel.createMessageCollector(eightBallFilter,{ max: 1,idle: 30000 });
                embed.setDescription("What do you want to ask?");
                message.channel.send(embed);

                eightBallCollector.on('end',async collected => {
                    let [ question ] = [
                        ...collected.values(),
                    ].map(msg => msg.content);
                    let { title: formattedQuestion,id } = getMentionFromText(question);
                    const user = getUserFromMention(id);
                    embed.setTitle("8 BALL");
                    embed.setDescription("");
                    embed.addFields([
                        {
                            name: 'You Asked :',
                            value: user ? formattedQuestion.replace('[user]',user) : question,
                        },
                        {
                            name: "8-Ball replied :",
                            value: getRandom8BallResponse()
                        }
                    ]);
                    message.channel.send(embed);
                });
                break;
            case 'meme':
                const resp = await fetch('https://meme-api.herokuapp.com/gimme');
                const { url: image } = await resp.json();
                embed.setTitle("MEME")
                    .setImage(image);
                break;
            case 'help':
                toSend = [
                    'ping - bot latency',
                    'greet - random greeting',
                    'quote - random quote',
                    'server - server name and member count',
                    'random - random picture',
                    'user - user information (mention to get other people\'s info)',
                    'poll - create yes/no poll on that channel',
                    '8ball - play magic 8 ball',
                    'meme - random meme (unfiltered, may include NSFW content)'
                ];
                embed.setDescription(toSend.join('\n'));
                break;
            default:
                toSend = [
                    'Oops!',
                    'We didn\'t find that command!',
                    `Try ${prefix}help for more info!`
                ];
                embed.setDescription(toSend.join('\n'))
                    .setColor("#df0000");
                break;
        }
        message.channel.send(embed);
    }
    if (
        message.embeds.length &&
        message.author.username == 'DISBOARD' &&
        message.embeds[ 0 ].description.indexOf("Bump done") > -1
    ) {
        setTimeout(() => {
            embed
                .setTitle("Bump timer's out!")
                .setDescription("It's time to bump again!")
                .setTimestamp();
            message.channel.send(embed);
        },7200000);
    }
});

client.login(token);