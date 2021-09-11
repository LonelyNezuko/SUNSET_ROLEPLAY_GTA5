const logger = require('./client/modules/logger')
try
{
    const ui = require('./client/ui/index')
    const chat = {}

    chat.send = (text, data = {}) =>
    {
        ui.call('UI::hud', {
            cmd: 'chatSend',
            data: {
                text: text,
                data: data
            }
        })
    }

    exports = chat
}
catch(e)
{
    logger.error('chat.js', e)
}
