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
        'ui::npcDialog:trigger': data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::npcDialog:trigger', data.button)
        },

        'server::npcDialog:header': header =>
        {
            ui.call('UI::npcDialog', {
                cmd: 'header',
                data: header
            })
        },
        'server::npcDialog:text': (text, btns) =>
        {
            ui.call('UI::npcDialog', {
                cmd: 'text',
                data: {
                    text: text,
                    btns: btns
                }
            })
        },
        'server::npcDialog:toggle': toggle =>
        {
            ui.call('UI::npcDialog', {
                cmd: 'toggle',
                data: toggle
            })

            if(toggle)
            {
                user.toggleHud(false)
                user.cursor(true, false)
            }
        }
    })
}
catch(e)
{
    logger.error('events/npc.js', e)
}
