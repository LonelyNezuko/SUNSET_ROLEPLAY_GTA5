const logger = require('../modules/logger')

try
{
	const fs = require('fs')

	const user = require('../user')
	const chat = require('../chat')

	const container = require('../modules/container')
	const func = require('../modules/func')

	mp.events.add({
		'client::goCommand': (player, command, args) =>
		{
			if(!mp.events.getAllOf(`command::${command}`).length)return user.notify(player, 'Данная команда не найден', 'error')
			mp.events.call(`command::${command}`, player, args, args.split(' '))
		},

		'command::savepos': (player, name = '') =>
		{
			fs.appendFile('saved/positions.txt', `${player.position.x}, ${player.position.y}, ${player.position.z}, ${player.heading} // ${name}\r\n`, (error) => {
		        if(error) user.notify(player, `Save Position Error: ${err.message}`);
		        else user.notify(player, `Position saved. (${name})`);
		    })
		},
		'command::tppos': (player, position, [ x, y, z ]) =>
		{
			logger.debug('command::tppos', x, y, z, position)
			if(!x || !y || !z)return user.notify(player, 'Введи координаты!', 'error')

			x = x.replace(',', '')
			y = y.replace(',', '')
			z = z.replace(',', '')

			user.setPos(player, x, y, z)
		},
		'command::saveAcc': player =>
		{
			user.save(player)
			user.notify(player, 'Account saved')
		},
		'command::spawn': player =>
		{
			user.spawn(player)
		},

		'command::getint': player =>
		{
			player.call('server::user:getint')
		},

		'command::givecash': (player, str, [ id, cash ]) =>
		{
			logger.log('', str, id, cash)

			if(!str.length
				|| id === undefined
				|| cash === undefined)return user.notify(player, '/givecash [id] [cash]', 'error')

			id = parseInt(id)
			cash = parseFloat(cash)

			const target = user.getPlayer(id)
			if(!target)return user.notify(player, 'Игрок не найден или не авторизован', 'error')

			user.giveCash(target, cash)
			user.notify(player, `Вы изменили баланс ${container.get('user', target.id, 'charname')}: ${func.formatCash(user.getCash(target))}`)
		}
	})
}
catch(e)
{
	logger.error('commands.js', e)
}
