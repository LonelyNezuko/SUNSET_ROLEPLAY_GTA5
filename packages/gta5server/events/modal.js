const logger = require('./logger')
try
{
    const modal = require('../modules/modal')
    mp.events.add({
        'client::modal:trigger': (player, data) =>
        {
            modal.trigger(player, data)
        }
    })
}
catch(e)
{
    logger.error('events/modal.js', e)
}
