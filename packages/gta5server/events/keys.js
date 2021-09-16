const logger = require('../modules/logger')
try
{
    const container = require('../modules/container')

    const user = require('../user')

    mp.events.add('client::enterKey', (player, key) =>
    {
        if(!user.isLogged(player))return

        const keyBinds = container.get('user', player.id, 'keyBinds')
        switch(key)
        {
            case keyBinds.toggleVehicleEngine.key:
            {
                mp.events.call('client::vehicles:engine', player)
                break
            }
            case keyBinds.toggleVehicleLocked.key:
            {
                mp.events.call('client::vehicles:locked', player)
                break
            }
            case keyBinds.toggleVehicleBelt.key:
            {
                player.call('server::vehicles:belt')
                break
            }
        }
    })
}
catch(e)
{
    logger.error('events/keys.js', e)
}
