const { SlashCommandBuilder } = require('discord.js');
const { weatherAPIKey } = require('../../config/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('forecast')
		.setDescription('Provides the current weather forecast for a specific geoposition')
		.addStringOption(option =>
			option.setName('geoposition')
				.setDescription('The position for which to provide a forecast.')
				.setRequired(true)),

	async execute(interaction) {
		// interaction.options/getString represents the guild, in which the command was run
		let locKey;
		let maxTemp;
		let minTemp;

		const query = interaction.options.getString('geoposition');
		const url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${weatherAPIKey}&q=${query}`;
		const locationKeyReq = await new Request(url);
		const res = await fetch(locationKeyReq)
			.then((response) => response.json())
			.then((data) => {
				locKey = data.Key;
			});
		const forecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locKey}?&apikey=${weatherAPIKey}&metric=true`;
		const forecastReq = await new Request(forecastUrl);
		const forecastRes = await fetch(forecastReq)
			.then((response) => response.json())
			.then((data) => {
				minTemp = data.DailyForecasts[0].Temperature.Minimum.Value;
				maxTemp = data.DailyForecasts[0].Temperature.Maximum.Value;
			});

		await interaction.reply({
			content: `${locKey}, minTemp = ${minTemp}, maxTemp = ${maxTemp}`, fetchReply:true });

	},
};

