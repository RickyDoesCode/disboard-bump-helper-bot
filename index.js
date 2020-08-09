require('dotenv').config();

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const {
    PREFIX: prefix,
    TOKEN: token
} = process.env;

const client = new CommandoClient({
    commandPrefix: prefix,
    owner: "404342560551731201",
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        [ 'general', 'General Command Group' ],
        [ 'utils', 'Utility Command Group' ]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        eval: false,
        help: false,
        prefix: false,
        unknownCommand: false,
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('Bot has started!');
    client.user.setActivity(prefix, { type: 'LISTENING' });
});

client.on('message', async message => {
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
        }, 7200000);
    }
});

client.login(token);