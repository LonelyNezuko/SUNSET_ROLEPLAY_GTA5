const logger = require('./modules/logger')
try
{
	const enums = require('./modules/enums')
	const container = require('./modules/container')
	const func = require('./modules/func')

	const mysql = require('./mysql')

	const chat = require('./chat')

	const user = {}

	user.notify = (player, text, type = 'info') =>
	{
		player.call('server::user:notify', [ text, type ])
	}

	user.kick = (player, reason) =>
	{
		user.notify(player, reason, 'error')
		setTimeout(() => player.kick(), 2000)
	}

	user.load = (player, character) =>
	{
		logger.log('user.load', character)
		container.delete('user', player.id)
		container.set('user', player.id, 'isLogged', false)

		mysql.query('select * from characters where id = ?', [ character ], (err, res) =>
		{
			try
			{
				if(err)return logger.error('user.load', err)
				if(!res.length)return user.kick(player, 'Персонаж не найден!')

				enums.characterVariables.forEach(item =>
				{
					container.set('user', player.id, item, func.isJSON(res[0][item]) ? JSON.parse(res[0][item]) : res[0][item])
				})

				container.set('user', player.id, 'id', res[0]['id'])
				container.set('user', player.id, 'userID', res[0]['userID'])

				container.set('user', player.id, 'lastDate', new Date())
				container.set('user', player.id, '/veh', null)

				const keyBinds = container.get('user', player.id, 'keyBinds')
				for(var item in enums.keyDefaultBinds)
				{
					if(!keyBinds[item]) keyBinds[item] = enums.keyDefaultBinds[item]
				}
				container.set('user', player.id, 'keyBinds', keyBinds)

				const chatsettings = container.get('user', player.id, 'chatsettings')
				for(var item in enums.defaultChatSettings)
				{
					if(chatsettings[item] === undefined) chatsettings[item] = enums.defaultChatSettings[item]
				}
				container.set('user', player.id, 'chatsettings', chatsettings)

				container.set('user', player.id, 'nears', {})

				mysql.query('select * from users where id = ?', [ container.get('user', player.id, 'userID') ], (err, res) =>
				{
					try
					{
						if(err)return logger.error('user.load', err)
						if(!res.length)return user.kick(player, 'Аккаунт не найден!')

						container.set('user', player.id, 'user_id', res[0]['id'])
						container.set('user', player.id, 'user_username', res[0]['username'])
						container.set('user', player.id, 'user_password', res[0]['password'])
						container.set('user', player.id, 'user_email', res[0]['email'])
						container.set('user', player.id, 'user_regDate', res[0]['regDate'])
						container.set('user', player.id, 'user_regIP', res[0]['regIP'])

						container.set('user', player.id, 'admin', res[0]['admin'])
						container.set('user', player.id, 'adminData', JSON.parse(res[0]['adminData']))

						container.set('user', player.id, 'user_lastDate', new Date())
						container.set('user', player.id, 'user_lastIP', player.ip)

						container.set('user', player.id, 'isLogged', true)
						mp.players.forEach(pl =>
						{
							if(user.isLogged(pl)) user.updateHud(pl)
						})

						player.call('server::user:setAdminLevel', [ user.getAdmin(player) ])

						chat.local(player, `Добро пожаловать на ${enums.projectNameShort} | ${enums.serverName}`, {
							timestamp: false
						})
						if(user.getAdmin(player)) chat.local(player, `Вы вошли, как администратор ${user.getAdmin(player)} уровня.`, {
							timestamp: false,
							style: {
								color: "#6bc5cf"
							}
						})

						setTimeout(() => user.spawn(player, false, false), 500)
					}
					catch(e)
					{
						logger.error('', e)
					}
				})
			}
			catch(e)
			{
				logger.error('', e)
			}
		})
	}
	user.save = (player) =>
	{
		if(!user.isLogged(player))return

		let query = 'update characters set '
		const args = []

		container.set('user', player.id, 'position', {
			x: player.position.x,
			y: player.position.y,
			z: player.position.z,
			a: player.heading,
			vw: player.dimension
		})

		// Сохранение персонажа
		enums.characterVariables.forEach((item, i) =>
		{
			query += `${item} = ?`

			if(item === 'lastDate'
				|| item === 'dateBirth')
			{
				let date = new Date(container.get('user', player.id, item)).getFullYear() + '.' + (new Date(container.get('user', player.id, item)).getMonth() + 1) + '.' + new Date(container.get('user', player.id, item)).getDate() + ' ' + new Date(container.get('user', player.id, item)).getHours() + ':' + new Date(container.get('user', player.id, item)).getMinutes() + ':' + new Date(container.get('user', player.id, item)).getSeconds()
				args.push(date)
			}
			else
			{
				if(typeof container.get('user', player.id, item) === 'object') args.push(JSON.stringify(container.get('user', player.id, item)))
				else if(typeof container.get('user', player.id, item) === 'string') args.push(container.get('user', player.id, item).replace('"', ''))
				else args.push(container.get('user', player.id, item))
			}

			if(i === enums.characterVariables.length - 1) query += ' '
			else query += ', '
		})

		query += `where id = ?`
		args.push(container.get('user', player.id, 'id'))

		logger.debug('user.save', {
			message: query,
			args: args
		})
		mysql.query(query, args, err =>
		{
			if(err)return logger.error('user.save', err)
		})

		// Сохранение аккаута
		mysql.query(`update users set username = ?, password = ?, email = ?, lastDate = ?, lastIP = ?,
			admin = ?, adminData = ? where id = ?`, [
			container.get('user', player.id, 'user_username'),
			container.get('user', player.id, 'user_password'),
			container.get('user', player.id, 'user_email'),
			new Date(container.get('user', player.id, 'user_lastDate')).getFullYear() + '.' + (new Date(container.get('user', player.id, 'user_lastDate')).getMonth() + 1) + '.' + new Date(container.get('user', player.id, 'user_lastDate')).getDate() + ' ' + new Date(container.get('user', player.id, 'user_lastDate')).getHours() + ':' + new Date(container.get('user', player.id, 'user_lastDate')).getMinutes() + ':' + new Date(container.get('user', player.id, 'user_lastDate')).getSeconds(),
			container.get('user', player.id, 'user_lastIP'),
			container.get('user', player.id, 'admin'),
			JSON.stringify(container.get('user', player.id, 'adminData')),
			container.get('user', player.id, 'user_id')
		], err =>
		{
			if(err)return logger.error('user.save', err)
		})
	}

	user.spawn = (player, defaultSpawn = false, saveClothes = true) =>
	{
		if(container.get('user', player.id, 'userCreate') === 0)return user.createCharacter(player)

		user.resetSkin(player)
		user.resetClothes(player)

		user.setClothes(player, container.get('user', player.id, 'clothes'), saveClothes, false)

		if(container.get('user', player.id, 'position').x !== 0
			&& container.get('user', player.id, 'position').y !== 0
			&& container.get('user', player.id, 'position').z !== 0
			&& !defaultSpawn) user.setPos(player, container.get('user', player.id, 'position').x, container.get('user', player.id, 'position').y, container.get('user', player.id, 'position').z, container.get('user', player.id, 'position').a, container.get('user', player.id, 'position').vw)
		else
		{
			let spawn = enums.defaultSpawn[func.random(0, enums.defaultSpawn.length - 1)]
			user.setPos(player, spawn[0], spawn[1], spawn[2], spawn[3], spawn[4])
		}
	}

	user.createCharacter = (player) =>
	{
		if(container.get('user', player.id, 'userCreate') !== 0)return user.spawn(player)

		if(container.get('user', player.id, 'userCreate') !== 0) user.savePos(player)
		user.setPos(player, 436.1955261230469, -993.43701171875, 30.689594268798828, -93.25418853759766, player.id + 1)

		user.resetSkin(player)
		user.resetClothes(player)

		player.call('server::user:createCharacter')
	}

	user.resetSkin = (player, gender = -1, data = null) =>
	{
		if(!user.isLogged(player))return
		// { "pedigree": "one": 0, "two": 0, "looks": 0.5, "skin": 0.5 }, "hair": "color": 0, "head": 0, "eyebrow": 0, "beard": 0, "breast": 0 }, "face": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "appearance": [0, 0, 0, 0, 0, 0, 0, 0, 0] }

		let settings = container.get('user', player.id, 'skin')
		if(data) settings = data

		if(gender === -1) gender = container.get('user', player.id, 'gender')
		player.call('server::user:resetskin', [ settings, gender ])
	}
	user.resetClothes = (player, save = false) =>
	{
		if(!user.isLogged(player))return

		user.setClothes(player, 'none', save)
	}
	user.setClothes = (player, clothes = 'none', save = true, isName = true) =>
	{
		if(!user.isLogged(player))return

		if(isName) clothes = user.getEnumsClothes(player, clothes)
		player.call('server::user:setClothes', [ clothes ])

		if(save)
		{
			const saveClothes = container.get('user', player.id, 'clothes')
			for(var key in clothes) saveClothes[key] = clothes[key]

			container.set('user', player.id, 'clothes', saveClothes)
			user.save(player)
		}
	}


	user.updateHud = player =>
	{
		player.call('server::user:updateHUD', [ {
			cash: container.get('user', player.id, 'cash'),
			online: mp.players.length,
			stock: enums.stockX2 ? '2': '0',
			serverName: enums.serverName
		} ])
	}
	user.isLogged = player =>
	{
		return container.get('user', player.id, 'isLogged')
	}

	user.setPos = (player, x, y, z, a = -1, vw = -1) =>
	{
		if(a === -1) a = player.heading
		if(vw === -1) vw = player.dimension

		x = parseFloat(x)
		y = parseFloat(y)
		z = parseFloat(z)
		a = parseInt(a)
		vw = parseInt(vw)

		user.loadScreen(player, true)
		setTimeout(() =>
		{
			if(!player.vehicle) player.position = new mp.Vector3(x, y, z)
			else
			{
				player.vehicle.position = new mp.Vector3(x, y, z)
				player.vehicle.heading = a
				player.vehicle.dimension = vw
			}

			player.heading = a
			player.dimension = vw

			setTimeout(() =>
			{
				user.loadScreen(player, false)
			}, 500)
		}, 500)
	}
	user.loadScreen = (player, toggle, duration = 500) =>
	{
		player.call('server::user:loadScreen', [ toggle, duration ])
	}

	user.isOnFoot = player =>
	{
		if(!user.isLogged(player))return false
		return true
	}

	user.setCash = (player, cash) =>
	{
		if(!user.isLogged(player))return

		container.set('user', player.id, 'cash', parseFloat(cash))

		user.updateHud(player)
		user.save(player)
	}
	user.getCash = player =>
	{
		if(!user.isLogged(player))return 0
		return container.get('user', player.id, 'cash')
	}

	user.giveCash = (player, cash) =>
	{
		if(!user.isLogged(player))return
		user.setCash(player, user.getCash(player) + cash)
	}


	user.getPlayer = id =>
	{
		let player
		mp.players.forEach(pl =>
		{
			if(user.isLogged(pl)
				&& pl.id === id) player = pl
		})
		return player
	}

	user.getEnumsClothes = (player, clothes) =>
    {
        if(!user.isLogged(player))return {}
        return enums.clothes[clothes][container.get('user', player.id, 'gender')]
    }

	user.getCharName = player =>
	{
		if(!user.isLogged(player))return 'No Name'
		return container.get('user', player.id, 'charname')
	}
	user.getUserName = player =>
	{
		if(!user.isLogged(player))return 'undefined'
		return container.get('user', player.id, 'user_username')
	}

	user.getAdmin = player =>
	{
		if(!user.isLogged(player))return 'undefined'
		return container.get('user', player.id, 'admin')
	}
	user.setAdmin = (player, level, setUsername = 'System') =>
	{
		if(!user.isLogged(player)
			|| level < 0 || level > 5)return

		let data = {}
		if(level)
		{
			if(!user.getAdmin(player))
			{
				data = {
					setDate: new Date(),
					setUsername: setUsername
				}
			}
			else
			{
				data = container.get('user', player.id, 'adminData')

				data.resetDate = new Date()
				data.resetUsername = setUsername
				data.lastLevel = user.getAdmin(player)
			}
		}

		container.set('user', player.id, 'admin', level)
		container.set('user', player.id, 'adminData', data)

		user.notify(player, `Ваш уровень админки был изменен на ${level}`)
		user.save(player)
	}

	user.getKeyBind = (player, bindName) =>
	{
		if(!user.isLogged(player))return {}
		return container.get('user', player.id, 'keyBinds')[bindName]
	}

	user.setNear = (player, nearName, nearData) =>
	{
		if(!user.isLogged(player))return

		const nears = user.getNears(player)

		nears[nearName] = nearData
		container.set('user', player.id, 'nears', nears)
	}
	user.removeNear = (player, nearName) =>
	{
		if(!user.isLogged(player))return

		const nears = user.getNears(player)

		delete nears[nearName]
		container.set('user', player.id, 'nears', nears)
	}
	user.getNears = player =>
	{
		if(!user.isLogged(player))return {}
		return container.get('user', player.id, 'nears')
	}

	user.getID = player =>
	{
		if(!user.isLogged(player))return {}
		return container.get('user', player.id, 'id')
	}

	// inventory
	// user.inventory = {}
	//
	// user.inventory.add = (player, itemHash, quantity = 1, data = {}) =>
	// {
	// 	if(!user.isLogged(player))return
	//
	// 	const userINV = container.get('user', player.id, 'inventory')
	// 	if(!userINV) userINV = []
	//
	// 	const item = enums.inventory.getItem(itemHash)
	// 	if(!item)return
	//
	// 	function addItem(_quan = quantity) =>
	// 	{
	// 		userINV.push({
	// 			itemHash: itemHash,
	// 			quantity: _quantity,
	// 			data: data
	// 		})
	// 	}
	//
	// 	if(item.maxQuantity > 1)
	// 	{
	//
	// 	}
	// 	else
	// 	{
	//
	// 	}
	// }

	module.exports = user
}
catch(e)
{
	logger.error('user.js', e)
}
