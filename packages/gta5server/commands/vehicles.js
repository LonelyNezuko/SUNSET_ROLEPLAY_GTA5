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

                container.set('vehicles', veh.id, 'position', {
                    x: veh.position.x,
                    y: veh.position.y,
                    z: veh.position.z
                })
                container.set('vehicles', veh.id, 'heading', veh.heading)

                vehicles.save(veh.id)
                user.notify(player, 'Вы успешно припарковали транспорт здесь', 'warning')
            }
        }
    })
}
catch(e)
{
    logger.error('commands/vehicles.js', e)
}
