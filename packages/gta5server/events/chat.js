const logger = require('../modules/logger')

try
{
    const chat = require('../chat')

    const user = require('../user')

    const func = require('../modules/func')

    mp.events.add(
    {
        'client::chat:send': (player, text) =>
        {
            if(!user.isLogged(player))return
            user.removeOpened(player, 'chat')

            if(!text.length)return

            const formatText = user.getCharName(player) + ` [${player.id}]` + ` говорит: ${text}`
            mp.players.forEach(pl =>
            {
                if(user.isLogged(pl)
                    && func.distance2D(player.position, pl.position) < 30) chat.local(pl, formatText)
            })
        },

        'client::chat:sendMe': (player, text) =>
        {
            if(!user.isLogged(player))return
            chat.sendMe(player, text)
        },
        'client::chat:sendDo': (player, text) =>
        {
            if(!user.isLogged(player))return
            chat.sendDo(player, text)
        },

        'server::chat:sendMe': (player, text) =>
        {
            const formatText = user.getCharName(player) + ` [${player.id}]` + ` ${text}`
            mp.players.forEach(pl =>
            {
                if(user.isLogged(pl)
                    && func.distance2D(player.position, pl.position) < 30) chat.local(pl, formatText, {
                        style: {
                            color: "#db70d3"
                        }
                    })
            })
        },
        'server::chat:sendDo': (player, text) =>
        {
            const formatText = user.getCharName(player) + ` [${player.id}]` + ` ${text}`
            mp.players.forEach(pl =>
            {
                if(user.isLogged(pl)
                    && func.distance2D(player.position, pl.position) < 30) chat.local(pl, formatText, {
                        style: {
                            color: "#608ebf"
                        }
                    })
            })
        }
    })
}
catch(e)
{
    logger.error('events.js', e)
}
