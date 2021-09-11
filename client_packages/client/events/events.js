const logger = require('./client/modules/logger')

try
{
	require('./client/events/join')
    require('./client/events/user')
	require('./client/events/hud')

	const ui = require('./client/ui/index')
	const user = require('./client/user')

	mp.events.add({
		'server::user:joinShow': username =>
		{
			if(mp.storage.data.authRemember !== undefined)
			{
				ui.call('UI::join', {
					cmd: "remember",
					data: mp.storage.data.authRemember
				})
			}

			ui.call('UI::join', {
				cmd: "toggle",
				data: true
			})
			user.cursor(true, false)

			if(mp.storage.data.authRemember !== undefined
				&& mp.storage.data.authRemember.autoLogin === true)
			{
				ui.call('UI::join', {
					cmd: "autoLogin"
				})
			}
		},

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
