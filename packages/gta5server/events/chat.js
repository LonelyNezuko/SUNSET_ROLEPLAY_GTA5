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
            mp.players.forEach(pl =>
            {
                if(user.isLogged(pl)
                    && func.distance2D(player.position, pl.position) < 30) chat.local(pl, `<b>${user.getCharName(player)} [${player.id}]</b> говорит: ${text}`, {
                        id: pl.id,
                        actions: {
                            report: true
                        }
                    })
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
        }
    })
}
catch(e)
{
    logger.error('events.js', e)
}
