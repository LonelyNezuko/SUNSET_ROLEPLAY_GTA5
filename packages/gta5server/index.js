const logger = require('./modules/logger')

try
{
	const mysql = require('./mysql')
	mysql.connect(() =>
	{
		require('./events/events')
		require('./commands/commands')

		require('./modules/noClip')

		logger.log('Mode Started')
	})
}
catch(e)
{
	logger.error(`Mode Start`, e)
}
