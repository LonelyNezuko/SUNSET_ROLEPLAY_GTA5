const logger = require('./client/modules/logger')
logger.log('start')
try
{
    require('./client/modules/noclip')
    require('./client/events/events')

    const user = require('./client/user')
    const ui = require('./client/ui/index')

    const enums = require('./client/modules/enums')

    mp.gui.chat.show(false)
    mp.game.ui.displayCash(false)
    mp.game.ui.displayAmmoThisFrame(false)
    mp.game.ui.displayHud(false)
    mp.game.gameplay.setFadeOutAfterDeath(false)
    mp.game.gameplay.setFadeOutAfterArrest(false)
    mp.game.gameplay.setFadeInAfterDeathArrest(false)
    mp.game.gameplay.setFadeInAfterLoad(false)

    mp.game.vehicle.defaultEngineBehaviour = false
    mp.players.local.setConfigFlag(429, true)

    user.toggleHud(false)
    user.cursor(false)

    user.setVW(mp.players.local.id + 1)
    mp.players.local.freezePosition(true)

    mp.players.local.position = new mp.Vector3(131.40255737304688, -1179.633544921875, 29.58236312866211)
    user.setCamera(new mp.Vector3(139.1585693359375, -1179.1124267578125, 31.22740936279297), [ 124.16255187988281, -1200.6533203125, 28.439077377319336 ])

    enums.interiors.forEach(item =>
    {
        mp.game.streaming.requestIpl(item)
    })

    setTimeout(() => ui.start(), 100)
}
catch(e)
{
    logger.error('index.js', e)
}
