const logger = require('../modules/logger')
try
{
    const fs = require('fs')

    const [ commandsAdd ] = require('./_commandsAdd')

    const user = require('../user')

    const enums = require('../modules/enums')

    const vehicles = require('../property/vehicles')

    commandsAdd({
        'setfuel': {
            settings: {
                admin: 5
            },
            func: (player, str, [ fuel ]) =>
            {
                if(!player.vehicle)return user.notify(player, 'Вы должны сидеть в транспорте', 'error')

                if(fuel === undefined)return user.notify(player, '/setfuel [fuel]', 'error')
                fuel = parseFloat(fuel)

                if(isNaN(fuel)
                    && fuel < 0 || fuel > enums.vehiclesData[vehicles.getModel(player.vehicle.id)].maxFuel)return user.notify(player, `Топливо 0 - ${enums.vehiclesData[vehicles.getName(player.vehicle.id)].maxFuel}`, 'error')

                vehicles.setFuel(player.vehicle.id, fuel)
                user.notify(player, `Вы успешно установили транспорту ${vehicles.getModel(player.vehicle.id)} [${player.vehicle.id}] топливо на ${fuel}`)
            }
        },
        'setenginehealth': {
            settings: {
                admin: 5
            },
            func: (player, str, [ health ]) =>
            {
                if(!player.vehicle)return user.notify(player, 'Вы должны сидеть в транспорте', 'error')

                if(health === undefined)return user.notify(player, '/setenginehealth [health]', 'error')
                setenginehealth = parseInt(health)

                if(health < 0 || health > 1000)return user.notify(player, 'Здоровье 0 - 1000')

                player.vehicle.engineHealth = health
                user.notify(player, `Вы успешно установили транспорту ${vehicles.getModel(player.vehicle.id)} [${player.vehicle.id}] здоровье двигателя на ${health}`)
            }
        },

        'savePos': {
            settings: {
                admin: 5
            },
            func: (player, name = '') =>
            {
                fs.appendFile('saved/positions.txt', `${player.position.x}, ${player.position.y}, ${player.position.z}, ${player.heading} // ${name}\r\n`, error => {
    		        if(error) user.notify(player, `Save Position Error: ${err.message}`);
    		        else user.notify(player, `Position saved. (${name})`);
    		    })
            }
        },
        'saveCamPos': {
            settings: {
                admin: 5
            },
            func: (player, name = '') =>
            {
                player.call('server::noclip:getCamCoords', [ name ])
            }
        },

        'tppos': {
            settings: {
                admin: 5
            },
            func: (player, str, [ x, y, z ]) =>
            {
                if(!x || !y || !z)return user.notify(player, '/tppos [x] [y] [z]', 'error')

    			x = x.replace(',', '')
    			y = y.replace(',', '')
    			z = z.replace(',', '')

    			user.setPos(player, x, y, z)
            }
        },
        'saveacc': {
            settings: {
                admin: 5
            },
            func: player =>
            {
                user.save(player)
                user.notify(player, 'Аккаунт сохранен', 'warning')
            }
        },
        'getint': {
            settings: {
                admin: 5
            },
            func: player =>
            {
                player.call('server::user:getint')
            }
        },
        'givecash': {
            settings: {
                admin: 5
            },
            func: (player, str, [ id, cash ]) =>
            {
                if(!str.length
    				|| id === undefined
    				|| cash === undefined)return user.notify(player, '/givecash [id] [cash]', 'error')

    			id = parseInt(id)
    			cash = parseFloat(cash)

    			const target = user.getPlayer(id)
    			if(!target)return user.notify(player, 'Игрок не найден или не авторизован', 'error')

    			user.giveCash(target, cash)
    			user.notify(player, `Вы изменили баланс ${user.getCharName(target)}: ${func.formatCash(user.getCash(target))}`)
            }
        },
        'setclothes': {
            settings: {
                admin: 5
            },
            func: (player, str, [ userid, name ]) =>
            {
                if(!str.length
    				|| userid === undefined
    				|| name === undefined)return user.notify(player, '/setclothes [id] [clothes name]', 'error')

    			userid = parseInt(userid)
    			if(!enums.clothes[name])return user.notify(player, `Одежды под названием ${name} не найдено!`, 'error')

    			const target = user.getPlayer(userid)
    			if(!target)return user.notify(player, 'Игрок не найден или не авторизован', 'error')

    			user.setClothes(target, name)
    			user.notify(player, `Вы успешно установили ${user.getCharName(target)} одежду ${name}`)
            }
        }
    })
}
catch(e)
{
    logger.error('commands/dev.js', e)
}
