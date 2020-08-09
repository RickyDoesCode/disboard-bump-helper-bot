function getRandomColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function getRandomGreeting(user) {
	const greetings = [
		`Hello ${user} :wave:\nHow are you doing today?`,
		`Hey ${user} :wave:\nHave a nice day!`,
		`Hey, it's ${user}!\nHave a wonderful day!`,
		`Good day, ${user}!\nHappy coding!`,
		`What's up ${user}!`,
	];
	const randomIndex = Math.floor(Math.random() * greetings.length);
	const randomGreeting = greetings[ randomIndex ];
	return randomGreeting;
}

function getRandomQuote() {
	const quotes = require("../utils/quotes.json");
	const randomIndex = Math.floor(Math.random() * quotes.length);
	const randomQuote = quotes[ randomIndex ];
	return randomQuote;
}

function getUserFromMention(mention,) {
	if (!mention) return;

	if (mention == '@everyone') return '@everyone';

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
			return `<@!${mention}>`;
		}

		if (mention.startsWith("&")) {
			mention = mention.slice(1);
			return `<@&${mention}>`;
		}
	}
}

function getRandom8BallResponse() {
	const responses = require("../utils/8ball.json");
	const random = Math.floor(Math.random() * responses.length) || 0;
	return responses[ random ];
}

function getMentionFromText(text) {
	let startIndex = text.indexOf("<@");
	let endIndex = text.indexOf(">");
	return {
		title: text.slice(0, startIndex) + '[user]' + text.slice(endIndex + 1),
		id: text.slice(startIndex, endIndex + 1)
	};
}

function getChannelFromText(text) {
	return text.slice(2, text.length - 1);
}

module.exports = {
	getRandomColor,
	getRandomQuote,
	getRandomGreeting,
	getRandom8BallResponse,
	getUserFromMention,
	getMentionFromText,
	getChannelFromText,
};