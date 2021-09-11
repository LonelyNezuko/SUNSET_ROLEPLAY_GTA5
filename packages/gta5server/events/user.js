const logger = require('../modules/logger')
try
{
    const user = require('../user')
    const container = require('../modules/container')

    const enums = require('../modules/enums')

    const mysql = require('../mysql')

    mp.events.add({
        "client::user:setVW": (player, vw) =>
    	{
    		player.dimension = vw
    	},
    	"client::user:kick": (player, reason) =>
    	{
    		user.kick(player, reason)
    	},

    	"client::user:join": (player) =>
    	{
			logger.debug('client::user:join')

            container.delete('user', player.id)

            container.set('user', player.id, 'username', player.name)
            container.set('user', player.id, 'isLogged', false)

			player.call('server::user:joinShow', [ player.name ])
    	},

        "server::user:load": (player, id) =>
        {
            user.load(player, id)
        },

        'client::user:saveCharacter': (player, data) =>
        {
            data = JSON.parse(data)

            mysql.query('select id from users where charname = ?', [ data.firstName + ' ' + data.lastName ], (err, res) =>
            {
                if(err)return logger.error('client::user:saveCharacter', err)
                if(res.length)return player.call('server::user:userCreateError')

                player.call('server::user:closeUserCreate')
                setTimeout(() =>
                {
                    container.set('user', player.id, 'skin', data.settings)
                    container.set('user', player.id, 'gender', data.gender)

                    container.set('user', player.id, 'charname', data.firstName + ' ' + data.lastName)

                    logger.log('', data.dateBirth)
                    container.set('user', player.id, 'dateBirth', data.dateBirth)

                    if(container.get('user', player.id, 'userCreate') === 0) container.set('user', player.id, 'userCreate', 1)

                    user.spawn(player)
                    user.save(player)
                }, 1000)
            })
        }
    })
}
catch(e)
{
    logger.error('events/user.js', e)
}
