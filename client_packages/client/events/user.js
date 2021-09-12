const logger = require('./client/modules/logger')

try
{
	const ui = require('./client/ui/index')
	const user = require('./client/user')

	const chat = require('./client/chat')
	const func = require('./client/modules/func')

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
				setTimeout(() =>
				{
					ui.call('UI::join', {
						cmd: "autoLogin"
					})
				}, 500)
			}
		},

		'server::user:toggleHUD': toggle =>
		{
			user.toggleHud(toggle)
		},
		'server::user:updateHUD': data =>
		{
			ui.call('UI::hud', {
				cmd: 'update',
				data: data
			})
		},

		'server::user:notify': (text, type) =>
		{
			user.notify(text, type)
		},
		'server::user:loadScreen': (toggle, duration) =>
		{
			user.loadScreen(toggle, duration)
		},

		'server::user:getint': () =>
		{
			chat.send(`Int ID: ${mp.game.interior.getInteriorAtCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z)}`)
		},

		'server::user:resetskin': (settings, gender) =>
		{
			user.resetSkin(settings, gender)
		},
		'server::user:resetClothes': clothes =>
		{
			user.resetClothes(clothes)
		},

		'server::user:createCharacter': () =>
		{
			mp.players.local.freezePosition(true)

			const playerPosition = mp.players.local.position
			const cameraValues = {
				angel: 360,
				dist: 0,
				height: 0.1
			}
		    const cameraPosition = func.getCameraOffset(new mp.Vector3(playerPosition.x, playerPosition.y, playerPosition.z + cameraValues.height), cameraValues.angle, cameraValues.dist)

			setTimeout(() =>
			{
				user.toggleHud(false)
				ui.call('UI::userCreate', {
					cmd: 'toggle',
					data: true
				})

				user.setCamera(new mp.Vector3(437.9560241699219, -993.4720825195312, 31.3), [ 435.93829345703121, -993.4317993164062, 31.3 ], 30)
				user.cameraEdit = true

				user.cursor(true, false)
			}, 1200)
		},
		'ui::user:updateCharacter': data =>
		{
			data = JSON.parse(data)

			logger.log('ui::user:updateCharacter', data.settings, data.gender)
			user.resetSkin(data.settings, data.gender)

			const clothes = [
	            {
	                mask: 0,
	                torsos: 15,
	                legs: 18,
	                bags: 0,
	                shoes: 34,
	                accessories: 0,
	                undershirts: 15,
	                armour: 0,
	                decals: 0,
	                tops: 15
	            },
	            {
	                mask: 0,
	                torsos: 15,
	                legs: 17,
	                bags: 0,
	                shoes: 35,
	                accessories: 0,
	                undershirts: 15,
	                armour: 0,
	                decals: 0,
	                tops: 15
	            }
	        ]
			user.resetClothes(clothes[data.gender])
		},
		'ui::user:changeCameraCharacter': data =>
		{
			data = JSON.parse(data)

			if(data.camera === 'global')
			{
				user.camera.setCoord(437.9560241699219, -993.4720825195312, 31.3)
				user.camera.pointAtCoord(435.93829345703121, -993.4317993164062, 31.3)
				user.camera.setFov(30)
			}
			else if(data.camera === 'face')
			{
				user.camera.setCoord(437.9560241699219, -993.4720825195312, 31.3)
				user.camera.pointAtCoord(435.93829345703121, -993.4317993164062, 31.3)
				user.camera.setFov(20)
			}
		},
		'ui::user:saveCharacter': data =>
		{
			mp.events.callRemote('client::user:saveCharacter', data)
		},
		'server::user:closeUserCreate': () =>
		{
			user.toggleHud(true)
			ui.call('UI::userCreate', {
				cmd: 'toggle',
				data: false
			})

			user.destroyCamera()
			user.cursor(false, true)

			mp.players.local.freezePosition(false)
		},
		'server::user:userCreateError': () =>
		{
			ui.call('UI::userCreate:errorCharName')
		},

		'server::user:choiceRole': () =>
		{
			user.toggleHud(false)
			user.cursor(true, false)

			mp.players.local.freezePosition(true)
			user.setCamera(new mp.Vector3(155.412109375, -1070.2464599609375, 269.3681945800781), [ 47.71329116821289, -462.1255187988281, 93.9698715209961 ])

			ui.call('UI::choiceRole', {
				cmd: 'toggle',
				data: true
			})
		},
		'ui::choiceRole': data =>
		{
			try
			{
				logger.log('ui::choiceRole', data)

				user.cursor(false, true)
				mp.players.local.freezePosition(false)

				user.destroyCamera()

				ui.call('UI::choiceRole', {
					cmd: 'toggle',
					data: false
				})

				data = JSON.parse(data)
				mp.events.callRemote('client::user:choiceRole', data.id)
			}
			catch(e)
			{
				logger.error('ui::choiceRole', e)
			}
		}
	})
}
catch(e)
{
	logger.error('events.js', e)
}
