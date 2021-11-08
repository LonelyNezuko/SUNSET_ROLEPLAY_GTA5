const logger = require('../modules/logger')
try
{
    const mysql = require('../mysql')

    const container = require('../modules/container')
    const enums = require('../modules/enums')
    const func = require('../modules/func')

    const user = require('../user')

    const biz = {}

    biz.load = () =>
    {
        mysql.query('select * from business', [], (err, res) =>
        {
            if(err)return logger.error('biz.load', err)

            container.deleteAll('biz')
            res.forEach((row, i) =>
            {
                enums.bizVariables.forEach(item =>
                {
                    container.set('biz', i, item, func.isJSON(row[item]) ? JSON.parse(row[item]) : row[item])
                })

                container.set('biz', i, 'id', row.id)
                container.set('biz', i, 'state', true)

                biz.refresh(i)
            })

            logger.mysqlLog(`Бизнесов загружено: ${res.length}`)
        })
    }
    biz.refresh = id =>
    {
        if(!biz.isState(id))return

        if(container.get('biz', id, '_marker')) container.get('biz', id, '_marker').destroy()
        if(container.get('biz', id, '_label')) container.get('biz', id, '_label').destroy()
        if(container.get('biz', id, '_blip')) container.get('biz', id, '_blip').destroy()
        if(container.get('biz', id, '_colshape')) container.get('biz', id, '_colshape').destroy()

        container.set('biz', id, '_marker', mp.markers.new(32, new mp.Vector3(container.get('biz', id, 'position').x, container.get('biz', id, 'position').y, container.get('biz', id, 'position').z), 0.7, {
                color: biz.getOwner(id).id ? [44, 107, 153, 100] : [ 255, 255, 255, 100 ],
                dimension: container.get('biz', id, 'dimension')
            }))

        const labelText = `
            ${enums.bizType[biz.getType(id)]} #${biz.getID(id)}\n\n
            Владелец: ${biz.getOwner(id).id ? "~r~" : "~w~"}${biz.getOwner(id).name}\n
            Стоимость: ${func.formatCash(container.get('biz', id, 'price'))}${biz.getLocked(id) ? "\n\n~r~Закрыт" : ""}`
        container.set('biz', id, '_label', mp.labels.new(labelText, new mp.Vector3(container.get('biz', id, 'position').x, container.get('biz', id, 'position').y, container.get('biz', id, 'position').z), {
            font: 0,
            drawDistance: 4,
            dimension: container.get('biz', id, 'dimension')
        }))

        container.set('biz', id, '_blip', mp.blips.new(enums.bizDefaultSettings[biz.getType(id)].blipSprite, new mp.Vector3(container.get('biz', id, 'position').x, container.get('biz', id, 'position').y, container.get('biz', id, 'position').z), {
            name: enums.bizType[biz.getType(id)],
            color: biz.getOwner(id).id ? 0 : 11,
            shortRange: true,
            dimension: container.get('biz', id, 'dimension')
        }))
        container.set('biz', id, '_colshape', mp.colshapes.newCircle(container.get('biz', id, 'position').x, container.get('biz', id, 'position').y, 1, container.get('biz', id, 'dimension'))).setVariable('bizID', id)
    }

    biz.isState = id =>
    {
        return container.get('biz', id, 'state')
    }

    biz.create = (type, position, data = {}, callback) =>
    {
        if(type < 0 || type >= enums.bizType.length)return callback(false)

        mysql.query(`insert into business (type, owner, position, dimension, price) values (?, '{ "id": 0, "name": "Неимеется" }', ?, ?, ?)`, [
            type,
            JSON.stringify({
                x: position[0],
                y: position[1],
                z: position[2],
                a: position[3]
            }),
            !data.dimension ? 0 : data.dimension,
            !data.price ? enums.bizDefaultSettings[type].price : data.price
        ], (err, res) =>
        {
            if(err)
            {
                callback(false)
                return logger.error('biz.create', err)
            }

            mysql.query('select * from business where id = ?', [ res.insertId ], (err, res) =>
            {
                if(err)
                {
                    callback(false)
                    return logger.error('biz.create', err)
                }

                const id = container.free('biz')
                if(biz.isState(id))return callback(false)

                enums.bizVariables.forEach(item =>
                {
                    container.set('biz', id, item, func.isJSON(res[0][item]) ? JSON.parse(res[0][item]) : res[0][item])
                })

                container.set('biz', id, 'id', res[0]['id'])
                container.set('biz', id, 'state', true)

                biz.refresh(id)
                return callback(id)
            })
        })
    }
    biz.delete = id =>
    {
        if(!biz.isState(id))return

        if(container.get('biz', id, '_marker')) container.get('biz', id, '_marker').destroy()
        if(container.get('biz', id, '_label')) container.get('biz', id, '_label').destroy()
        if(container.get('biz', id, '_blip')) container.get('biz', id, '_blip').destroy()
        if(container.get('biz', id, '_colshape')) container.get('biz', id, '_colshape').destroy()

        mysql.query('delete from business where id = ?', [ biz.getID(id) ])
        container.delete('biz', id)
    }
    biz.save = id =>
    {
        if(!biz.isState(id))return

        mysql.query('update business set owner = ?, position = ?, locked = ?, price = ? where id = ?', [
            JSON.stringify(biz.getOwner(id)),
            JSON.stringify(container.get('biz', id, 'position')),
            container.get('biz', id, 'locked'),
            container.get('biz', id, 'price'),

            container.get('biz', id, 'id')
        ])
    }


    biz.getOwner = id =>
    {
        if(!biz.isState(id)
            || container.get('biz', id, 'owner').id === 0)return { id: 0, name: "Неимеется" }
        return container.get('biz', id, 'owner')
    }
    biz.getID = id =>
    {
        if(!biz.isState(id))return -1
        return container.get('biz', id, 'id')
    }
    biz.getServerID = bizID =>
    {
        const allBiz = container.all('biz')
        let id = -1

        for(var key in allBiz)
        {
            if(allBiz[key].id === bizID) id = parseInt(key)
        }
        return id
    }
    biz.getType = id =>
    {
        if(!biz.isState(id))return -1
        return container.get('biz', id, 'type')
    }
    biz.getLocked = id =>
    {
        if(!biz.isState(id))return -1
        return container.get('biz', id, 'locked')
    }

    biz.tp = (player, id) =>
    {
        if(!biz.isState(id)
            || !user.isLogged(player))return

        user.setPos(player,
            container.get('biz', id, 'position').x,
            container.get('biz', id, 'position').y,
            container.get('biz', id, 'position').z,
            container.get('biz', id, 'position').a,
            container.get('biz', id, 'dimension'))
    }


    biz.nearPlayer = (player, id = -1) =>
    {
        if(!user.isLogged(player))return -1

        if(id == -1) id = user.getNears(player).biz
        if(id === undefined)return -1

        if(!biz.isState(id))
        {
            if(user.getNears(player).biz === id) user.removeNear(player, 'biz')
            return -1
        }
        if(func.distance2D(player.position, new mp.Vector3(container.get('biz', id, 'position').x, container.get('biz', id, 'position').y, container.get('biz', id, 'position').z)) > 2.0
            || player.dimension !== container.get('biz', id, 'dimension'))
        {
            if(user.getNears(player).biz === id) user.removeNear(player, 'biz')
            return -1
        }

        return id
    }


    // Events
    biz.enterColshape = (player, shape) =>
    {
        const id = shape.getVariable('bizID')
        if(!biz.isState(id))return

        logger.log('', id, biz.nearPlayer(player, id))
        if(biz.nearPlayer(player, id) === id) user.setNear(player, 'biz', id)
        else
        {
            user.removeNear(player, 'biz')
            return
        }

        user.toggleActionText(player, true)
    }
    biz.exitColshape = (player, shape) =>
    {
        const id = shape.getVariable('bizID')
        if(!biz.isState(id))return

        user.removeNear(player, 'biz')
        user.toggleActionText(player, false)
    }

    module.exports = biz
}
catch(e)
{
    logger.error('property/biz.js', e)
}
