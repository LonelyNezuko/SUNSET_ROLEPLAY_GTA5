const logger = require('./client/modules/logger')
try
{
    const menuList = require('./client/modules/menuList')
    const user = require('./client/user')

    mp.events.add({
        'ui::menuList:trigger': data =>
        {
            data = JSON.parse(data)
            menuList.trigger(data)
        },
        'ui::menuList:close': () =>
        {
            user.cursor(false, true)
        },

        'server::menuList:reset': () =>
        {
            menuList.reset()
        },
        'server::menuList:append': (type, id, title, value, data) =>
        {
            menuList.append(type, id, title, value, JSON.parse(data))
        },
        'server::menuList:header': (title, desc) =>
        {
            menuList.header(title, desc)
        },
        'server::menuList:toggle': toggle =>
        {
            menuList.toggle(toggle)
        }
    })
}
catch(e)
{
    logger.error('modules/menuList.js', e)
}
