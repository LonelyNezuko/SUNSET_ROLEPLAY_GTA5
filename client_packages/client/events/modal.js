const logger = require('./client/modules/logger')
try
{
    const modal = require('./client/modules/modal')
    const user = require('./client/user')

    mp.events.add({
        'ui::modal:onEnter': data =>
        {
            data = JSON.parse(data)
            if(data.id === '_exit')return modal.toggle(false)

            mp.events.callRemote('client::modal:trigger', JSON.stringify(data))
        },

        'server::modal:reset': () =>
        {
            modal.reset()
        },
        'server::modal:append': (type, id, title, value, data) =>
        {
            modal.append(type, id, title, value, JSON.parse(data))
        },
        'server::modal:header': (title, desc) =>
        {
            modal.header(title, desc)
        },
        'server::modal:toggle': toggle =>
        {
            modal.toggle(toggle)
        }
    })
}
catch(e)
{
    logger.error('modules/modal.js', e)
}
