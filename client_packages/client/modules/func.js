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

    exports = func
}
catch(e)
{
    logger.error('func.js', e)
}
