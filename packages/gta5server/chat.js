const logger = require('./modules/logger')
try
{
    const func = require('./modules/func')
    const container = require('./modules/container')

    const user = require('./user')

    const chat = {}

    chat.local = (player, text, data = {}) =>
    {
        player.call('server::chat:send', [ text, data ])
    }


    chat.radius = (player, text) =>
    {
        if(!user.isLogged(player))return

        const formatText = container.get('user', player.id, 'username') + ` [${player.id}]` + ` говорит: ${text}`
        mp.players.forEach(pl =>
        {
            if(user.isLogged(pl)
                && func.distance2D(player.position, pl.position) < 30) chat.local(pl, formatText)
        })
    }

    module.exports = chat
}
catch(e)
{
    logger.error('chat.js', e)
}
