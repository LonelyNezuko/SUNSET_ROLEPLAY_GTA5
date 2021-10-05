const logger = require('./logger')
try
{
    const npcDialog = require('../modules/npcDialog')
    mp.events.add({
        'client::npcDialog:trigger': (player, button) =>
        {
            npcDialog.trigger(player, button)
        }
    })
}
catch(e)
{
    logger.error('events/npcDialog.js', e)
}
