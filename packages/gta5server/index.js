const logger = require('./modules/logger')
logger.log('Mode Loading...')

try
{
	const mysql = require('./mysql')
	const nodemailer = require('./modules/nodemailer')

	const enums = require('./modules/enums')

	nodemailer.connect()
	mysql.connect(() =>
	{
		require('./events/events')
		require('./commands/commands')

		require('./modules/noClip')
	})
}
catch(e)
{
	logger.error(`Mode Start`, e)
}
