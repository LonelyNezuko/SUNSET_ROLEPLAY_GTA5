const logger = require('../modules/logger')

try
{
    require('./join')
    require('./logger')
    require('./user')
    require('./chat')
    require('./keys')
    require('./menuList')

    const user = require('../user')
    const container = require('../modules/container')

    mp.events.add(
    {
        'playerDeath': (player, reason, killer) =>
        {
            user.spawn(player)
            player.health = 100
        },
        'playerQuit': (player, exitType, reason) =>
        {
            user.save(player)
            container.delete('user', player.id)
        }
    })
}
catch(e)
{
    logger.error('events.js', e)
}
