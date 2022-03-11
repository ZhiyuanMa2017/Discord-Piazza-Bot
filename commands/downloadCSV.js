const {SlashCommandBuilder} = require('@discordjs/builders');
const exportCSV = require('../utils/exportCSV');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('download-csv')
        .setDescription('Generates a CSV file of performance data.'),
    async execute(interaction) {
        exportCSV.saveCSV();
        await interaction.reply(
            {
                content: 'CSV file generated.',
                files: [{attachment: './piazza.csv', name: 'piazza.csv'}],
            }
        );
    },
}