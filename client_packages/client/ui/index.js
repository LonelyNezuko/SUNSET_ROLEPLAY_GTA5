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
			ui.cef = mp.browsers.new('package://ui/index.html')
			mp.events.add('ui::app:mounted', () =>
			{
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
	ui.call = (event, args = {}, logging = true) =>
	{
		try
		{
			if(!ui.cef)return

			// event = event.replace('UI::', '')
			if(logging) logger.debug(`ui.call: ${event}`, args)

			if(typeof args === 'object') ui.cef.execute(`trigger('${event}', '${JSON.stringify(args)}')`)
			else ui.cef.execute(`trigger('${event}', '${args}')`)
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
