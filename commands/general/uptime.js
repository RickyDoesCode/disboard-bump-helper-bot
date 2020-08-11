const { Command } = require('discord.js-commando');

module.exports = class UptimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            aliases: [ 'up' ],
            group: 'general',
            memberName: 'uptime',
            description: '',
        });
    }

    async run(msg) {
        let days = Math.floor(this.client.uptime / 86400000);
        let hours = Math.floor(this.client.uptime / 3600000) % 24;
        let minutes = Math.floor(this.client.uptime / 60000) % 60;
        let seconds = Math.floor(this.client.uptime / 1000) % 60;

        msg.say(`__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s`);
    }
};