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
        'choiceRole',

        'position',

        'cash',

        'gender',
        'skin',

        'charname',
        'dateBirth'
    ]

    enums.defaultSpawn = [
        [ 191.79483032226562, -924.42724609375, 30.686996459960938, 140.24330139160156, 0 ],
        [ 207.73556518554688, -936.6594848632812, 30.686809539794922, 147.14170837402344, 0 ],
        [ 201.3427276611328, -946.2774047851562, 30.69178581237793, -33.844200134277344, 0 ],
        [ 186.85000610351562, -934.3627319335938, 30.68680763244629, -35.786529541015625, 0 ]
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

    // { itemHash, itemType, itemName, maxQuantity, data }
    enums.invItems = [
        
    ]

    enums.inventory = {}
    enums.inventory.getItem = itemHash =>
    {
        let item
        enums.invItems.forEach(elem =>
        {
            if(elem.itemHash === itemHash) item = elem
        })
        return item
    }

    enums.projectName = 'SUNSET ROLE PLAY | GTA 5'
    enums.projectNameShort = 'SUNSET ROLE PLAY'

    module.exports = enums
}
catch(e)
{
    logger.error('enums.js', e)
}
