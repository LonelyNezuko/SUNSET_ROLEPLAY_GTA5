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

    mp.players.local.position = new mp.Vector3(-406.1335144042969, 6321.80126953125, 29.122058868408203)
    user.setCamera(new mp.Vector3(-433.9073181152344, 6206.02587890625, 125.67748260498047), [ -177.31312561035156, 6252.0205078125, 35.86330795288086 ])

    enums.interiors.forEach(item =>
    {
        mp.game.streaming.requestIpl(item)
    })

    setTimeout(() => ui.start(), 100)
    setInterval(() => user.timer(), 1000)
}
catch(e)
{
    logger.error('index.js', e)
}
