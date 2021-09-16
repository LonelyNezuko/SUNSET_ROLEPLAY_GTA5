const logger = require('./client/modules/logger')

try
{
    const ui = require('./client/ui/index')
    const user = require('./client/user')

    const chat = require('./client/chat')

    mp.events.add({

        'server::vehicles:belt': () =>
        {
            if(!mp.players.local.vehicle)return

            user.vehicleBelt = !user.vehicleBelt
            mp.players.local.setConfigFlag(32, !user.vehicleBelt)

            chat.sendMe(`${!user.vehicleBelt ? "отстегнул" : "пристегнул"} ремень безопастности`)
        }
    })
}
catch(e)
{
    logger.error('events/join.js', e)
}
