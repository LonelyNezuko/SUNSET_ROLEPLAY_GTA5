const logger = require('./client/modules/logger')
try
{
    mp.events.add({
        'server::npc:createPeds': npc =>
        {
            for(var key in npc)
            {
                mp.peds.new(mp.game.joaat(npc[key].model),
                    new mp.Vector3(npc[key].position.x, npc[key].position.y, npc[key].position.z),
                    npc[key].position.a,
                    npc[key].position.dimension)
            }
        }
    })
}
catch(e)
{
    logger.error('events/npc.js', e)
}
