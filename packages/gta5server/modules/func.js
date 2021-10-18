const logger = require('./logger')
try
{
    const fs = require('fs')

    const func = {}

    func.random = (min, max) =>
    {
        if(min === 0 && max === 0)return 0

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

    func.savePosition = (position, name = "", callback) =>
    {
        fs.appendFile('saved/positions.txt', `${position[0]}, ${position[1]}, ${position[2]}, ${position[3]} // ${name}\r\n`, error => {
            if(error) callback(false, error)
            else callback(true)
        })
    }

    func.hexToRGB = hex =>
    {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
        return { r, g, b }
    };

    module.exports = func
}
catch(e)
{
    logger.error('func.js', e)
}
