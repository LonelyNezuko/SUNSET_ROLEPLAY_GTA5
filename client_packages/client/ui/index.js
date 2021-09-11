const logger = require('./client/modules/logger')

try
{
	const ui = {}

	ui.cef = null
	ui.cefActive = false

	ui.start = () =>
	{
		try
		{
			ui.cef = mp.browsers.new('package://ui/ui.html')
			mp.events.add('browserDomReady', browser =>
			{
				if(browser !== ui.cef)return user.kick('Не удалось загрузить UI!')

				ui.cefActive = true
				logger.debug('UI started')

				mp.events.callRemote('client::user:join')
			})
		}
		catch(e)
		{
			logger.error('ui.start', e)
		}
	}
	ui.call = (event, args = {}) =>
	{
		try
		{
			if(!ui.cef)return

			logger.debug(`ui.call: ${event}`, args)

			if(typeof args === 'object') ui.cef.execute(`rage.trigger('${event}', '${JSON.stringify(args)}')`)
			else ui.cef.execute(`rage.trigger('${event}', '${args}', false)`)
		}
		catch(e)
		{
			logger.error(`ui.call`, e)
		}
	}

	exports = ui
}
catch(e)
{
	logger.error('ui.js', e)
}
