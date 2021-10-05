const logger = require('../modules/logger')
try
{
    const [ commandsAdd ] = require('./_commandsAdd')

    const container = require('../modules/container')

    const user = require('../user')

    const vehicles = require('../property/vehicles')

    commandsAdd({
        'park': {
            settings: {
                isInVehicle: true,
                vehiclesRights: true
            },
            func: player =>
            {
                const veh = player.vehicle
                if(vehicles.getOwner(veh.id).rent)return user.notify(player, 'Данный транспорт нельзя припарковать', 'error')

                container.set('vehicles', veh.id, 'position', {
                    x: veh.position.x,
                    y: veh.position.y,
                    z: veh.position.z
                })
                container.set('vehicles', veh.id, 'heading', veh.heading)
                container.set('vehicles', veh.id, 'dimension', veh.dimension)

                vehicles.save(veh.id)
                user.notify(player, 'Вы успешно припарковали транспорт здесь', 'warning')
            }
        },
        'unrent': {
            func: player =>
            {
                const veh = container.get('user', player.id, 'rentVehicle')
                if(!veh)return user.notify(player, 'Вы не арендуете транспорт', 'error')

                vehicles.destroy(veh.vehicle.id)
                container.set('user', player.id, 'rentVehicle', null)

                user.notify(player, 'Вы успешно отказались от аренды транспорта', 'error')
            }
        }
    })
}
catch(e)
{
    logger.error('commands/vehicles.js', e)
}
