module.exports =
{
	log: (text) =>
	{
		console.log(`[ LOGGER ] ${text}`)
	},
	mysqlLog: (text) =>
	{
		console.log(`[ MySQL LOGGER ] ${text}`)
	},
	playerLog: (player, text) =>
	{
		console.log(`[ Player LOGGER ] ${player.getName()}: ${text}`)
	}
}