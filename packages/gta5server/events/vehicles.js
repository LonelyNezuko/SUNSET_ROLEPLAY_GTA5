const logger = require('../modules/logger')
try
{
    const vehicles = require('../property/vehicles')

    const container = require('../modules/container')
    const func = require('../modules/func')

    const enums = require('../modules/enums')

    const user = require('../user')

    mp.events.add({
        'client::vehicles:engine': player =>
        {
            if(!player.vehicle)return

            if(!vehicles.isRights(player.vehicle.id, player))return user.notify(player, 'У Вас нет ключей от данного транспорта', 'error')
            vehicles.setEngine(player.vehicle.id, !vehicles.getEngine(player.vehicle.id))
        },
        'client::vehicles:locked': player =>
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
        },
        'client::vehicles:giveMileage': (player, data) =>
        {
            data = JSON.parse(data)

            vehicles.setMileage(data.vehicle.id, container.get('vehicles', data.vehicle.id, 'mileage') + data.mileage)
            vehicles.setFuel(data.vehicle.id, container.get('vehicles', data.vehicle.id, 'fuel') - ((enums.vehiclesData[vehicles.getModel(data.vehicle.id)].expensFuel / 100) * data.mileage))
        },

        'rentVehicle.vehicle.id': (player, vehid) =>
        {
            vehicles.destroy(vehid)
        }
    })
}
catch(e)
{
    logger.error('events/vehicles.js', e)
}
