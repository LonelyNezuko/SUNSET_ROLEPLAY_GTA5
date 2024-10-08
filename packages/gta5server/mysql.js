const logger = require('./modules/logger')
try
{
    const mysql2 = require('mysql2')
    const mysql = {}

    const CONFIG_mysql = require('./configs/mysql.js')

    mysql.connection = null

    mysql.connect = async (callback) =>
    {
        try
        {
            mysql.connection = await mysql2.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'sunset'
            })

            mysql.query('SET GLOBAL wait_timeout=86400', [], err =>
            {
                if(err)return logger.error('mysql.connect', e)

                callback()
                logger.log('MySQL connection: OK!')
            })
        }
        catch(e)
        {
            logger.error('MySQL connection: ERROR!', e)
        }
    }
    mysql.query = (query, args = [], callback = null) =>
    {
        mysql.connection.query(query, args, callback)
    }

    module.exports = mysql
}
catch(e)
{
    logger.error('mysql.js', e)
}
