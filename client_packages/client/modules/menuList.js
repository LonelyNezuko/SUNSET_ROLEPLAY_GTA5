const logger = require('./client/modules/logger')
try
{
    const ui = require('./client/ui/index')
    const user = require('./client/user')

    const menuList = {}

    menuList.reset = () =>
    {
        ui.call('UI::menuList', {
            cmd: 'reset'
        })
    }
    menuList.append = (type, id, title, value, data = {}) =>
    {
        ui.call('UI::menuList', {
            cmd: 'append',
            data: {
                type: type,
                id: id,
                title: title,
                value: value,
                data: data
            }
        })
    }
    menuList.header = (title, desc = '') =>
    {
        ui.call('UI::menuList', {
            cmd: 'header',
            data: {
                title: title,
                desc: desc
            }
        })
    }
    menuList.toggle = toggle =>
    {
        ui.call('UI::menuList', {
            cmd: 'toggle',
            data: toggle
        })

        user.cursor(false, false)
    }

    menuList.trigger = data =>
    {
        mp.events.callRemote('client::menuList:trigger', JSON.stringify(data))
    }

    exports = menuList
}
catch(e)
{
    logger.error('modules/menuList.js', e)
}
