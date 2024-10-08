const logger = require('../modules/logger')
try
{
    const [ commandsAdd ] = require('./_commandsAdd')

    const user = require('../user')
    const enums = require('../modules/enums')

    const container = require('../modules/container')

    const vehicles = require('../property/vehicles')
    const houses = require('../property/houses')
    const biz = require('../property/biz')

    const admin = require('../admin')

    commandsAdd({
        'spawn': {
            settings: {
                admin: enums.commandsAdmin.spawn
            },
            func: (player, str, [ userid ]) =>
            {
                const target = user.getPlayer(userid) || player

                if(target !== player
                    && user.getAdmin(player) < enums.commandsAdmin.spawnPlayer)return user.notify(player, 'Не достаточный уровень админки!')

                user.spawn(target, true)
            }
        },

        'setadmin': {
            settings: {
                admin: enums.commandsAdmin.setadmin
            },
            func: (player, str, [ userid, level ]) =>
            {
                if(userid === undefined
                    || level === undefined)return user.notify(player, '/setadmin [userid] [level]', 'error')

                userid = parseInt(userid)
                level = parseInt(level)

                const target = user.getPlayer(userid)
                if(!target)return user.notify(player, 'Игрок не найден или не авторизован!', 'error')

                if(level < 0 || level > user.getAdmin(player))return user.notify(player, `Уровень админки 0 - ${user.getAdmin(player)}`, 'error')
                if(level === user.getAdmin(target))return user.notify(player, 'Игрок уже имеет данный уровень админки', 'error')

                user.setAdmin(target, level, user.getUserName(player))
                user.notify(player, `Вы успешно изменили уровень админки ${user.getUserName(target)} на ${level}.`)

                user.sendLog(target, `Был изменен уровень админки на ${level}. Изменил: PLAYER:${user.getID(player)}`, 1)
                user.sendLog(player, `Изменил уровень админки PLAYER:${user.getID(target)} на ${level}`, 1)
            }
        },

        'veh': {
            settings: {
                admin: enums.commandsAdmin.veh
            },
            func: (player, str, [ model ]) =>
            {
                if(!model || model.length < 1)return user.notify(player, '/veh [model name]', 'error')
                if(container.get('user', player.id, '/veh') !== null)
                {
                    vehicles.destroy(container.get('user', player.id, '/veh'))
                    container.set('user', player.id, '/veh', null)
                }

                const veh = vehicles.create(model, [ player.position.x, player.position.y, player.position.z ], {
                    number: 'ADMIN',
                    heading: player.heading,
                    dimension: player.dimension
                })
                if(!veh)return user.notify(player, 'Не удалось создать транспорт', 'error')

                container.set('user', player.id, '/veh', veh.id)

                player.putIntoVehicle(veh, 0)
                user.notify(player, 'Чтобы удалить транспорт используйте /delveh', 'warning')
            }
        },
        'delveh': {
            settings: {
                admin: enums.commandsAdmin.veh
            },
            func: player =>
            {
                if(container.get('user', player.id, '/veh') === null)return user.notify(player, 'Вы не создавали транспорт', 'error')

                vehicles.destroy(container.get('user', player.id, '/veh'))
                container.set('user', player.id, '/veh', null)

                user.notify(player, 'Транспорт удален', 'warning')
            }
        },

        'tphouse': {
            settings: {
                admin: enums.commandsAdmin.tphouse
            },
            func: (player, str, [ houseID ]) =>
            {
                if(houseID === undefined)return user.notify(player, '/tphouse [house id]', 'error')
                houseID = parseInt(houseID)

                const id = houses.getServerID(houseID)
                if(id === -1)return user.notify(player, `Дом с #${houseID} не найден`, 'error')

                houses.tp(player, id)
            }
        },
        'tphouseint': {
            settings: {
                admin: enums.commandsAdmin.tphouseint
            },
            func: (player, str, [ houseID ]) =>
            {
                if(houseID === undefined)return user.notify(player, '/tphouseint [house id]', 'error')
                houseID = parseInt(houseID)

                const id = houses.getServerID(houseID)
                if(id === -1)return user.notify(player, `Дом/Квартира с #${houseID} не найден`, 'error')

                if(container.get('houses', id, 'interior').x === 0
                    && container.get('houses', id, 'interior').y === 0
                    && container.get('houses', id, 'interior').z === 0)return user.notify(player, 'У дома/квартиры нет интерьера', 'error')

                houses.tpInterior(player, id, true)
            }
        },
    })
}
catch(e)
{
    logger.error('commands/admin.js', e)
}
