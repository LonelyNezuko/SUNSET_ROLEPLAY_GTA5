const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')

    const ui = require('./client/ui/index')

    mp.events.add({
        'ui::npcDialog:close': () =>
        {
            user.toggleHud(true)
            user.cursor(false, true)

            user.destroyCamera(500)
        },
        'ui::dialogNPC:click': button =>
        {
            mp.events.callRemote('client::npcDialog:trigger', button)
        },

        'server::npcDialog:header': header =>
        {
            ui.call('UI::dialogNPC', {
                cmd: 'updateTitle',
                data: header
            })
        },
        'server::npcDialog:text': (text, btns) =>
        {
            const addData = {
                text: text
            }
            if(btns) addData.buttons = btns

            ui.call('UI::dialogNPC', {
                cmd: 'updateBody',
                data: addData
            })
        },
        'server::npcDialog:toggle': toggle =>
        {
            ui.call('UI::dialogNPC', {
                cmd: 'toggle',
                data: toggle
            })

            user.toggleHud(!toggle)
            user.cursor(toggle, !toggle)
        }
    })
}
catch(e)
{
    logger.error('events/npc.js', e)
}
