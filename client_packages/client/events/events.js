const logger = require('./client/modules/logger')

try
{
	require('./client/events/join')
    require('./client/events/user')
	require('./client/events/hud')
	require('./client/events/vehicles')
	require('./client/events/menuList')
	require('./client/events/npc')
	require('./client/events/npcDialog')

	const ui = require('./client/ui/index')
	const user = require('./client/user')

	mp.events.add({
		'render': () =>
		{
			mp.game.vehicle.defaultEngineBehaviour = false
		    mp.players.local.setConfigFlag(429, true)

			if(user.escStatus === false) mp.game.controls.disableControlAction(32, 200, true)

			if(mp.players.local.vehicle)
			{
				const speed = mp.players.local.vehicle.getSpeed() * 3.6
				if(mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle
					&& mp.players.local.vehicle.getIsEngineRunning())
				{
					ui.call('UI::hud', {
						cmd: 'update',
						data: {
							speed: {
								speed: speed
							}
						}
					}, false)
				}

				user.vehicleMileage += speed / 25 / 3000
				if(user.vehicleMileage >= 1)
				{
					user.vehicleMileage = 0.0
					mp.events.callRemote('client::vehicles:giveMileage', JSON.stringify({
						mileage: 1,
						vehicle: mp.players.local.vehicle
					}))
				}
			}
		},

		'ui::keys:try': data =>
		{
			mp.events.callRemote('client::enterKey', parseInt(data))
		},

		'playerEnterVehicle': () =>
		{
			user.vehicleBelt = false
			mp.players.local.setConfigFlag(32, true)
		},
		'playerExitVehicle': () =>
		{
			if(user.vehicleBelt)
			{
				user.vehicleBelt = false
				mp.players.local.setConfigFlag(32, true)

				chat.sendMe(`отстегнул ремень безопастности`)
			}
		}
	})
}
catch(e)
{
	logger.error('events.js', e)
}
