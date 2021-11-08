const logger = require('../modules/logger')
try
{
    const fs = require('fs')

    const [ commandsAdd ] = require('./_commandsAdd')

    const user = require('../user')
    const chat = require('../chat')

    const enums = require('../modules/enums')
    const func = require('../modules/func')
    const container = require('../modules/container')
    const modal = require('../modules/modal')

    const vehicles = require('../property/vehicles')
    const houses = require('../property/houses')

    commandsAdd({
        'gettrailer': {
            func: player =>
            {
                logger.log('', player.vehicle.trailer, player.vehicle.traileredBy)
            }
        },
        'playanim': {
            settings: {
                admin: 5
            },
            func: (player, str, [ dict, name, speed, flag ]) =>
            {
                if(!dict || !name || !speed || !flag
                    || !dict.length || !name.length)return user.notify(player, '/playanim [dict] [name] [speed] [flag]', 'error')

                speed = parseInt(speed)
                flag = parseInt(flag)

                if(speed < 1 || flag < 0)return user.notify(player, 'speed (min 0), flag (min 0)', 'error')

                player.playAnimation(dict, name, speed, flag)
                user.notify(player, 'Play animation', 'spec')
            }
        },
        'getquests': {
            func: player =>
            {
                chat.local(player, 'Мои квесты:', {
                    timestamp: false
                })

                container.get('user', player.id, 'quests').forEach(quest =>
                {
                    chat.local(player, ' ', {
                        timestamp: false
                    })

                    chat.local(player, quest.name, {
                        timestamp: false
                    })
                    chat.local(player, `Награда: ${quest.prize.desc}`, {
                        timestamp: false
                    })
                    chat.local(player, 'Задания:', {
                        timestamp: false
                    })
                    chat.local(player, ' ', {
                        timestamp: false
                    })
                    quest.tasks.forEach(task =>
                    {
                        chat.local(player, `${task.name} (Прогрес: ${task.progress} / ${task.maxProgress})`, {
                            timestamp: false,
                            style: {
                                color: '#5db3f0'
                            }
                        })
                    })
                    chat.local(player, ' ', {
                        timestamp: false
                    })
                    chat.local(player, `Статус: ${enums.questStatusName[quest.status]}`, {
                        timestamp: false
                    })
                })
            }
        },

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
                func.savePosition([ player.position.x, player.position.y, player.position.z, player.heading ], name, (status, error) =>
                {
                    if(!status) user.notify(player, `Save Position Error: ${error}`);
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

                user.updateQuest(player, 'Тестовый квест', 0, cash)
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
        },

        'buyhouse': {
            func: player =>
            {
                const id = houses.nearPlayer(player)
                if(id === -1)return user.notify(player, 'Вы должны находиться возле дома/квартиры', 'error')

                if(houses.getOwner(id).id !== 0)return user.notify(player, 'Данное имущество уже куплено', 'error')
                if(user.getCash(player) < container.get('houses', id, 'price'))return user.notify(player, `У Вас не хватает ${func.formatCash(container.get('houses', id, 'price') - user.getCash(player))}`, 'error')

                houses.buy(id, player)

                user.notify(player, `Поздравляем с приобретением ${enums.housesType[houses.getType(id)]} ${enums.housesClass[houses.getClass(id)]} класса за ${func.formatCash(container.get('houses', id, 'price'))}`)
                user.giveCash(player, -container.get('houses', id, 'price'))
            }
        }
    })
}
catch(e)
{
    logger.error('commands/dev.js', e)
}
