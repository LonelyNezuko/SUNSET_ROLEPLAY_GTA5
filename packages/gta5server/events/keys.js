const logger = require('../modules/logger')
try
{
    const admin = require('../admin')

    // mp.keys.bind(0x63, true, () => admin.showCreateVehicleMenu())
}
catch(e)
{
    logger.error('keys.js', e)
}
