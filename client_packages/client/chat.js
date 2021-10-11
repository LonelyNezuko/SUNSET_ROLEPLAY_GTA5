const logger = require('./client/modules/logger')
try
{
    const ui = require('./client/ui/index')
    const chat = {}

    chat.send = (text, data = {}) =>
    {
        data.text = text

        if(data.color && data.color === -1) data.color = 'FFFFFF'
        if(data.textColor && data.textColor === -1) data.textColor = 'FFFFFF'
        if(data.backgroundColor && data.backgroundColor === -1) data.backgroundColor = 'FFFFFF'

        ui.call('UI::chat', {
            cmd: 'addMessage',
            data: data
        })
    }

    chat.sendMe = text =>
    {
        mp.events.callRemote('client::chat:sendMe', text)
    }
    chat.sendDo = text =>
    {
        mp.events.callRemote('client::chat:sendDo', text)
    }

    exports = chat
}
catch(e)
{
    logger.error('chat.js', e)
}
