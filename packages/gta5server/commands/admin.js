const logger = require('../modules/logger')
try
{
    const [ commandsAdd ] = require('./_commandsAdd')

    const user = require('../user')
    const enums = require('../modules/enums')

    const container = require('../modules/container')

    const vehicles = require('../property/vehicles')

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
                    heading: player.heading
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

                user.notify(player, 'Транспорт удале', 'warning')
            }
        },

        'createvehicle': {
            settings: {
                admin: enums.commandsAdmin.createvehicle
            },
            func: (player, str, [ model, type, typeID ]) =>
            {
                if(!model
                    || !type
                    || typeID === undefined)return user.notify(player, '/createvehicle [model] [owner type] [owner id]', 'error')

                typeID = parseInt(typeID)
                if(typeID < 1)return user.notify(player, 'owner id не может быть меньше 1', 'error')

                let owner = {}
                owner[type] = typeID

                const veh = vehicles.create(model, [ player.position.x, player.position.y, player.position.z ], {
                    heading: player.heading,
                    owner: owner,
                    save: true
                })
                if(!veh)return user.notify(player, 'Не удалось создать транспорт', 'error')

                user.notify(player, 'Транспорт был успешно создан', 'warning')
            }
        },
        'deletevehicle': {
            settings: {
                admin: enums.commandsAdmin.deletevehicle,
                isInVehicle: true
            },
            func: (player) =>
            {
                const veh = player.vehicle

                vehicles.destroy(veh.id)
                user.notify(player, 'Транспорт был удален', 'warning')
            }
        }
    })
}
catch(e)
{
    logger.error('commands/admin.js', e)
}
