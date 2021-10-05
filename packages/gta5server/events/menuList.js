const logger = require('./logger')
try
{
    const menuList = require('../modules/menuList')
    mp.events.add({
        'client::menuList:trigger': (player, data) =>
        {
            menuList.trigger(player, data)
        }
    })
}
catch(e)
{
    logger.error('events/menuList.js', e)
}
