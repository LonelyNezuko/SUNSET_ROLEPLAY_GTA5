const logger = require('../modules/logger')
try
{
    const user = require('../user')

    mp.events.add({
        'client::hud:openChat': player =>
        {
            if(user.isOnFoot(player)) player.call('client::hud:openChat', [ true ])
        }
    })
}
catch(e)
{
    logger.error('events/ui.js', e)
}
