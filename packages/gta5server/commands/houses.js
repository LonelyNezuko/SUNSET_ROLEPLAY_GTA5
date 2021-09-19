const logger = require('../modules/logger')
try
{
    const [ commandsAdd ] = require('./_commandsAdd')

    const container = require('../modules/container')
    const enums = require('../modules/enums')
    const func = require('../modules/func')

    const user = require('../user')

    const houses = require('../property/houses')

    commandsAdd({
        'lockhouse': {
            func: player =>
            {
                let id = houses.nearPlayerInterior(player)
                if(id === -1) id = houses.nearPlayer(player)

                if(id === -1)return user.notify(player, 'Вы должны находится внутри дома/квартиры или снаружи', 'error')
                if(houses.getOwner(id).id !== user.getID(player))return user.notify(player, 'Вы не владеете данным имуществом', 'error')

                container.set('houses', id, 'locked', !container.get('houses', id, 'locked'))

                houses.refresh(id)
                houses.save(id)

                user.notify(player, `Вы успешно ${houses.getLocked(id) ? "закрыли" : "открыли"} ${enums.housesType[houses.getType(id)]}`, 'warning')
            }
        },
        'sellhouse': {
            func: player =>
            {
                const id = houses.nearPlayerInterior(player)
                if(id === -1)return user.notify(player, 'Вы должны находится внутри дома', 'error')

                if(houses.getOwner(id).id !== user.getID(player))return user.notify(player, 'Вы не владеете данным имуществом', 'error')

                houses.sell(id)

                user.notify(player, `Вы успешно продали дом и получили 50% от его стоимости: ${func.formatCash(container.get('houses', id, 'price') / 2)}`)
                user.giveCash(player, container.get('houses', id, 'price') / 2)

                houses.tp(player, id)
            }
        }
    })
}
catch(e)
{
    logger.error('commands/vehicles.js', e)
}
