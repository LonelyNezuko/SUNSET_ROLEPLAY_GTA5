const logger = require('./client/modules/logger')

try
{
	require('./client/events/join')
    require('./client/events/user')
	require('./client/events/hud')

	const ui = require('./client/ui/index')
	const user = require('./client/user')

	mp.events.add({
		'render': () =>
		{
			if(user.escStatus === false) mp.game.controls.disableControlAction(32, 200, true)
		}
	})
}
catch(e)
{
	logger.error('events.js', e)
}
