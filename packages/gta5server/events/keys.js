const logger = require('../modules/logger')
try
{
    const container = require('../modules/container')
    const func = require('../modules/func')
    const enums = require('../modules/enums')

    const vehicles = require('../property/vehicles')
    const houses = require('../property/houses')

    const user = require('../user')
    const admin = require('../admin')

    const npc = require('../modules/npc')

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
                if(!player.vehicle)return
                logger.log('', enums.vehiclesData[vehicles.getModel(player.vehicle.id)].type)
                if(enums.vehiclesData[vehicles.getModel(player.vehicle.id)].type === 'boat'
                    || enums.vehiclesData[vehicles.getModel(player.vehicle.id)].type === 'cycles'
                    || enums.vehiclesData[vehicles.getModel(player.vehicle.id)].type === 'helicopter'
                    || enums.vehiclesData[vehicles.getModel(player.vehicle.id)].type === 'motorcycles'
                    || enums.vehiclesData[vehicles.getModel(player.vehicle.id)].type === 'planes'
                    || enums.vehiclesData[vehicles.getModel(player.vehicle.id)].type === 'trailer'
                    || enums.vehiclesData[vehicles.getModel(player.vehicle.id)].type === 'trains')return

                player.call('server::vehicles:belt')
                break
            }

            case keyBinds.action.key:
            {
                houses.action(player)

                npc.action(player)
                break
            }

            case keyBinds.fastAdminMenu.key:
            {
                admin.fastAdminMenu(player)
                break
            }
        }
    })
}
catch(e)
{
    logger.error('events/keys.js', e)
}
