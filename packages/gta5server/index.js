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
		require('./commands/_connect')

		require('./modules/noClip')

		const vehicles = require('./property/vehicles')

		vehicles.load()

		setInterval(() =>
		{
			vehicles.timer()
		}, 1000)
	})
}
catch(e)
{
	logger.error(`Mode Start`, e)
}
