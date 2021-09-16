const logger = require('../modules/logger')

try
{
	const commands = {}
	function commandsAdd(cmds)
	{
		if(typeof commands !== 'object')return
		for(var key in cmds) commands[key] = cmds[key]
	}

	module.exports = [ commandsAdd, commands ]
}
catch(e)
{
	logger.error('commands.js', e)
}
