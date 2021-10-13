const logger = require('./client/modules/logger')

try
{
    const ui = require('./client/ui/index')
    const user = require('./client/user')

    mp.events.add({

        'ui::auth:tryLogin': data =>
        {
            data = JSON.parse(data)

            data.username = data.login
            data.type = 'auth'

            mp.events.callRemote('client::join', JSON.stringify(data))
        },
        'ui::auth:tryReg': data =>
        {
            data = JSON.parse(data)

            data.username = data.login
            data.type = 'reg'

            mp.events.callRemote('client::join', JSON.stringify(data))
        },

        'server::join:result': data =>
        {
            if(data.type === 'reg'
                && data.status === 'success')
            {
                user.regEmailCode = parseInt(data.message)
                ui.call(`UI::auth`, {
                    cmd: "updatePage",
                    data: 5
                })
            }
            else
            {
                ui.call(`UI::auth`, {
                    cmd: "showError",
                    data: data.message
                })
            }
        },

        'ui::auth:regMail': data =>
        {
            data = JSON.parse(data)
            if(parseInt(data.code) !== user.regEmailCode)
            {
                return ui.call(`UI::auth`, {
                    cmd: "showError",
                    data: "Не верный код подтверждения"
                })
            }

            mp.events.callRemote('client::join:createAccount', JSON.stringify(data))
        },
        'server::join:hide': data =>
        {
            ui.call('UI::auth', {
                cmd: 'hide'
            })
            user.cursor(false, true)

            mp.players.local.freezePosition(false)
            user.destroyCamera()

            if(data.type === 'auth')
            {
                if(data.remember) mp.storage.data.authRemember = data.remember
                else delete mp.storage.data.authRemember

                mp.storage.flush()
            }
        }
    })
}
catch(e)
{
    logger.error('events/join.js', e)
}
