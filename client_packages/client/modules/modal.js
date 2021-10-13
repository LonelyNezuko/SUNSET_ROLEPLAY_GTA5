const logger = require('./client/modules/logger')
try
{
    const ui = require('./client/ui/index')
    const user = require('./client/user')

    const modal = {}

    modal.reset = () =>
    {
        ui.call('UI::modal', {
            cmd: 'reset'
        })
    }
    modal.append = (type, id, title, value, data = {}) =>
    {
        const addData = {
            type: type,
            id: id,
            title: title,
            value: value
        }

        if(type === 'select' || type === 'color') addData.values = data.list
        if(type === 'input') addData.placeholder = data.placeholder

        addData.desc = data.desc

        ui.call('UI::modal', {
            cmd: 'addElement',
            data: addData
        })
    }
    modal.header = (title, desc = '') =>
    {
        ui.call('UI::modal', {
            cmd: 'updateTitle',
            data: desc.length ? [ title, desc ] : title
        })
    }
    modal.toggle = toggle =>
    {
        ui.call('UI::modal', {
            cmd: 'toggle',
            data: toggle
        })

        user.cursor(false, !toggle)
    }

    exports = modal
}
catch(e)
{
    logger.error('modules/modal.js', e)
}
