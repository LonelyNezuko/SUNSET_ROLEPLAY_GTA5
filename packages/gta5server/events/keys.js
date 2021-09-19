const logger = require('../modules/logger')
try
{
    const container = require('../modules/container')
    const func = require('../modules/func')

    const vehicles = require('../property/vehicles')
    const houses = require('../property/houses')

    const user = require('../user')

    mp.events.add('client::enterKey', (player, key) =>
    {
        if(!user.isLogged(player))return

        const keyBinds = container.get('user', player.id, 'keyBinds')
        switch(key)
        {
            case keyBinds.toggleVehicleEngine.key:
            {
                if(!player.vehicle)return

                if(!vehicles.isRights(player.vehicle.id, player))return user.notify(player, 'У Вас нет ключей от данного транспорта', 'error')
                vehicles.setEngine(player.vehicle.id, !vehicles.getEngine(player.vehicle.id))

                break
            }
            case keyBinds.toggleVehicleLocked.key:
            {
                if(!player.vehicle)
                {
                    mp.vehicles.forEach(veh =>
                    {
                        if(func.distance2D(player.position, veh.position) < 2.0)
                        {
                            if(!vehicles.isRights(veh.id, player))return user.notify(player, 'У Вас нет ключей от данного транспорта', 'error')
                            vehicles.setLocked(veh.id, !vehicles.getLocked(veh.id), player)
                        }
                    })
                    return
                }

                if(!vehicles.isRights(player.vehicle.id, player))return user.notify(player, 'У Вас нет ключей от данного транспорта', 'error')
                vehicles.setLocked(player.vehicle.id, !vehicles.getLocked(player.vehicle.id))

                break
            }
            case keyBinds.toggleVehicleBelt.key:
            {
                player.call('server::vehicles:belt')
                break
            }

            case keyBinds.action.key:
            {
                houses.action(player)
                break
            }
        }
    })
}
catch(e)
{
    logger.error('events/keys.js', e)
}
