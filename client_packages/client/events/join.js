const logger = require('./client/modules/logger')

try
{
    const ui = require('./client/ui/index')
    const user = require('./client/user')

    mp.events.add({

        'ui::join': data =>
        {
            mp.events.callRemote('client::join', data)
        },
        'server::join:result': data =>
        {
            ui.call(`client::join:result:${data.type}`, data.message)
        },

        'ui::join:createAccount': data =>
        {
            mp.events.callRemote('client::join:createAccount', data)
        },
        'server::join:hide': remember =>
        {
            ui.call('UI::join', {
                cmd: 'toggle',
                data: false
            })
            user.cursor(false, true)

            mp.players.local.freezePosition(false)
            user.destroyCamera()

            if(remember) mp.storage.data.authRemember = remember
            else
            {
                if(mp.storage.data.authRemember !== undefined) delete mp.storage.data.authRemember
            }
            mp.storage.flush()
        }
    })
}
catch(e)
{
    logger.error('events/join.js', e)
}
