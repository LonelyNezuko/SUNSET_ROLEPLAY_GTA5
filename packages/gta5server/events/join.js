const logger = require('../modules/logger')
try
{
    const sha256 = require('js-sha256')

    const user = require('../user')
    const contaier = require('../modules/container')

    const func = require('../modules/func')

    const mysql = require('../mysql')
    const nodemailer = require('../modules/nodemailer')

    const enums = require('../modules/enums')

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
                    message: data.type === 'reg' ? "Аккаунт с таким ником уже имеется" : "Аккаунт не найден",
                    status: "failed",
                    type: data.type
                } ])

                if(data.type === 'reg')
                {
                    mysql.query('select id from users where email = ?', [ data.mail ], (err, res) =>
                    {
                        if(err)return logger.error('client::join', err)
                        if(res.length)return player.call('server::join:result', [ {
                            message: "Данный Email уже используется на другом аккаунте",
                            status: "failed",
                            type: data.type
                        } ])

                        mysql.query('select id from promocodes where name = ?', [ data.promo ], (err, res) =>
                        {
                            if(err)return logger.error('client::join', err)
                            if(!res.length
                                && data.promo.length)return player.call('server::join:result', [ {
                                message: "Промокод не найден",
                                status: "failed",
                                type: data.type
                            } ])

                            const randomCode = func.random(1000, 9999)
                            player.call('server::join:result', [ {
                                message: randomCode,
                                status: "success",
                                type: data.type
                            } ])

                            nodemailer.send(data.mail, `Регистрация на ${enums.projectNameShort}`, ``, `
                                <div style="widht: 100%; border-radius: 8px; overflow: hidden;">
                                    <h1 style="widht: calc(100% - 20px); padding: 10px; text-align: center; text-transform: uppercase; background-color: #2ccdbf; color: white; margin: 0;">Регистрация аккаунта на ${enums.projectName}</h1>
                                    <div style="background-color: #f6f6f6; widht: calc(100% - 30px); padding: 15px;">
                                        При регистрации аккаунта на ${enums.projectName} был указан данный Email адрес.
                                        <br>
                                        Для продолжения регистрации введите данный одноразовый код в специальное поле, в интерфейсе регистрации: <span style="background-color: #2ccdbf; color: white; padding: 5px; font-size: 17px; border-radius: 4px;">${randomCode}</span>
                                        <br>
                                        <br>
                                        <div style="background-color: #f99f9f; color: white; widht: 100%; text-align: center; padding: 6px 0; border-radius: 4px;">Если Вы не регистрировали аккаунт на SUNSET ROLE PLAY | GTA 5, то проигнорируйте данное письмо</div>
                                    </div>
                                </div>`)
                        })
                    })
                }
                else if(data.type === 'auth')
                {
                    if(res[0]['password'] !== sha256(data.password))return player.call('server::join:result', [ {
                        message: "Не верный пароль",
                        status: "failed",
                        type: data.type
                    } ])

                    if(data.remember === false) player.call('server::join:hide', [ { type: 'auth' } ])
                    else player.call('server::join:hide', [ {
                        type: 'auth',
                        remember: {
                            username: data.username,
                            password: data.password
                        }
                    } ])

                    // временно выбор одного персонажа
                    const userID = res[0]['id']
                    mysql.query('select id from characters where userID = ? limit 1', [ userID ], (err, res) =>
                    {
                        if(err)return logger.error('client::join', err)
                        if(!res.length)return user.kick(player.id, 'Персонаж не найден!')

                        user.load(player, res[0]['id'])
                    })
                }
            })
        },

        'client::join:createAccount': (player, data) =>
        {
            data = JSON.parse(data)
            user.create(player, data.login, data.password, data.mail, data.promo)
        }
    })
}
catch(e)
{
    logger.error('events/join.js', e)
}
