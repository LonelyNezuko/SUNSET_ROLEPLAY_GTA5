const logger = require('../modules/logger')

try
{
    require('./join')
    require('./logger')
    require('./user')
    require('./chat')
    require('./vehicles')
    require('./keys')
    require('./modal')
    require('./ui')
    require('./npcDialog')

    const user = require('../user')
    const container = require('../modules/container')

    const vehicles = require('../property/vehicles')
    const houses = require('../property/houses')
    const biz = require('../property/biz')

    const npc = require('../modules/npc')

    const farm = require('../jobs/farm')

    mp.events.add(
    {
        'playerDeath': (player, reason, killer) =>
        {
            player.health = 100
            user.spawn(player, true)
        },
        'playerQuit': (player, exitType, reason) =>
        {
            user.savePosition(player)

            user.clearJobActive(player)
            user.save(player)

            if(container.get('user', player.id, '/veh') !== null) vehicles.destroy(container.get('user', player.id, '/veh'))
            if(container.get('user', player.id, 'rentVehicle') !== null) vehicles.destroy(container.get('user', player.id, 'rentVehicle').vehicle.id)

            container.delete('user', player.id)
        },

        'playerEnterVehicle': vehicles.onEnter,
        'playerExitVehicle': vehicles.onExit,

        'playerEnterColshape': (player, shape) =>
        {
            houses.enterColshape(player, shape)
            biz.enterColshape(player, shape)

            npc.enterColshape(player, shape)
            farm.enterColshape(player, shape)
        },
        'playerExitColshape': (player, shape) =>
        {
            houses.exitColshape(player, shape)
            biz.exitColshape(player, shape)

            npc.exitColshape(player, shape)
            farm.exitColshape(player, shape)
        }
    })
}
catch(e)
{
    logger.error('events.js', e)
}
