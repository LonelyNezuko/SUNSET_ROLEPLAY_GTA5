const logger = require('../modules/logger')
try
{
    const sha256 = require('js-sha256')

    const user = require('./user')
    const contaier = require('../modules/container')

    const func = require('../modules/func')

    const mysql = require('../mysql')

    mp.events.add({
        'client::join': (player, data) =>
        {
            data = JSON.parse(data)
            logger.debug('client::join', data)

            mysql.query('select id, password from users where username = ?', [ data.username ], (err, res) =>
            {
                if(err)return logger.error('client::join', err)

                if((res.length
                    && data.type === 'reg')
                || (!res.length
                    && data.type === 'auth'))return player.call('server::join:result', [ {
                    message: data.type === 'reg' ? "account busy" : "account not found",
                    status: "failed",
                    type: data.type
                } ])

                if(data.type === 'reg')
                {
                    mysql.query('select id from users where email = ?', [ data.email ], (err, res) =>
                    {
                        if(err)return logger.error('client::join', err)
                        if(res.length)return player.call('server::join:result', [ {
                            message: "email busy",
                            status: "failed",
                            type: data.type
                        } ])

                        const randomCode = func.random(1000, 9999)
                        player.call('server::join:result', [ {
                            message: randomCode,
                            status: "success",
                            type: data.type
                        } ])
                    })
                }
                else if(data.type === 'auth')
                {
                    if(res[0]['password'] !== sha256(data.password))return player.call('server::join:result', [ {
                        message: "invalid password",
                        status: "failed",
                        type: data.type
                    } ])

                    if(data.authRemember === false) player.call('server::join:hide')
                    else player.call('server::join:hide', [ {
                        username: data.username,
                        password: data.password,
                        autoLogin: data.authRememberAutoLogin
                    } ])

                    mp.events.call('server::user:load', player, res[0]['id'])
                }
            })
        },

        'client::join:createAccount': (player, data) =>
        {
            data = JSON.parse(data)
            mysql.query('insert into users (username, password, email, regIP, lastIP) values (?, ?, ?, ?, ?)', [
                data.username,
                sha256(data.password),
                data.email,
                player.ip,
                player.ip
            ], (err, res) =>
            {
                if(err)return logger.error('client::join:createAccount', err)

                player.call('server::join:hide')
                mp.events.call('server::user:load', player, res.insertId)
            })
        }
    })
}
catch(e)
{
    logger.error('events/join.js', e)
}
