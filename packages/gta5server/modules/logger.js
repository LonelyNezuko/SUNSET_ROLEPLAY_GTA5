const debugEnabled = true

module.exports =
{
	log: (text, ...args) =>
	{
		if(args.length) console.log(`[ logger ] ${text}`, args)
		else console.log(`[ logger ] ${text}`)
	},
	error: (text, ...args) =>
	{
		if(args.length) console.log(`[ ERROR ] ${text}`, args)
		else console.log(`[ ERROR ] ${text}`)
	},
	debug: (text, ...args) =>
	{
		if(debugEnabled === false)return

		if(args.length) console.log(`[ debug ] ${text}`, args)
		else console.log(`[ debug ] ${text}`)
	},

	mysqlLog: (text, ...args) =>
	{
		if(args.length) console.log(`[ MySQL logger ] ${text}`, args)
		else console.log(`[ MySQL logger ] ${text}`)
	},
	playerLog: (player, text, ...args) =>
	{
		if(args.length) console.log(`[ Player logger ] ${player.getName()}: ${text}`, args)
		else console.log(`[ Player logger ] ${player.getName()}: ${text}`)
	},

	clientLog: (text, args) =>
	{
		if(args) console.log(`[ client logger ] ${text}`, args)
		else console.log(`[ client logger ] ${text}`)
	},
	clientError: (text, args) =>
	{
		if(args) console.log(`[ CLIENT ERROR ] ${text}`, args)
		else console.log(`[ CLIENT ERROR ] ${text}`)
	},
	clientDebug: (text, args) =>
	{
		if(debugEnabled === false)return

		if(args) console.log(`[ client debug ] ${text}`, args)
		else console.log(`[ client debug ] ${text}`)
	},
}
