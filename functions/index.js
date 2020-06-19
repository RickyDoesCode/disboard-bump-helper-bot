function getUserFromMention(client, mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

function getRandomColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function getEmojis() {
	const emojis = [
		":one:",
		":two:",
		":three:",
		":four:",
		":five:",
		":six:",
		":seven:",
		":eight:",
		":nine:",
		":ten:"
	];
	return emojis;
}

module.exports = {
	getUserFromMention,
	getRandomColor,
	getEmojis
}