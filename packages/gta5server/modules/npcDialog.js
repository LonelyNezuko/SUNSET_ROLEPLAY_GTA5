const logger = require('./logger')
try
{
    const user = require('../user')
    
    const npcDialog = {}

    npcDialog.setHeader = (player, header) =>
    {
        player.call('server::npcDialog:header', [ header ])
    }
    npcDialog.setText = (player, text, btns = undefined) =>
    {
        player.call('server::npcDialog:text', [ text, btns ])
    }
    npcDialog.toggle = (player, toggle, timer = 0) =>
    {
        setTimeout(() =>
        {
            player.call('server::npcDialog:toggle', [ toggle ])
            if(!toggle) user.destroyCamera(player, {
                ease: 500
            })

        }, timer)
    }

    npcDialog.trigger = (player, button) =>
    {
        player.npcDialogTrigger(button)
    }

    module.exports = npcDialog
}
catch(e)
{
    logger.error('modules/npcDialog.js', e)
}
