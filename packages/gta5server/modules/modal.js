const logger = require('./logger')
try
{
    const modal = {}

    modal.toggle = (player, toggle) =>
    {
        player.call('server::modal:toggle', [ toggle ])
    }
    modal.reset = player =>
    {
        player.call('server::modal:reset')
    }
    modal.header = (player, title, desc) =>
    {
        player.call('server::modal:header', [ title, desc ])
    }
    modal.append = (player, type, id = '', title = '', value = '', data = {}) =>
    {
        player.call('server::modal:append', [ type, id, title, value, JSON.stringify(data) ])
    }

    modal.trigger = (player, data) =>
    {
        data = JSON.parse(data)
        player.modalTrigger(data.id, data.value, data.elements)
    }

    module.exports = modal
}
catch(e)
{
    logger.error('modal.js', e)
}
