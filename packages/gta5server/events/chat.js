const logger = require('../modules/logger')

try
{
    const chat = require('../chat')

    mp.events.add(
    {
        'client::chat:send': (player, text) =>
        {
            chat.radius(player, text)
        }
    })
}
catch(e)
{
    logger.error('events.js', e)
}
