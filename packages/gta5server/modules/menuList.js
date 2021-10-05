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
    menuList.append = (player, type, id = '', title = '', value = '', data = {}) =>
    {
        player.call('server::menuList:append', [ type, id, title, value, JSON.stringify(data) ])
    }

    menuList.trigger = (player, data) =>
    {
        data = JSON.parse(data)
        player.menuListTrigger(data.id, data.value, data.elems)
    }

    module.exports = menuList
}
catch(e)
{
    logger.error('menuList.js', e)
}
