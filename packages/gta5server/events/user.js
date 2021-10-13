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
            container.delete('user', player.id)

            container.set('user', player.id, 'username', player.name)
            container.set('user', player.id, 'isLogged', false)

            let online = 0
            mp.players.forEach(item =>
            {
                if(user.isLogged(item)) online ++
            })

			player.call('server::user:joinShow', [ {
                online: online
            } ])
    	},

        'client::user:saveCharacter': (player, data) =>
        {
            data = JSON.parse(data)

            const gender = data.genetic.gender
            const charName = data.genetic.name + ' ' + data.genetic.surname
            const dateBirth = data.genetic.birthday
            const clothes = data.clothes
            const nationality = data.genetic.nationality

            delete data.genetic.gender
            delete data.genetic.name
            delete data.genetic.surname
            delete data.genetic.birthday
            delete data.clothes
            delete data.genetic.nationality

            logger.log('client::user:saveCharacter', nationality, gender, charName, dateBirth, clothes, data.genetic, data.face, data.appearance)
            mysql.query('select id from characters where charname = ?', [ charName ], (err, res) =>
            {
                if(err)return logger.error('client::user:saveCharacter', err)
                if(res.length)return player.call('server::user:userCreateError')

                player.call('server::user:closeUserCreate')
                setTimeout(() =>
                {
                    container.set('user', player.id, 'skin', data)

                    if(container.get('user', player.id, 'userCreate') === 0)
                    {
                        container.set('user', player.id, 'userCreate', 1)
                        container.set('user', player.id, 'gender', !gender ? 0 : 1)

                        container.set('user', player.id, 'charname', charName)
                        container.set('user', player.id, 'dateBirth', dateBirth)

                        container.set('user', player.id, 'nationality', nationality)

                        user.resetClothes(player, true)

                        user.setClothes(player, enums.createCharClothes[!gender ? 0 : 1][0][clothes[0]], true, false)
                        user.setClothes(player, enums.createCharClothes[!gender ? 0 : 1][1][clothes[1]], true, false)
                        user.setClothes(player, enums.createCharClothes[!gender ? 0 : 1][2][clothes[2]], true, false)

                        user.spawn(player, true)
                    }
                    else user.spawn(player)

                }, 1000)
            })
        },

        'client::user:save': player =>
        {
            user.save(player)
        },
        'client::user:enterMarker': (player, name) =>
        {
            player.enterMarker(name)
        },

        'client::user:setPos': (player, x, y, z, a, vw) =>
        {
            user.setPos(player, x, y, z, a, vw)
        }
    })
}
catch(e)
{
    logger.error('events/user.js', e)
}
