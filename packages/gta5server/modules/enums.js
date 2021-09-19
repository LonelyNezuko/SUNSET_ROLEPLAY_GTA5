const logger = require('./logger')
try
{
    const enums = {}

    enums.characterVariables = [
        'lastDate',
        'userCreate',

        'position',

        'cash',

        'gender',

        'skin',
        'clothes',

        'charname',
        'dateBirth',

        'keyBinds',
        'chatsettings'
    ]
    enums.housesVariables = [
        'type',
        'class',

        'owner',

        'position',
        'dimension',

        'interior',
        'price',

        'garage',
        'locked'
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
        head: 0,
        mask: 1,
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
        'none': [
            { // male
                head: 0,
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
            { // female
                head: 0,
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
        ],
        'start': [
            { // male
                torsos: 6,
                legs: 5,
                shoes: 4,
                tops: 7
            },
            { // female
                torsos: 3,
                legs: 4,
                shoes: 0,
                tops: 3
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


    enums.commandsAdmin =
    {
        'spawn': 1,
        'spawnPlayer': 2, // Тот же /spawn, но с дописанием ID игрока

        'setadmin': 4,
        'veh': 2, // Сюда же и /delveh

        'createvehicle': 5,
        'deletevehicle': 5,

        'tphouse': 1,
        'tphouseint': 1,

        'createhouse': 5,
        'deletehouse': 5,
        'edithouse': 5
    }

    enums.keyDefaultBinds =
    {
        toggleVehicleEngine: {
            name: "N",
            key: 78
        },
        toggleVehicleLocked: {
            name: "L",
            key: 76
        },
        toggleVehicleBelt: {
            name: "K",
            key: 75
        },

        action: {
            name: "E",
            key: 69
        }
    }

    enums.defaultChatSettings =
    {
        timestamp: false
    }

    enums.vehiclesData =
    {
        't20': {
            maxSpeed: 120,

            maxFuel: 40,
            expensFuel: 25,

            price: 5000000,

            type: "car",
            typeName: "Супер-кар"
        }
    }

    enums.housesType = [
        'Дом',
        'Квартира'
    ]
    enums.housesClass = [
        'Бюджет',
        'Средний',
        'Люкс',
        'Премиум'
    ]

    enums.housesDefaultSettings = [
        [// Дом
            { // Бюджет
                interiors: [
                    [ 265.9913635253906, -1007.3116455078125, -101.00852966308594, -3.0419886112213135 ]
                ],
                garages: [
                    [ 179.09864807128906, -1000.412353515625, -98.99988555908203, 179.90341186523438, 172.21388244628906, -1004.741455078125, -99.42455291748047, -176.66537475585938, 172.1881561279297, -1008.0836181640625, -98.99988555908203, -1.3001947402954102 ]
                ],

                price: 75990
            },
            { // Средний
                interiors: [
                    [ 346.3364562988281, -1012.8930053710938, -99.19622802734375, -4.445742607116699 ]
                ],
                garages: [
                    [ 212.12081909179688, -999.0419921875, -98.99994659423828, 84.69503784179688, 202.35952758789062, -1003.031005859375, -99.42330932617188, -2.0908846855163574, 194.5710906982422, -1007.4832153320312, -98.99991607666016, 0.006147169973701239 ]
                ],

                price: 179990
            },
            { // Люкс
                interiors: [
                    [ -174.03939819335938, 497.59307861328125, 137.66616821289062, -167.54388427734375 ]
                ],
                garages: [
                    [ 240.2053985595703, -1004.9365844726562, -98.99996185302734, 87.77182006835938, 231.6327667236328, -1002.1672973632812, -99.42410278320312, -9.533604621887207, 224.5177001953125, -1005.6757202148438, -98.99987030029297, -5.184851169586182 ]
                ],

                price: 56990
            }
        ],
        [ // Квартира
            { // Бюджет
                interiors: [
                    [ -18.50901985168457, -591.2957763671875, 90.11479949951172, -21.96105194091797 ]
                ],
                price: 25990
            },
            { // Средний
                interiors: [
                    [ -1450.154296875, -525.7163696289062, 56.929039001464844, 29.834333419799805 ]
                ],
                price: 129990
            },
            { // Люкс
                interiors: [
                    [ -787.1998901367188, 315.833984375, 187.91371154785156, -92.58956146240234 ]
                ],
                price: 325990
            }
        ]
    ]

    module.exports = enums
}
catch(e)
{
    logger.error('enums.js', e)
}
