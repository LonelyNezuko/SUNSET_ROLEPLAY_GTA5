const logger = require('./modules/logger')
try
{
    const func = require('./modules/func')
    const container = require('./modules/container')

    const user = require('./user')
    const chat = {}

    chat.local = (player, text, data = {}) =>
    {
        if(data.timestamp === undefined) data.timestamp = container.get('user', player.id, 'chatsettings').timestamp
        player.call('server::chat:send', [ text, data ])
    }

    chat.sendMe = (player, text) =>
    {
        mp.events.call('server::chat:sendMe', player, text)
    }
    chat.sendDo = (player, text) =>
    {
        mp.events.call('server::chat:sendDo', player, text)
    }

    module.exports = chat
}
catch(e)
{
    logger.error('chat.js', e)
}
