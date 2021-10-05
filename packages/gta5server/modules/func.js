const logger = require('./logger')
try
{
    const func = {}

    func.random = (min, max) =>
    {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
    func.isJSON = (str) =>
    {
        if (typeof str !== 'string') return false;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return type === '[object Object]'
                || type === '[object Array]';
        } catch (err) {
            return false;
        }
    }

    func.distance = (pos1, pos2) =>
    {
        return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2) + Math.pow((pos2.z - pos1.z),2)))
    }
    func.distance2D = (pos1, pos2) =>
    {
        return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2)))
    }

    func.formatCash = (cash, str = "$") =>
    {
        const formating = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'})
        return str + " " + formating.format(cash).replace('$', '')
    }

    func.getCameraOffset = (pos, angle, dist) =>
    {
        angle = angle * 0.0174533;

        pos.y = pos.y + dist * Math.sin(angle);
        pos.x = pos.x + dist * Math.cos(angle);

        return pos;
    }

    module.exports = func
}
catch(e)
{
    logger.error('func.js', e)
}
