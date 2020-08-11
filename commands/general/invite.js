const { Command } = require('discord.js-commando');

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: [ 'inv' ],
            group: 'general',
            memberName: 'invite',
            description: '',
        });
    }

    async run(msg) {
        msg.say("Feel free to add me in your servers with this link:\nhttps://discord.com/oauth2/authorize?client_id=697682232797560852&scope=bot&permissions=203840");
    }
};