const logger = require('../modules/logger')

try
{
    require('./join')
    require('./logger')
    require('./user')
    require('./chat')
    require('./vehicles')
    require('./keys')
    // require('./menuList')

    const user = require('../user')
    const container = require('../modules/container')

    const vehicles = require('../property/vehicles')

    mp.events.add(
    {
        'playerDeath': (player, reason, killer) =>
        {
            player.health = 100
            user.spawn(player, true)
        },
        'playerQuit': (player, exitType, reason) =>
        {
            user.save(player)

            if(container.get('user', player.id, '/veh') !== null) vehicles.destroy(container.get('user', player.id, '/veh'))

            container.delete('user', player.id)
        },

        'playerEnterVehicle': vehicles.onEnter,
        'playerExitVehicle': vehicles.onExit
    })
}
catch(e)
{
    logger.error('events.js', e)
}
