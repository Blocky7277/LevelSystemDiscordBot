const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const sleep = require('../../utility/sleep.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('defer')
		.setDescription('Replies with Pong... But Defered!'),
	async call(interaction) {
		interaction.deferReply();
		await sleep(5000)
		await interaction.editReply('Pong!');
	},
};