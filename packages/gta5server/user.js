const logger = require('./modules/logger')
try
{
	const sha256 = require('js-sha256')

	const enums = require('./modules/enums')
	const container = require('./modules/container')
	const func = require('./modules/func')

	const mysql = require('./mysql')

	const chat = require('./chat')

	const user = {}

	user.notify = (player, text, type = 'success') =>
	{
		player.call('server::user:notify', [ text, type ])
	}

	user.setCamera = (player, position, atCoord, data = {}) =>
	{
		player.call('server::user:setCamera', [ position, atCoord, data ])
	}
	user.destroyCamera = (player, data = {}) =>
	{
		player.call('server::user:destroyCamera', data)
	}

	user.kick = (player, reason) =>
	{
		user.notify(player, reason, 'error')
		setTimeout(() => player.kick(), 2000)
	}

	user.create = (player, username, password, email, promo) =>
	{
		if(user.isLogged(player))return kick(player)

		const savePromo = {
			name: promo,
			enable: false
		}
		mysql.query(`insert into users (username, password, email, regIP, lastIP, adminData, promo) values (?, ?, ?, ?, ?, '{}', ?)`, [
			username,
			sha256(password),
			email,
			player.ip,
			player.ip,
			JSON.stringify(savePromo)
		], (err, res) =>
		{
			if(err)return logger.error('user.create', err)

			// временно
			const userID = res.insertId
			mysql.query(`insert into characters (userID, position, skin, clothes, keyBinds, chatsettings, quests) values (?, '{ "x": 0, "y": 0, "z": 0, "a": 0 }', '{ "genetic": { "mother": 0, "father": 0, "similarity": 0.5, "skinTone": 0.5 }, "hair": { "color": 0, "head": 0, "eyebrow": 0, "beard": 0, "breast": 0 }, "face": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "appearance": [0, 0, 0, 0, 0, 0, 0, 0, 0] }', '{}', '{}', '{}', '[]')`, [ userID ], (err, res) =>
			{
				if(err)return logger.error('user.create', err)

				player.call('server::join:hide', [ { type: 'reg' } ])
				user.load(player, res.insertId)
			})
		})
	}

	user.load = (player, character) =>
	{
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
				if(JSON.stringify(container.get('user', player.id, 'clothes')) === '{}') container.set('user', player.id, 'clothes', enums.clothes.none[container.get('user', player.id, 'gender')])

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
				container.set('user', player.id, 'opened', {})

				container.set('user', player.id, 'rentVehicle', null)

				container.set('user', player.id, 'jobActive', false)

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

						container.set('user', player.id, 'promo', JSON.parse(res[0]['promo']))

						container.set('user', player.id, 'isLogged', true)
						mp.players.forEach(pl =>
						{
							if(user.isLogged(pl)) user.updateHud(pl)
						})

						player.call('server::user:setAdminLevel', [ user.getAdmin(player) ])
						player.call('server::user:updateUIKeys', [ container.get('user', player.id, 'keyBinds') ])

						chat.local(player, `Добро пожаловать на ${enums.projectNameShort} | ${enums.serverName}`, -1, {
							timestamp: false
						})
						if(user.getAdmin(player)) chat.local(player, `Вы вошли, как администратор ${user.getAdmin(player)} уровня.`, '6bc5cf', {
							timestamp: false
						})

						player.call('server::npc:createPeds', [ container.all('npc') ])

						setTimeout(() =>
						{
							user.spawn(player)
							user.addQuest(player, 'Первый тестовый квест', 'Тест', 'Это тестовый квест для тестов', [
								{
									name: 'Поговорить с Эдвардом',

									maxProgress: 1,
									progress: 0
								},
								{
									name: 'Арендовать скутер',

									maxProgress: 1,
									progress: 0
								}
							], {
								desc: "$ 100.000.000",
								data: {
									cash: 100000000
								}
							}, {
								type: "System",
								name: "system",
								position: [ 0.0, 0.0, 0.0 ]
							})

						}, 500)
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
			admin = ?, adminData = ?, promo = ? where id = ?`, [
			container.get('user', player.id, 'user_username'),
			container.get('user', player.id, 'user_password'),
			container.get('user', player.id, 'user_email'),
			new Date(container.get('user', player.id, 'user_lastDate')).getFullYear() + '.' + (new Date(container.get('user', player.id, 'user_lastDate')).getMonth() + 1) + '.' + new Date(container.get('user', player.id, 'user_lastDate')).getDate() + ' ' + new Date(container.get('user', player.id, 'user_lastDate')).getHours() + ':' + new Date(container.get('user', player.id, 'user_lastDate')).getMinutes() + ':' + new Date(container.get('user', player.id, 'user_lastDate')).getSeconds(),
			container.get('user', player.id, 'user_lastIP'),
			container.get('user', player.id, 'admin'),
			JSON.stringify(container.get('user', player.id, 'adminData')),
			JSON.stringify(container.get('user', player.id, 'promo')),
			container.get('user', player.id, 'user_id')
		], err =>
		{
			if(err)return logger.error('user.save', err)
		})
	}

	user.spawn = (player, defaultSpawn = false) =>
	{
		if(container.get('user', player.id, 'userCreate') === 0)return user.createCharacter(player)

		for(var key in container.get('user', player.id, 'opened')) user.removeOpened(player, key)
		user.clearJobActive(player)

		user.resetSkin(player)
		user.resetClothes(player)

		user.setClothes(player, container.get('user', player.id, 'clothes'), false, false)

		if(container.get('user', player.id, 'position').x !== 0
			&& container.get('user', player.id, 'position').y !== 0
			&& container.get('user', player.id, 'position').z !== 0
			&& !defaultSpawn) user.setPos(player, container.get('user', player.id, 'position').x, container.get('user', player.id, 'position').y, container.get('user', player.id, 'position').z, container.get('user', player.id, 'position').a, container.get('user', player.id, 'position').vw)
		else
		{
			let spawn = enums.defaultSpawn[func.random(0, enums.defaultSpawn.length - 1)]
			user.setPos(player, spawn[0], spawn[1], spawn[2], spawn[3], spawn[4])
		}

		setTimeout(() =>
		{
			user.savePosition(player)
		}, 1500)
	}

	user.createCharacter = (player) =>
	{
		if(container.get('user', player.id, 'userCreate') !== 0)return user.spawn(player)
		if(container.get('user', player.id, 'userCreate') !== 0) user.savePosition(player)

		user.setPos(player, 436.1955261230469, -993.43701171875, 30.689594268798828, -93.25418853759766, player.id + 1)

		user.resetSkin(player)
		user.resetClothes(player)

		try
		{
			player.call('server::user:createCharacter', [ container.get('user', player.id, 'userCreate'), {
				settings: container.get('user', player.id, 'skin'),
				gender: container.get('user', player.id, 'gender'),
				name: container.get('user', player.id, 'charname').split(' ')[0],
				surname: container.get('user', player.id, 'charname').split(' ')[1],
				birthday: container.get('user', player.id, 'dateBirth'),
				nationality: container.get('user', player.id, 'nationality')
			} ])
		}
		catch(e)
		{
			logger.error('', e)
		}
	}

	user.resetSkin = (player, gender = -1, data = null) =>
	{
		if(!user.isLogged(player))return
		// { "genetic": "one": 0, "two": 0, "looks": 0.5, "skin": 0.5 }, "hair": "color": 0, "head": 0, "eyebrow": 0, "beard": 0, "breast": 0 }, "face": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "appearance": [0, 0, 0, 0, 0, 0, 0, 0, 0] }

		let settings = container.get('user', player.id, 'skin')
		if(data) settings = data

		if(gender === -1) gender = user.getGender(player)
		player.call('server::user:resetskin', [ settings, gender ])
	}
	user.resetClothes = (player) =>
	{
		if(!user.isLogged(player))return

		player.call('server::user:setClothes', [ user.getEnumsClothes(player, 'none'), false ])
	}
	user.setClothes = (player, clothes = 'none', save = false, isName = true) =>
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
		let online = 0
		mp.players.forEach(item =>
		{
			if(user.isLogged(item)) online ++
		})

		player.call('server::user:updateHUD', [ {
			money: [ container.get('user', player.id, 'cash'), 0 ],
			food: [ 50, 50 ],
			info: [ player.id, online ],
			date: new Date().getTime().toString(),
			serverDate: new Date().getTime().toString(),
			temperature: 17,
			region: [ 'Какой-то район', 'Какая-то улица' ]
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
        return enums.clothes[clothes][user.getGender(player)]
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
		if(!user.isLogged(player))return -1
		return container.get('user', player.id, 'id')
	}


	// quests
	user.getQuest = (player, questName) =>
	{
		if(!user.isLogged(player))return false

		let quest = false
		container.get('user', player.id, 'quests').forEach(item =>
		{
			if(item.name === questName) quest = item
		})
		return quest
	}
	user.getQuestStatus = (player, questName) =>
	{
		if(!user.isLogged(player))return false

		const quest = user.getQuest(player, questName)
		if(!quest)return false

		return quest.status
	}
	user.saveQuest = (player, questName, questSave) =>
	{
		if(!user.isLogged(player))return

		const allQuests = container.get('user', player.id, 'quests')
		if(allQuests.indexOf(user.getQuest(player, questName)) !== -1)
		{
			if(questSave === 'delete') allQuests.splice(allQuests.indexOf(user.getQuest(player, questName)), 1)
			else allQuests[allQuests.indexOf(user.getQuest(player, questName))] = questSave
		}

		container.set('user', player.id, 'quests', allQuests)
		user.save(player)
	}
	user.updateQuest = (player, questName, taskID, progress) =>
	{
		if(!user.isLogged(player))return

		const quest = user.getQuest(player, questName)
		if(!quest)return

		if(taskID < 0 || taskID >= quest.tasks.length)return
		if(quest.status === 'completed')return

		quest.tasks[taskID].progress += progress
		if(quest.tasks[taskID].progress >= quest.tasks[taskID].maxProgress)
		{
			let taskCompleted = 0
			quest.tasks.forEach(item =>
			{
				if(item.progress >= item.maxProgress) taskCompleted ++
			})

			if(taskCompleted >= quest.tasks.length)
			{
				if(quest.owner.type === 'System')return user.completeQuest(player, questName)
				else
				{
					user.notify(player, `Все задания квеста ${quest.name} были выполнены. Завершить квест можно у ${quest.owner.name}.`)
					// user.setGPS(player, quest.owner.position.x, quest.owner.position.y, quest.owner.position.z)
				}
			}
			else user.notify(player, `Задание по квесту ${quest.name} ${quest.tasks[taskID].name} было выполнено. Осталось заданий: ${quest.tasks.length - taskCompleted}`, 'warning')
		}

		user.saveQuest(player, questName, quest)
	}
	user.completeQuest = (player, questName) =>
	{
		if(!user.isLogged(player))return

		let quest = user.getQuest(player, questName)

		if(!quest)return
		if(quest.status === 'completed')return

		if(quest.prize.data.cash) user.giveCash(player, quest.prize.data.cash)

		user.notify(player, `Вы успешно завершили квест ${quest.name} и получили: ${quest.prize.desc}`)

		if(quest.deleted === false) quest.status = 'completed'
		else quest = 'delete'

		user.saveQuest(player, questName, quest)
	}
	user.addQuest = (player, questName, line, desc, tasks, prize, owner, deleted = false) =>
	{
		try
		{
			if(!user.isLogged(player))return
			if(user.getQuest(player, questName))return

			const quests = container.get('user', player.id, 'quests')
			quests.push({
				name: questName,
				line: line,
				desc: desc,

				tasks: tasks,
				prize: prize,
				owner: owner,

				deleted: deleted,
				status: 'process'
			})

			container.set('user', player.id, 'quests', quests)
			user.save(player)

			chat.local(player, `Вы получили новый квест: ${questName}.`, '53df9d')
		}
		catch(e)
		{
			logger.error('user.addQuest', e)
		}
	}


	user.toggleActionText = (player, toggle, desc = 'для взаимодействия', keyName = -1) =>
	{
		if(keyName === -1) keyName = user.getKeyBind(player, 'action').name
		player.call('server::user:toggleActionText', [ toggle, keyName, desc ])
	}

	user.timer = () =>
	{
		mp.players.forEach(player =>
		{
			if(!user.isLogged(player))return

			const rentVehicle = container.get('user', player.id, 'rentVehicle')
			if(rentVehicle)
			{
				rentVehicle.timer --

				if(rentVehicle.timer === 1800) user.notify(player, 'У Вас осталось 30 минут на аренду транспорта', 'warning')
				else if(rentVehicle.timer === 600) user.notify(player, 'У Вас осталось 10 минут на аренду транспорта', 'warning')
				else if(rentVehicle.timer === 300) user.notify(player, 'У Вас осталось 5 минут на аренду транспорта', 'warning')
				else if(rentVehicle.timer === 60) user.notify(player, 'У Вас осталась 1 минута на аренду транспорта', 'warning')

				if(rentVehicle.timer <= 0)
				{
					user.notify(player, 'Аренда Вашего транспорт окончена', 'warning')
					mp.events.call('vehicles:destroy', player, rentVehicle.vehicle.id)

					container.set('user', player.id, 'rentVehicle', null)
				}
			}
		})
	}

	user.getJobActive = player =>
	{
		if(!user.isLogged(player))return false
		return container.get('user', player.id, 'jobActive')
	}
	user.setJobActive = (player, job) =>
	{
		if(!user.isLogged(player))return false

		switch(job)
		{
			case 'farm':
			{
				user.setClothes(player, 'job-farm', false)
				break
			}
			default:
			{
				user.destroyMarker(player)
				user.setClothes(player, container.get('user', player.id, 'clothes'), false, false)
				break
			}
		}

		container.set('user', player.id, 'jobActiveSalary', 0)
		return container.set('user', player.id, 'jobActive', job)
	}
	user.clearJobActive = player =>
	{
		if(!user.isLogged(player))return false
		if(!user.getJobActive(player))return false

		if(user.getJobActiveSalary(player) > 0)
		{
			user.giveCash(player, user.getJobActiveSalary(player))
			container.set('user', player.id, 'jobActiveSalary', 0)
		}
		return user.setJobActive(player, false)
	}
	user.getJobActiveSalary = player =>
	{
		if(!user.isLogged(player)
			|| !user.getJobActive(player))return false

		return parseFloat(container.get('user', player.id, 'jobActiveSalary'))
	}
	user.giveJobActiveSalary = (player, cash) =>
	{
		if(!user.isLogged(player)
			|| !user.getJobActive(player))return false

		return container.set('user', player.id, 'jobActiveSalary', parseFloat(container.get('user', player.id, 'jobActiveSalary')) + parseFloat(cash))
	}

	user.setMarker = (player, [ x, y, z ], dimension = -1, name = '') =>
	{
		if(dimension === -1) dimension = player.dimension
		player.call('server::user:setMarker', [ x, y, z, dimension, name ])
	}
	user.destroyMarker = player =>
	{
		player.call('server::user:destroyMarker')
	}
	user.setRaceMarker = (player, [ x, y, z ], dimension = -1, name = '') =>
	{
		if(dimension === -1) dimension = player.dimension
		player.call('server::user:setRaceMarker', [ x, y, z, dimension, name ])
	}


	user.addOpened = (player, name, openedFuncClosed = null) =>
	{
		if(!user.isLogged(player))return

		const opened = container.get('user', player.id, 'opened')
		opened[name] = openedFuncClosed

		return container.set('user', player.id, 'opened', opened)
	}
	user.removeOpened = (player, name) =>
	{
		if(!user.isLogged(player))return

		const opened = container.get('user', player.id, 'opened')
		if(opened[name] === undefined)return

		if(opened[name] !== null) opened[name](player)
		delete opened[name]

		return container.set('user', player.id, 'opened', opened)
	}
	user.isOpened = (player, name) =>
	{
		if(!user.isLogged(player))return false

		const opened = container.get('user', player.id, 'opened')
		if(typeof opened[name] === undefined)return false

		return true
	}

	user.getGender = player =>
	{
		if(!user.isLogged(player))return 0
		return container.get('user', player.id, 'gender')
	}

	user.savePosition = player =>
	{
		if(!user.isLogged(player))return
		return container.set('user', player.id, 'position', {
			x: player.position.x,
			y: player.position.y,
			z: player.position.z,
			a: player.heading,
			vw: player.dimension
		})
	}

	// [
	// 	{
	// 		name: 'Первые деньги',
	// 		line: 'Начало',
	// 		desc: 'Всем нужны деньги, поэтому давай работать',
	// 		tasks: [
	// 			{
	// 				name: 'Заработать $ 5.000',
	//
	// 				maxProgress: 5000.0,
	// 				progress: 2500.0
	// 			}
	// 		],
	// 		prize: {
	// 			desc: '$ 5.000.00',
	// 			data:
	// 			{
	// 				cash: 5000
	// 			}
	// 		},
	// 		owner: {
	// 			type: 'NPC',
	// 			name: 'Майлка',
	// 			position: [ x, y, z ]
	// 		},
	//
	// 		status: 'process',
	// 		deleted: false
	// 	}
	// ]

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
