const logger = require('./logger')
try
{
    const menuList = {}

    menuList.toggle = (player, toggle) =>
    {
        player.call('server::menuList:toggle', [ toggle ])
    }
    menuList.reset = player =>
    {
        player.call('server::menuList:reset')
    }
    menuList.header = (player, title, desc) =>
    {
        player.call('server::menuList:header', [ title, desc ])
    }
    menuList.append = (player, type, id, title, data = {}) =>
    {
        player.call('server::menuList:append', [ type, id, title, data ])
    }

    menuList.enter = (player, callback) =>
    {
        
    }

    module.exports = menuList
}
catch(e)
{
    logger.error('menuList.js', e)
}
