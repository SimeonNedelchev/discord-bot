const { SlashCommandBuilder } = require('discord.js');
const { weatherAPIKey } = require('../../config/config.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('current')
		.setDescription('Provides the current conditions for a location')
		.addStringOption(option =>
			option.setName('geoposition')
				.setDescription('Get the current conditions for the specified geoposition.')
				.setRequired(true)),
	async execute(interaction) {
		let description;
		let currentTemp;
		let locKey;
		const query = interaction.options.getString('geoposition');
		const url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${weatherAPIKey}&q=${query}`;
		const locationKeyReq = await new Request(url);
		const res = await fetch(locationKeyReq)
			.then((response) => response.json())
			.then((data) => {
				locKey = data.Key;
			});
		const forecastUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locKey}?&apikey=${weatherAPIKey}`;
		const forecastReq = await new Request(forecastUrl);
		const forecastRes = await fetch(forecastReq)
			.then((response) => response.json())
			.then((data) => {
				currentTemp = data[0].Temperature.Metric.Value;
				description = data[0].WeatherText;
			});

		await interaction.reply({
			content: `Current temp: ${currentTemp}, Conditions: ${description}`, fetchReply: true,
		});
	},
};