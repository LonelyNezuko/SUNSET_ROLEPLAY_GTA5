const logger = require('../modules/logger')
try
{
    const mysql = require('../mysql')

    const enums = require('../modules/enums')
    const container = require('../modules/container')
    const func = require('../modules/func')

    const houses = {}

    houses.load = () =>
    {
        mysql.query('select * from houses', [], (err, res) =>
        {
            if(err)return logger.error('houses.load', err)

            container.deleteAll('houses')
            res.forEach((elem, i) =>
            {
                enums.housesVariables.forEach(item =>
                {
                    container.set('houses', i, item, func.isJSON(elem[item]) ? JSON.parse(elem[item]) : elem[item])
                })

                container.set('houses', i, 'id', elem.id)
                container.set('houses', i, 'state', true)

                houses.refresh(i)
            })
        })
    }

    houses.refresh = id =>
    {
        if(!houses.isState(id))return

        if(container.get('houses', id, '_marker')) container.get('houses', id, '_marker').destroy()
        if(container.get('houses', id, '_colshape')) container.get('houses', id, '_colshape').destroy()
        if(container.get('houses', id, '_label')) container.get('houses', id, '_label').destroy()
        if(container.get('houses', id, '_blip'))
        {
            container.get('houses', id, '_blip').destroy()
            container.clear('houses', id, '_blip')
        }

        container.set('houses', id, '_marker', mp.markers.new(1, new mp.Vector3(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, container.get('houses', id, 'position').z), 2, {
                color: houses.getOwner(id).id ? [ 255, 123, 123, 100 ] : [ 255, 255, 255, 100 ],
                dimension: container.get('houses', id, 'dimension')
            }))
        container.set('houses', id, '_colshape', mp.colshapes.newCircle(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, 2, container.get('houses', id, 'dimension'))).setVariable({
                house: id
            })

        const labelText = `
            ${enums.housesType[houses.getType(id)]} #${container.get('houses', id, 'id')}\n
            ${enums.housesClass[houses.getClass(id)]} класса\n\
            Владелец: ${houses.getOwner(id).name}\n
            Стоимость: ${func.formatCash(container.get('houses', id, 'price'))}`
        container.set('houses', id, '_label', mp.labels.new(labelText, new mp.Vector3(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, container.get('houses', id, 'position').z + 1.5), {
                font: 2,
                drawDistance: 7,
                dimension: container.get('houses', id, 'dimension')
            }))

        if(!houses.getOwner(id).id
            && houses.getType(id) === 0
            && container.get('houses', id, 'dimension') === 0) container.set('houses', id, '_blip', mp.blips.new(40, new mp.Vector3(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, container.get('houses', id, 'position').z), {
                name: "Дом на продаже",
                color: 35
            }))
    }

    houses.isState = id =>
    {
        return container.get('houses', id, 'state')
    }


    houses.getOwner = id =>
    {
        if(!houses.isState(id)
            || container.get('houses', id, 'owner').id < 1)return { id: 0, name: 'Неимеется' }
        return container.get('houses', id, 'owner')
    }
    houses.getType = id =>
    {
        if(!houses.isState(id))return 'none'
        return container.get('houses', id, 'type')
    }
    houses.getClass = id =>
    {
        if(!houses.isState(id))return 'none'
        return container.get('houses', id, 'class')
    }

    houses.create = (type, classes, position, data = {}, callback) =>
    {
        if(type < 0 || type >= enums.housesType.length
            || classes < 0 || classes >= enums.housesClass.length)return callback = status => status = false

        const randomInterior = func.random(0, enums.housesDefaultSettings[type][classes].interiors.length)
        if(randomInterior >= enums.housesDefaultSettings[type][classes].interiors.length) randomInterior = enums.housesDefaultSettings[type][classes].interiors.length - 1

        logger.log('houses.create', enums.housesDefaultSettings[type][classes].interiors[randomInterior][0], randomInterior)
        mysql.query(`insert into houses (type, class, position, interior, price, owner) values (?, ?, ?, ?, ?, '{ "id": 0, "name": "Неимеется" }')`, [
            type,
            classes,
            JSON.stringify({
                x: position[0],
                y: position[1],
                z: position[2],
                a: position[3]
            }),
            JSON.stringify({
                x: enums.housesDefaultSettings[type][classes].interiors[randomInterior][0],
                y: enums.housesDefaultSettings[type][classes].interiors[randomInterior][1],
                z: enums.housesDefaultSettings[type][classes].interiors[randomInterior][2],
                a: enums.housesDefaultSettings[type][classes].interiors[randomInterior][3]
            }),
            !data.price ? enums.housesDefaultSettings[type][classes].price : data.price
        ], (err, res) =>
        {
            if(err)return logger.error('houses.create', err)

            mysql.query('select * from houses where id = ?', [ res.insertId ], (err, res) =>
            {
                if(err)return logger.error('houses.create', err)

                const id = container.free('houses')
                if(houses.isState(id))return callback = status => status = false

                res.forEach((elem, i) =>
                {
                    enums.housesVariables.forEach(item =>
                    {
                        container.set('houses', id, item, func.isJSON(elem[item]) ? JSON.parse(elem[item]) : elem[item])
                    })

                    container.set('houses', id, 'id', elem.id)
                    container.set('houses', id, 'state', true)

                    houses.refresh(id)
                    return callback = status => status = id
                })
            })
        })
        return false
    }
    houses.delete = id =>
    {
        if(!houses.isState(id))return

        if(container.get('houses', id, '_marker')) container.get('houses', id, '_marker').destroy()
        if(container.get('houses', id, '_colshape')) container.get('houses', id, '_colshape').destroy()
        if(container.get('houses', id, '_label')) container.get('houses', id, '_label').destroy()
        if(container.get('houses', id, '_blip')) container.get('houses', id, '_blip').destroy()

        mysql.query('delete from houses where id = ?', [ container.get('houses', id, 'id') ])
        container.delete('houses', id)
    }

    houses.nearPlayer = player =>
    {
        const nears = container.get('user', id, 'nears')
        if(nears.house === undefined)return -1

        if(!houses.isState(nears.house))
        {
            delete nears.house
            container.set('user', id, 'nears', nears)

            return -1
        }
        if(!func.distance2D(player.position, new mp.Vector3(container.get('houses', near.house, 'position').x, container.get('houses', near.house, 'position').y, container.get('houses', near.house, 'position').z)) < 2.0)
        {
            delete nears.house
            container.set('user', id, 'nears', nears)

            return -1
        }

        return near.house
    }

    module.exports = houses
}
catch(e)
{
    logger.error('property/houses.js', e)
}
