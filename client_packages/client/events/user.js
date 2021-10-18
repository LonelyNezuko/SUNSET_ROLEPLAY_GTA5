const logger = require('./client/modules/logger')

try
{
	const ui = require('./client/ui/index')
	const user = require('./client/user')

	const chat = require('./client/chat')
	const func = require('./client/modules/func')
	const enums = require('./client/modules/enums')

	mp.events.add({
		'ui::user:cameraEdit': data =>
		{
			data = JSON.parse(data)

			if(!user.cameraEdit
				|| !user.camera)
			{
				ui.call('UI', {
					cmd: 'cameraEdit',
					data: false
				})

				return
			}
			if(data.x < -300
				|| data.x > 300
				|| data.y < -700
				|| data.y > 300)return

			const playerPosition = mp.players.local.position

			let position = new mp.Vector3(playerPosition.x, playerPosition.y, playerPosition.z + 0.5)
			let positionAtCoord = [ playerPosition.x, playerPosition.y, playerPosition.z + 0.5]

			logger.log('', user.camera.getRot(), user.camera.getCoord())

			if(data.which === 1)
			{
				position.y += data.x / 1000
				positionAtCoord[1] += data.x / 1000
			}
			else if(data.which === 3)
			{
				position.z += data.y / 1000
				positionAtCoord[2] += data.y / 1000
			}
			else return false

	        const cameraPosition = func.getCameraOffset(new mp.Vector3(position.x, position.y, position.z), mp.players.local.getHeading() + 90, 1.5)
			// logger.log('ui::user:cameraEdit', cameraPosition, position, positionAtCoord)

			user.camera.setCoord(cameraPosition.x, cameraPosition.y, cameraPosition.z)
			user.camera.pointAtCoord(positionAtCoord[0], positionAtCoord[1], positionAtCoord[2])
		},

		'server::user:joinShow': value =>
		{
			const data = {
				online: value.online
			}
			if(mp.storage.data.authRemember !== undefined) data.auth = [ mp.storage.data.authRemember.username, mp.storage.data.authRemember.password ]

			ui.call('UI::auth', {
				cmd: "show",
				data: data
			})
			user.cursor(true, false)

			// if(mp.storage.data.authRemember !== undefined
			// 	&& mp.storage.data.authRemember.autoLogin === true)
			// {
			// 	setTimeout(() =>
			// 	{
			// 		ui.call('UI::join', {
			// 			cmd: "autoLogin"
			// 		})
			// 	}, 500)
			// }
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
		'server::user:setCamera': (position, atCoord, data) =>
		{
			user.setCamera(position, atCoord, data)
		},
		'server::user:destroyCamera': data =>
		{
			user.destroyCamera(data)
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
		'server::user:setClothes': (clothes, logger) =>
		{
			user.setClothes(clothes, logger)
		},

		'server::user:createCharacter': (userCreate, settings) =>
		{
			mp.players.local.freezePosition(true)

			setTimeout(() =>
			{
				user.toggleHud(false)
				ui.call('UI::createChar', {
					cmd: 'show',
					data: !userCreate ? true : false
				})

				const data = settings.settings
				data.genetic.gender = settings.gender
				data.genetic.name = settings.name
				data.genetic.surname = settings.surname
				data.genetic.birthday = settings.birthday
				data.genetic.nationality = settings.nationality
				data.clothes = [ 0, 0, 0 ]

				logger.log('', data)

				// ui.call('UI::createChar', {
				// 	cmd: 'update',
				// 	data: data
				// })

				user.setCameraToPlayer()
				user.cursor(true, false)

			}, 1200)
		},
		'ui::createChar:update': data =>
		{
			data = JSON.parse(data)

			const gender = data.genetic.gender
			const clothes = data.clothes

			delete data.genetic.gender
			delete data.clothes

			logger.log('ui::user:updateCharacter', data.genetic, data.face, data.hair, data.appearance, gender, clothes)

			user.resetSkin(data, gender)

			user.setClothes(enums.createCharClothes[!gender ? 0 : 1][0][clothes[0]])
			user.setClothes(enums.createCharClothes[!gender ? 0 : 1][1][clothes[1]])
			user.setClothes(enums.createCharClothes[!gender ? 0 : 1][2][clothes[2]])
		},
		'ui::createChar:updateCam': camera =>
		{
			switch(camera)
	        {
				case 0:
	            {
	                user.setCameraToPlayer({
	                    height: 0.7,
	                    dist: 1
	                })
	                break
	            }
	            case 1:
	            {
	                user.setCameraToPlayer()
	                break
	            }
	            case 2:
	            {
	                user.setCameraToPlayer({
	                    height: -0.6
	                })
	                break
	            }
	        }
		},
		'ui::createChar:create': data =>
		{
			mp.events.callRemote('client::user:saveCharacter', data)
		},
		'server::user:closeUserCreate': () =>
		{
			user.toggleHud(true)
			ui.call('UI::createChar', {
				cmd: 'hide'
			})

			user.destroyCamera()
			user.cursor(false, true)

			mp.players.local.freezePosition(false)
		},
		'server::user:userCreateError': () =>
		{
			ui.call('UI::createChar', {
				cmd: 'showNameError'
			})
		},

		'server::user:setAdminLevel': level =>
		{
			user.adminLevel = level
		},

		'server::user:toggleSpeedometer': (status, data = {}) =>
		{
			data.show = status
			ui.call('UI::hud', {
				cmd: 'update',
				data: {
					speed: data
				}
			})

			if(status) user.vehicleMileage = 0.0
		},
		'server::user:engineSpeedometer': status =>
		{
			ui.call('UI::hud', {
				cmd: 'update',
				data: {
					speed: {
						engine: status
					}
				}
			})
		},
		'server::user:mileageSpeedometer': mileage =>
		{
			ui.call('UI::hud', {
				cmd: 'update',
				data: {
					speed: {
						mileage: parseInt(mileage)
					}
				}
			})
		},
		'server::user:fuelSpeedometer': (fuel, maxFuel) =>
		{
			ui.call('UI::hud', {
				cmd: 'update',
				data: {
					speed: {
						fuel: [ parseInt(fuel), parseInt(maxFuel) ]
					}
				}
			})
		},
		'server::user:lockedSpeedometer': status =>
		{
			ui.call('UI::hud', {
				cmd: 'update',
				data: {
					speed: {
						doors: status
					}
				}
			})
		},

		'server::user:toggleActionText': (toggle, keyName, desc) =>
		{
			user.toggleActionText(toggle, keyName, desc)
		},

		'server::user:updateUIKeys': keys =>
		{
			const resultKeys = []
			for(var key in keys)
			{
				resultKeys.push(keys[key].key)
			}
			ui.call('UI::keys', {
				cmd: 'update',
				data: resultKeys
			})
		},

		'server::user:setMarker': (x, y, z, dimension, name) =>
		{
			user.setMarker(x, y, z, dimension, name)
		},
		'server::user:destroyMarker': () =>
		{
			user.destroyMarker()
		},

		'server::user:setRaceMarker': (x, y, z, dimension, name) =>
		{
			user.setRaceMarker(x, y, z, dimension, name)
		}
	})
}
catch(e)
{
	logger.error('events.js', e)
}
