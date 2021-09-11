const logger = require('../modules/logger')
try
{
    const enums = {}

    enums.userVariables = [
        'username',
        'password',
        'email',

        'regDate',
        'lastDate',

        'regIP',
        'lastIP',

        'userCreate',

        'position',

        'cash',

        'gender',
        'skin',

        'charname',
        'dateBirth'
    ]

    enums.defaultSpawn = [
        [ 131.40255737304688, -1179.633544921875, 29.58236312866211, 0.0, 0 ]
    ]

    enums.stockX2 = false
    enums.serverName = 'TEST'

    enums.clothesComponentID = {
        mask: 0,
        hair: 2,
        torsos: 3,
        legs: 4,
        bags: 5,
        shoes: 6,
        accessories: 7,
        undershirts: 8,
        armour: 9,
        decals: 10,
        tops: 11
    }
    enums.clothes = {
        'none':
        [
            {
                mask: 0,
                torsos: 15,
                legs: 18,
                bags: 0,
                shoes: 34,
                accessories: 0,
                undershirts: 15,
                armour: 0,
                decals: 0,
                tops: 15
            },
            {
                mask: 0,
                torsos: 15,
                legs: 17,
                bags: 0,
                shoes: 35,
                accessories: 0,
                undershirts: 15,
                armour: 0,
                decals: 0,
                tops: 15
            }
        ]
    }

    module.exports = enums
}
catch(e)
{
    logger.error('enums.js', e)
}
