const logger = require('./modules/logger')
try
{
    const func = require('./modules/func')
    const container = require('./modules/container')

    const user = require('./user')
    const chat = {}

    chat.local = (player, text, data = {}) =>
    {
        // if(data.timestamp === undefined) data.timestamp = container.get('user', player.id, 'chatsettings').timestamp

        player.call('server::chat:send', [ text, data ])
    }

    chat.sendMe = (player, text) =>
    {
        const formatText = `~db70d3~${user.getCharName(player)} [${player.id}] ${text}`
        mp.players.forEach(pl =>
        {
            if(user.isLogged(pl)
                && func.distance2D(player.position, pl.position) < 30) chat.local(pl, formatText)
        })
    }
    chat.sendDo = (player, text) =>
    {
        const formatText = `~608ebf~${user.getCharName(player)} [${player.id}] ${text}`
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
