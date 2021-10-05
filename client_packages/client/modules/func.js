const logger = require('./client/modules/logger')
try
{
    const func = {}

    func.getCameraOffset = (pos, angle, dist) =>
    {
        angle = angle * 0.0174533;

        pos.y = pos.y + dist * Math.sin(angle);
        pos.x = pos.x + dist * Math.cos(angle);

        return pos;
    }
    func.getStreetNames = () =>
    {
        const position = mp.players.local.position
        let result = [ 'Неизвестно', '' ]

        if(position.z >= -30)
        {
            const zoneHash = mp.game.zone.getNameOfZone(position.x, position.y, position.z)
            const streetHash = mp.game.pathfind.getStreetNameAtCoord(position.x, position.y, position.z, 0, 0)

            result = [
                mp.game.ui.getLabelText(zoneHash),
                mp.game.ui.getStreetNameFromHashKey(streetHash.streetName)
            ]
        }
        return result
    }

    exports = func
}
catch(e)
{
    logger.error('func.js', e)
}
