const logger = require('./modules/logger')
try
{
	const enums = require('./modules/enums')
	const container = require('./modules/container')
	const func = require('./modules/func')

	const mysql = require('./mysql')
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

	user.load = (player, id) =>
	{
		mysql.query('select * from users where id = ?', [ id ], (err, res) =>
		{
			if(err)return logger.error('server::user:load', err)
			if(!res.length)return user.kick(player, 'Аккаунт не найден! Перезайдите.')

			enums.userVariables.forEach(item =>
			{
				container.set('user', player.id, item, func.isJSON(res[0][item]) ? JSON.parse(res[0][item]) : res[0][item])
			})
			container.set('user', player.id, 'id', res[0]['id'])

			container.set('user', player.id, 'isLogged', true)
			mp.players.forEach(pl =>
			{
				if(user.isLogged(pl)) user.updateHud(pl)
			})

			container.set('user', player.id, 'lastDate', new Date())
			user.spawn(player)
		})
	}
	user.save = (player) =>
	{
		if(!user.isLogged(player))return

		let query = 'update users set '
		const args = []

		container.set('user', player.id, 'position', {
			x: player.position.x,
			y: player.position.y,
			z: player.position.z,
			a: player.heading,
			vw: player.dimension
		})

		enums.userVariables.forEach((item, i) =>
		{
			query += `${item} = ?`

			logger.log(item, typeof container.get('user', player.id, item), container.get('user', player.id, item))

			if(item === 'regDate'
				|| item === 'lastDate'
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

			if(i === enums.userVariables.length - 1) query += ' '
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
	}

	user.spawn = (player, defaultSpawn = false) =>
	{
		try
		{
			logger.log('user.spawn', container.get('user', player.id, 'position'))
			if(container.get('user', player.id, 'userCreate') === 0)return user.createCharacter(player)

			user.resetSkin(player)
			user.resetClothes(player)

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
		catch(e)
		{
			logger.error('user.spawn', e)
		}
	}

	user.choiceRole = player =>
	{
		if(container.get('user', player.id, 'choiceRole') !== 0)return user.spawn(player)

		user.setPos(player, 218.12791442871094, -1139.1434326171875, 29.29643440246582, 98.06212615966797, player.id + 1)
		setTimeout(() => player.call('server::user:choiceRole'), 1000)
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
	user.resetClothes = (player) =>
	{
		if(!user.isLogged(player))return
		player.call('server::user:resetClothes', [ enums.clothes.none[container.get('user', player.id, 'gender')] ])
	}
	// user.setClothes = (player, clothes = null) =>
	// {
	// 	if(!user.isLogged(player))return
	//
	// 	player.call('server::user:resetClothes', [ container.get('user', player.id, 'gender') enums.clothes.none[container.get('user', player.id, 'gender')] ])
	// }


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
			logger.debug('user.setPos', x, y, z, a, vw)

			player.position = new mp.Vector3(x, y, z)
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
