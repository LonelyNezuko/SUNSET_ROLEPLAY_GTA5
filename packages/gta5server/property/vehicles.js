const logger = require('../modules/logger')
try
{
    const container = require('../modules/container')
    const enums = require('../modules/enums')

    const user = require('../user')

    const mysql = require('../mysql')

    const vehicles = {}

    vehicles.load = () =>
    {
        mysql.query('select * from vehicles', [], (err, res) =>
        {
            if(err)return logger.error('vehicles.load', err)

            let veh
            res.forEach(item =>
            {
                veh = vehicles.create(item.model, [ JSON.parse(item.position).x, JSON.parse(item.position).y, JSON.parse(item.position).z ], {
                    number: item.number,
                    color: JSON.parse(item.color),
                    locked: item.locked,
                    heading: item.heading,
                    mileage: item.mileage,
                    fuel: item.fuel,
                    owner: JSON.parse(item.owner)
                })

                if(veh)
                {
                    container.set('vehicles', veh.id, 'id', item.id)
                    container.set('vehicles', veh.id, 'save', true)
                }
            })
        })
    }
    vehicles.create = (model, position, data = {}) =>
    {
        if(!enums.vehiclesData[model])return false

        const settingsVeh = {}

        settingsVeh.numberPlate = data.number || 'NONE'
        if(data.color === undefined) data.color = [[ 255, 255, 255 ], [ 255, 255, 255 ]]

        if(data.alpha) settingsVeh.alpha = data.alpha
        settingsVeh.locked = data.locked === undefined ? false : data.locked
        settingsVeh.engine = data.engine === undefined ? false : data.engine
        if(data.heading) settingsVeh.heading = data.heading

        const veh = mp.vehicles.new(mp.joaat(model), new mp.Vector3(position[0], position[1], position[2]), settingsVeh)
        container.delete('vehicles', veh.id)

        veh.setColorRGB(data.color[0][0], data.color[0][1], data.color[0][2], data.color[1][0], data.color[1][1], data.color[1][2])

        container.set('vehicles', veh.id, 'model', model)

        container.set('vehicles', veh.id, 'engine', settingsVeh.engine)
        container.set('vehicles', veh.id, 'locked', settingsVeh.locked)
        container.set('vehicles', veh.id, 'lights', 0)

        container.set('vehicles', veh.id, 'number', settingsVeh.numberPlate)
        container.set('vehicles', veh.id, 'color', data.color)

        container.set('vehicles', veh.id, 'mileage', data.mileage || 0.0)
        container.set('vehicles', veh.id, 'fuel', data.fuel || enums.vehiclesData[model].maxFuel)

        container.set('vehicles', veh.id, 'position', {
            x: position[0],
            y: position[1],
            z: position[2]
        })
        container.set('vehicles', veh.id, 'heading', data.heading || 0)

        container.set('vehicles', veh.id, 'owner', data.owner || {})
        container.set('vehicles', veh.id, 'save', data.save === undefined ? false : true)

        if(data.save === true)
        {
            mysql.query('insert into vehicles (model, position, heading, owner, locked, number, color, fuel) values (?, ?, ?, ?, ?, ?, ?, ?)', [
                model,
                JSON.stringify(container.get('vehicles', veh.id, 'position')),
                container.get('vehicles', veh.id, 'heading'),
                JSON.stringify(container.get('vehicles', veh.id, 'owner')),
                container.get('vehicles', veh.id, 'locked'),
                container.get('vehicles', veh.id, 'number'),
                JSON.stringify(container.get('vehicles', veh.id, 'color')),
                container.get('vehicles', veh.id, 'fuel')
            ], (err, res) =>
            {
                if(err)return logger.error('vehicles.create', err)
                container.set('vehicles', veh.id, 'id', res.insertId)
            })
        }

        return veh
    }
    vehicles.destroy = vehid =>
    {
        const veh = vehicles.getVehicle(vehid)
        if(!veh)return

        mp.vehicles.forEach(item =>
        {
            if(item.id === vehid) item.destroy()
        })

        if(container.get('vehicles', vehid, 'save')) mysql.query('delete from vehicles where id = ?', [ container.get('vehicles', vehid, 'id') ])
        container.delete('vehicles', vehid)
    }
    vehicles.save = vehid =>
    {
        const veh = vehicles.getVehicle(vehid)
        if(!veh)return

        if(!container.get('vehicles', veh.id, 'save'))return

        mysql.query('update vehicles set position = ?, heading = ?, owner = ?, locked = ?, number = ?, color = ?, mileage = ?, fuel = ? where id = ?', [
            JSON.stringify(container.get('vehicles', veh.id, 'position')),
            container.get('vehicles', veh.id, 'heading'),
            JSON.stringify(container.get('vehicles', veh.id, 'owner')),
            container.get('vehicles', veh.id, 'locked'),
            container.get('vehicles', veh.id, 'number'),
            JSON.stringify(container.get('vehicles', veh.id, 'color')),
            container.get('vehicles', veh.id, 'mileage'),
            container.get('vehicles', veh.id, 'fuel'),

            container.get('vehicles', veh.id, 'id')
        ])
    }

    vehicles.isRights = (vehid, player) =>
    {
        const veh = vehicles.getVehicle(vehid)
        if(!veh
            || !user.isLogged(player))return false

        if(container.get('vehicles', veh.id, 'owner').player
            && container.get('vehicles', veh.id, 'owner').player !== container.get('user', player.id, 'id'))return false

        return true
    }

    vehicles.getVehicle = vehid =>
    {
        let veh
        mp.vehicles.forEach(item =>
        {
            if(item.id === vehid) veh = item
        })
        return veh
    }

    vehicles.getEngine = vehid =>
    {
        if(!vehicles.getVehicle(vehid))return false
        return container.get('vehicles', vehid, 'engine')
    }
    vehicles.getLights = vehid =>
    {
        if(!vehicles.getVehicle(vehid))return false
        return container.get('vehicles', vehid, 'lights')
    }
    vehicles.getLocked = vehid =>
    {
        if(!vehicles.getVehicle(vehid))return false
        return container.get('vehicles', vehid, 'locked')
    }

    vehicles.getModel = vehid =>
    {
        if(!vehicles.getVehicle(vehid))return false
        return container.get('vehicles', vehid, 'model')
    }

    vehicles.setEngine = (vehid, status, error = false) =>
    {
        const veh = vehicles.getVehicle(vehid)
        if(!veh)return false

        let returns = 0

        if(container.get('vehicles', vehid, 'fuel') <= 0
            && status) returns = 1

        if(veh.engineHealth < 300
            && status) returns = 2

        if(!returns)
        {
            container.set('vehicles', vehid, 'engine', status)
            veh.engine = status
        }

        mp.players.forEach(pl =>
        {
            if(pl.vehicle === veh
                && pl.seat === 0)
            {
                if(returns === 1) user.notify(pl, 'В данном транспорте нет топлива. Вызовите механика для заправки', 'error')
                if(returns === 2) user.notify(pl, 'В данном транспорте сломан двигатель. Вызовите механика для его починки', 'error')

                if(error) user.notify(pl, 'В данном транспорте сломался двигатель. Вызовите механика для его починки', 'error')
                if(!returns) pl.call('server::user:engineSpeedometer', [ status ])
            }
        })
    }
    vehicles.setLocked = (vehid, status, player = null) =>
    {
        const veh = vehicles.getVehicle(vehid)
        if(!veh)return false

        container.set('vehicles', vehid, 'locked', status)
        veh.locked = status

        if(player !== null
            && user.isLogged(player)) user.notify(player, `Транспорт ${!status ? "открыт" : "закрыт"}`, 'warning')
        mp.players.forEach(pl =>
        {
            if(user.isLogged(pl)
                && pl.vehicle === veh
                && pl.seat === 0)
            {
                user.notify(pl, `Транспорт ${!status ? "открыт" : "закрыт"}`, 'warning')
                pl.call('server::user:lockedSpeedometer', [ status ])
            }
        })
    }
    vehicles.setMileage = (vehid, mileage) =>
    {
        const veh = vehicles.getVehicle(vehid)
        if(!veh)return false

        container.set('vehicles', vehid, 'mileage', mileage)

        mp.players.forEach(pl =>
        {
            if(pl.vehicle === veh
                && pl.seat === 0) pl.call('server::user:mileageSpeedometer', [ container.get('vehicles', vehid, 'mileage') ])
        })
    }
    vehicles.setFuel = (vehid, fuel) =>
    {
        const veh = vehicles.getVehicle(vehid)
        if(!veh)return false

        let error = false

        container.set('vehicles', vehid, 'fuel', fuel)
        if(container.get('vehicles', vehid, 'fuel') <= 0)
        {
            container.set('vehicles', vehid, 'fuel', 0.0)
            vehicles.setEngine(vehid, false)

            error = true
        }

        mp.players.forEach(pl =>
        {
            if(pl.vehicle === veh
                && pl.seat === 0)
            {
                pl.call('server::user:fuelSpeedometer', [ container.get('vehicles', vehid, 'fuel') ])
                if(error) user.notify(pl, 'В данном транспорте закончилось топливо. Вызовите механика для заправки', 'error')
            }
        })
    }


    // Events
    vehicles.onEnter = (player, vehicle, seat) =>
    {
        const veh = vehicles.getVehicle(vehicle.id)
        if(!veh)return vehicle.destroy()

        if(vehicles.getLocked(vehicle.id) === true) player.removeFromVehicle()
        if(seat === 0)
        {
            vehicle.engine = vehicles.getEngine(vehicle.id)
            player.call('server::user:toggleSpeedometer', [ true, {
                engine: vehicles.getEngine(vehicle.id),
                mileage: container.get('vehicles', vehicle.id, 'mileage'),
                fuel: container.get('vehicles', vehicle.id, 'fuel'),
                lights: vehicles.getLights(vehicle.id),
                locked: vehicles.getLocked(vehicle.id)
            } ])
        }
    }
    vehicles.onExit = (player, vehicle) =>
    {
        player.call('server::user:toggleSpeedometer', [ false ])
    }

    vehicles.timer = () =>
    {
        mp.vehicles.forEach(veh =>
        {
            if(!vehicles.getVehicle(veh.id))return veh.destroy()
            if(veh.engineHealth < 300) vehicles.setEngine(veh.id, false, true)
        })
    }

    module.exports = vehicles
}
catch(e)
{
    logger.error('property/vehicles.js', e)
}
