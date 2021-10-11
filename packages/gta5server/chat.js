const logger = require('./modules/logger')
try
{
    const func = require('./modules/func')
    const container = require('./modules/container')

    const user = require('./user')
    const chat = {}

    chat.local = (player, text, color, data = {}) =>
    {
        // if(data.timestamp === undefined) data.timestamp = container.get('user', player.id, 'chatsettings').timestamp

        data.color = color
        player.call('server::chat:send', [ text, data ])
    }

    chat.sendMe = (player, text) =>
    {
        const formatText = user.getCharName(player) + ` [${player.id}]` + ` ${text}`
        mp.players.forEach(pl =>
        {
            if(user.isLogged(pl)
                && func.distance2D(player.position, pl.position) < 30) chat.local(pl, formatText, 'db70d3')
        })
    }
    chat.sendDo = (player, text) =>
    {
        const formatText = user.getCharName(player) + ` [${player.id}]` + ` ${text}`
        mp.players.forEach(pl =>
        {
            if(user.isLogged(pl)
                && func.distance2D(player.position, pl.position) < 30) chat.local(pl, formatText, '608ebf')
        })
    }

    module.exports = chat
}
catch(e)
{
    logger.error('chat.js', e)
}
