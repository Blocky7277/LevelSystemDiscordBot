const { SlashCommandBuilder, SlashCommandUserOption } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Shows the level of the target')
    .addUserOption(option => 
        option.setName("target")
        .setDescription("person who's level is displayed")
        .setRequired(true)
    ),
	async call(interaction) {
		await interaction.reply('asdf!');
	},
};