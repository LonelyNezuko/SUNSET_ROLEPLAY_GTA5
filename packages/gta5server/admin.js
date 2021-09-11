const logger = require('./modules/logger')
try
{
    const user = require('./user')

    const admin = {}

    admin.showCreateVehicleMenu = () =>
    {
        
    }

    module.exports = admin
}
catch(e)
{
    logger.error('admin.js', e)
}
