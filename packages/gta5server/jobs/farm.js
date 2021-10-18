const logger = require('../modules/logger')
const container = require('../modules/container')
const func = require('../modules/func')
const enums = require('../modules/enums')
const npcDialog = require('../modules/npcDialog')

const user = require('../user')

const vehicles = require('../property/vehicles')

const farm = {}

farm.warehouses = [
    { name: 'Склад пшена', position: new mp.Vector3(1981.79150390625, 5029.7373046875, 41.0205192565918), count: 0 },
    { name: 'Склад яблок', position: new mp.Vector3(2523.68994140625, 4984.39697265625, 44.68328857421875), count: 0 },
    { name: 'Склад томатов', position: new mp.Vector3(1980.089111328125, 5173.009765625, 47.63911437988281), count: 0 },
    { name: 'Склад сена', position: new mp.Vector3(2152.629638671875, 5117.8466796875, 47.2383918762207), count: 0 }
]
farm._initMode = () =>
{
    farm.warehouses.forEach((item, i) =>
    {
        farm.warehouses[i].update = () =>
        {
            if(farm.warehouses[i].blip) farm.warehouses[i].blip.destroy()
            if(farm.warehouses[i].label) farm.warehouses[i].label.destroy()

            farm.warehouses[i].blip = mp.blips.new(369, item.position, {
                name: `${item.name} - Ферма. Загруженность: ${item.count}`,
                color: 4,
                shortRange: true,
                dimension: 0
            })
            farm.warehouses[i].label = mp.labels.new(`${item.name}\n~c~Загруженность: ${item.count}`, item.position, {
                font: 0,
                drawDistance: 10.0,
                dimension: 0
            })
        }

        farm.warehouses[i].colshape = mp.colshapes.newCircle(item.position.x, item.position.y, 1.5, 0)
        farm.warehouses[i].marker = mp.markers.new(0, item.position, 1.0, {
            color: [ 255, 255, 255, 100 ],
            dimension: 0
        })

        farm.warehouses[i].update()
    })
}

farm.markers = [
    [],
    [
        [ 2055.36572265625, 4878.7021484375, 42.84303665161133 - 1 ],
        [ 2050.829833984375, 4883.6142578125, 42.8482666015625 - 1 ],
        [ 2045.2744140625, 4889.25, 42.866798400878906 - 1 ],
        [ 2039.3714599609375, 4895.25732421875, 42.868316650390625 - 1 ],
        [ 2033.28369140625, 4901.02294921875, 42.86474609375 - 1 ],
        [ 2029.429443359375, 4904.82666015625, 42.860198974609375 - 1 ],
        [ 2024.746826171875, 4909.22265625, 42.83601760864258 - 1 ],
        [ 2020.248291015625, 4913.60498046875, 42.82794189453125 - 1 ],
        [ 2016.0662841796875, 4917.84326171875, 42.83333969116211 - 1 ],
        [ 2010.8055419921875, 4923.19921875, 42.852210998535156 - 1 ],
        [ 2006.8853759765625, 4927.11083984375, 42.8627815246582 - 1 ]
    ],
    [
        [ 1981.8447265625, 4772.76416015625, 41.91693878173828 - 1 ],
        [ 2003.8203125, 4786.390625, 41.78557586669922 - 1 ],
        [ 2016.5340576171875, 4801.1201171875, 41.983802795410156 - 1 ],
        [ 2029.517578125, 4801.78076171875, 41.962562561035156 - 1 ]
    ],
    [
        [ 1988.996826171875, 4850.3994140625, 43.75152587890625 - 1 ],
        [ 1993.501220703125, 4845.88232421875, 43.781497955322266 - 1 ],
        [ 2003.7789306640625, 4835.24072265625, 43.03524398803711 - 1 ],
        [ 2007.4351806640625, 4831.30419921875, 42.778881072998 - 1 ],
        [ 2002.3984375, 4832.9951171875, 43.1329231262207 - 1 ],
        [ 2006.104248046875, 4829.22509765625, 42.79061508178711 - 1 ],
        [ 1992.1285400390625, 4843.9736328125, 43.79484176635742 - 1 ],
        [ 1989.7073974609375, 4846.04541015625, 43.87342071533203 - 1 ],
        [ 1987.3228759765625, 4848.72119140625, 43.808441162109375 - 1 ]
    ],
    [
        [
            [ 1836.3773193359375, 4811.8125, 43.8513069152832 ],
            [ 1847.189208984375, 4821.451171875, 44.56538391113281 ],
            [ 1862.37890625, 4836.43701171875, 44.71841812133789 ],
            [ 1874.05615234375, 4839.3291015625, 44.860347747802734 ],
            [ 1864.1572265625, 4830.16064453125, 44.954193115234375 ],
            [ 1851.342041015625, 4817.81494140625, 44.64957809448242 ],
            [ 1841.2646484375, 4807.86865234375, 43.9287223815918 ],
            [ 1846.0677490234375, 4800.9267578125, 43.83393859863281 ],
            [ 1858.4140625, 4812.33935546875, 44.58966827392578 ],
            [ 1870.5869140625, 4825.08447265625, 45.215293884277344 ],
            [ 1877.7122802734375, 4834.1416015625, 45.307579040527344 ],
            [ 1882.084716796875, 4827.63134765625, 45.444305419921875 ],
            [ 1875.33154296875, 4819.78125, 45.297245025634766 ],
            [ 1863.165283203125, 4807.1962890625, 44.525062561035156 ],
            [ 1854.9368896484375, 4799.31689453125, 43.75190353393555 ],
            [ 1863.7615966796875, 4783.5029296875, 42.3226432800293 ],
            [ 1874.7786865234375, 4793.36962890625, 44.069210052490234 ],
            [ 1886.81689453125, 4804.83935546875, 45.04556655883789 ],
            [ 1894.48193359375, 4812.134765625, 45.417335510253906 ],
            [ 1902.876708984375, 4810.2099609375, 45.25556945800781 ],
            [ 1893.451171875, 4801.9140625, 45.0358467102050 ],
            [ 1882.05419921875, 4790.23681640625, 44.11605453491211 ],
            [ 1874.697265625, 4782.86474609375, 43.19108963012695 ],
            [ 1874.3111572265625, 4771.58984375, 41.725032806396484 ],
            [ 1885.0469970703125, 4781.50634765625, 43.631752014160156 ],
            [ 1894.2041015625, 4790.22900390625, 44.21958923339844 ],
            [ 1904.4422607421875, 4800.68603515625, 44.67120361328125 ],
            [ 1911.8223876953125, 4798.77880859375, 44.42011642456055 ],
            [ 1903.256591796875, 4790.7060546875, 44.22196960449219 ],
            [ 1892.182861328125, 4781.13818359375, 43.63414001464844 ]
        ]
    ]
]

farm.setMarker = player =>
{
    if(user.getJobActive(player) !== 'farm')return

    if(container.get('user', player.id, 'job-farm-type') >= 1
        && container.get('user', player.id, 'job-farm-type') <= 3) user.setMarker(player, farm.markers[container.get('user', player.id, 'job-farm-type')][func.random(0, farm.markers[container.get('user', player.id, 'job-farm-type')].length - 1)], 0, 'Задание фермы')
    else if(container.get('user', player.id, 'job-farm-type') === 4) user.setRaceMarker(player, farm.markers[container.get('user', player.id, 'job-farm-type')][container.get('user', player.id, 'job-farm-type-4-field')][container.get('user', player.id, 'job-farm-type-4-field-count')], 0, 'Задание фермы')

    player.enterMarker = name =>
    {
        if(name === 'Задание фермы')
        {
            switch(container.get('user', player.id, 'job-farm-type'))
            {
                case 1:
                {
                    player.playAnimation('amb@medic@standing@kneel@base', 'base', 1, 1)
                    break
                }
                case 2:
                {
                    player.playAnimation('amb@medic@standing@kneel@base', 'base', 1, 1)
                    break
                }
                case 3:
                {
                    player.playAnimation('amb@medic@standing@kneel@base', 'base', 1, 1)
                    break
                }
            }
            user.destroyMarker(player)

            if(container.get('user', player.id, 'job-farm-type') >= 1
                && container.get('user', player.id, 'job-farm-type') <= 3)
            {
                setTimeout(() =>
                {
                    let addCount = 0
                    const random = func.random(0, 100)

                    switch(container.get('user', player.id, 'job-farm-type'))
                    {
                        case 1:
                        {
                            if(random >= 0 && random <= 69) addCount = 50
                            if(random >= 70 && random <= 84) addCount = 100
                            if(random >= 85 && random <= 91) addCount = 150
                            if(random >= 92 && random <= 97) addCount = 200
                            if(random >= 98 && random <= 100) addCount = 300

                            break
                        }
                        case 2:
                        {
                            if(random >= 0 && random <= 69) addCount = 1
                            if(random >= 70 && random <= 84) addCount = 2
                            if(random >= 85 && random <= 91) addCount = 3
                            if(random >= 92 && random <= 97) addCount = 4
                            if(random >= 98 && random <= 100) addCount = 5

                            break
                        }
                        case 3:
                        {
                            if(random >= 0 && random <= 69) addCount = 1
                            if(random >= 70 && random <= 84) addCount = 2
                            if(random >= 85 && random <= 91) addCount = 3
                            if(random >= 92 && random <= 97) addCount = 4
                            if(random >= 98 && random <= 100) addCount = 5

                            break
                        }
                    }

                    container.set('user', player.id, 'job-farm-count', container.get('user', player.id, 'job-farm-count') + addCount)
                    player.stopAnimation()

                    if(container.get('user', player.id, 'job-farm-count') < container.get('user', player.id, 'job-farm-type') === 1 ? 23100 : 50)
                    {
                        switch(container.get('user', player.id, 'job-farm-type'))
                        {
                            case 1:
                            {
                                user.notify(player, `Вы собрали ${addCount} грамм урожая. Соберите еще ${23100 - container.get('user', player.id, 'job-farm-count')} грамм.`)
                                break
                            }
                            case 2:
                            {
                                user.notify(player, `Вы собрали ${addCount} яблок. Соберите еще ${50 - container.get('user', player.id, 'job-farm-count')} яблок.`)
                                break
                            }
                            case 3:
                            {
                                user.notify(player, `Вы собрали ${addCount} томатов. Соберите еще ${50 - container.get('user', player.id, 'job-farm-count')} томатов.`)
                                break
                            }
                        }
                        farm.setMarker(player)
                    }
                    else
                    {
                        switch(container.get('user', player.id, 'job-farm-type'))
                        {
                            case 1:
                            {
                                user.notify(player, `Вы заполнили рюкзак урожаем. Теперь Вы можете сдать его на склад`)
                                user.setMarker(player, [ 1981.79150390625, 5029.7373046875, 41.0205192565918 - 1.0 ], 0, 'Склад фермы')

                                break
                            }
                            case 2:
                            {
                                user.notify(player, `Вы заполнили рюкзак яблоками. Теперь Вы можете сдать их на склад`)
                                user.setMarker(player, [ 2523.68994140625, 4984.39697265625, 44.68328857421875 - 1.0 ], 0, 'Склад фермы')

                                break
                            }
                            case 3:
                            {
                                user.notify(player, `Вы заполнили рюкзак яблоками. Теперь Вы можете сдать их на склад`)
                                user.setMarker(player, [ 1980.089111328125, 5173.009765625, 47.63911437988281 - 1.0 ], 0, 'Склад фермы')

                                break
                            }
                        }
                    }
                }, 10000)
            }
            else if(container.get('user', player.id, 'job-farm-type') === 4)
            {
                try
                {
                    user.giveJobActiveSalary(player, enums.jobSalary.farm[3])
                    user.notify(player, `Вы уже заработали ${func.formatCash(user.getJobActiveSalary(player))}`, 'warning')

                    if(container.get('user', player.id, 'job-farm-type-4-field-count') >= farm.markers[4][container.get('user', player.id, 'job-farm-type-4-field')].length - 1)
                    {
                        container.set('user', player.id, 'job-farm-type-4-field-count', 0)
                        container.set('user', player.id, 'job-farm-type-4-field', func.random(0, farm.markers[4].length - 1))

                        user.notify(player, 'Вы успешно собрали сено с этого поля. Отправляйтесь к следующему')
                    }
                    else container.set('user', player.id, 'job-farm-type-4-field-count', container.get('user', player.id, 'job-farm-type-4-field-count') + 1)

                    farm.warehouses[3].count ++
                    farm.warehouses[3].update()

                    farm.setMarker(player)
                }
                catch(e)
                {
                    logger.error('', e)
                }
            }
        }
        else if(name === 'Склад фермы') user.destroyMarker(player)
    }
}

farm.setClothesForType = player =>
{
    if(user.getJobActive(player) !== 'farm')return
    switch(container.get('user', player.id, 'job-farm-type'))
    {
        case 1:
        {
            user.setClothes(player, {
                bags: 40
            }, false, false)
            break
        }
        case 2:
        {
            user.setClothes(player, {
                bags: 44
            }, false, false)
            break
        }
        case 3:
        {
            user.setClothes(player, {
                bags: 41
            }, false, false)
            break
        }
    }
}


// Events
farm.action = player =>
{
    if(func.distance2D(player.position, farm.warehouses[0].position) <= 2)
    {
        if(user.getJobActive(player) !== 'farm')return user.notify(player, 'Вы не работаете на ферме', 'error')

        if(container.get('user', player.id, 'job-farm-type') !== 1)return user.notify(player, 'Вы не собираете пшеницу', 'error')
        if(!container.get('user', player.id, 'job-farm-count'))return user.notify(player, 'Вы еще не собрали пшеницу', 'error')

        user.notify(player, `Вы сдали ${container.get('user', player.id, 'job-farm-count')} грамм урожая и заработали ${func.formatCash(container.get('user', player.id, 'job-farm-count') * enums.jobSalary.farm[0])}. Можете продолжить собирать урожай`)

        user.giveJobActiveSalary(player, container.get('user', player.id, 'job-farm-count') * enums.jobSalary.farm[0])
        farm.setMarker(player)

        farm.warehouses[0].count += container.get('user', player.id, 'job-farm-count')
        farm.warehouses[0].update()

        container.set('user', player.id, 'job-farm-count', 0)
    }
    if(func.distance2D(player.position, farm.warehouses[1].position) <= 2)
    {
        if(user.getJobActive(player) !== 'farm')return user.notify(player, 'Вы не работаете на ферме', 'error')

        if(container.get('user', player.id, 'job-farm-type') !== 2)return user.notify(player, 'Вы не собираете яблоки', 'error')
        if(!container.get('user', player.id, 'job-farm-count'))return user.notify(player, 'Вы еще не собрали яблоки', 'error')

        user.notify(player, `Вы сдали ${container.get('user', player.id, 'job-farm-count')} яблок и заработали ${func.formatCash(container.get('user', player.id, 'job-farm-count') * enums.jobSalary.farm[1])}. Можете продолжить собирать яблоки`)

        user.giveJobActiveSalary(player, container.get('user', player.id, 'job-farm-count') * enums.jobSalary.farm[1])
        farm.setMarker(player)

        farm.warehouses[1].count += container.get('user', player.id, 'job-farm-count')
        farm.warehouses[1].update()

        container.set('user', player.id, 'job-farm-count', 0)
    }
    if(func.distance2D(player.position, farm.warehouses[2].position) <= 2)
    {
        if(user.getJobActive(player) !== 'farm')return user.notify(player, 'Вы не работаете на ферме', 'error')

        if(container.get('user', player.id, 'job-farm-type') !== 3)return user.notify(player, 'Вы не собираете томаты', 'error')
        if(!container.get('user', player.id, 'job-farm-count'))return user.notify(player, 'Вы еще не собрали томаты', 'error')

        user.notify(player, `Вы сдали ${container.get('user', player.id, 'job-farm-count')} томатов и заработали ${func.formatCash(container.get('user', player.id, 'job-farm-count') * enums.jobSalary.farm[2])}. Можете продолжить собирать томаты`)

        user.giveJobActiveSalary(player, container.get('user', player.id, 'job-farm-count') * enums.jobSalary.farm[2])
        farm.setMarker(player)

        farm.warehouses[2].count += container.get('user', player.id, 'job-farm-count')
        farm.warehouses[2].update()

        container.set('user', player.id, 'job-farm-count', 0)
    }
}
farm.actionNPC = (player, npcHash) =>
{
    switch(npcHash)
    {
        case 'job-farm':
        {
            if(user.getJobActive(player)
                && user.getJobActive(player) !== 'farm')return user.notify(player, 'Вы уже работаете на другой работе', 'error')

            if(user.getJobActive(player) === 'farm')
            {
                npcDialog.toggle(player, true)
                npcDialog.setText(player, 'Уже хочешь закончить работу?', [
                    { id: 'yes', title: 'Да' },
                    { id: 'no', title: 'Нет, еще поработаю', isExit: true }
                ])

                player.npcDialogTrigger = button =>
                {
                    if(button === 'yes')
                    {
                        npcDialog.setText(player, `Хорошо, держи свои заработанные деньги: ${func.formatCash(user.getJobActiveSalary(player))}`)
                        npcDialog.toggle(player, false, 7000)

                        setTimeout(() =>
                        {
                            user.clearJobActive(player)
                        }, 6000)
                    }
                    else if(button === 'no')
                    {
                        npcDialog.setText(player, 'Хорошо. Как захочешь уйти - приходи снова')
                        npcDialog.toggle(player, false, 3000)
                    }
                }
            }
            else
            {
                npcDialog.toggle(player, true)
                npcDialog.setText(player, 'Привет, хочешь подзаработать?', [
                    { id: 'yes', title: 'Да, что нужно делать?' },
                    { id: 'no', title: 'Нет, не хочу', isExit: true }
                ])

                player.npcDialogTrigger = button =>
                {
                    if(button === 'yes')
                    {
                        npcDialog.setText(player, 'Хорошо. Что хочешь делать?', [
                            { id: '1', title: 'Собирать пшено' },
                            { id: '2', title: 'Собирать яблоки' },
                            { id: '3', title: 'Собирать томаты' },
                            { id: '4', title: 'Скашивать сено' },
                            { id: 'exit', title: 'Я передумал', isExit: true }
                        ])

                        player.npcDialogTrigger = button =>
                        {
                            if(button === 'exit')
                            {
                                npcDialog.setText(player, 'Окей. Если передумаешь - я всегда здесь')
                                npcDialog.toggle(player, false, 3000)
                            }
                            else
                            {
                                let typesText = [
                                    '',
                                    `Тебе необходимо отправиться к полям с пшеном и начать его собирать./nТебе нужно собрать 23кг 100 грамм пшена, после чего отвезти его на склад и сдать./nЗа 1 грамм пшена я тебе заплачу ${func.formatCash(enums.jobSalary.farm[0])}/n/nЧуть не забыл... Поле с пшеном у нас далеко от сюда, поэтому можешь бесплатно взять в аренду квадрацикл у Венди.`,
                                    `Тебе необходимо отправиться к полям с яблонями и начать собирать яблоки с деревьев./nТебе нужно собрать 50 яблок, после чего отвезти их на склад и сдать./nЗа 1 яблоко я тебе заплочу ${func.formatCash(enums.jobSalary.farm[1])}/n/nЧуть не забыл... Поля с яблонями у нас далеко от сюда, поэтому можешь бесплатно взять в аренду квадрацикл у Венди.`,
                                    `Тебе необходимо отправиться к теплицам с томатами и начать собирать их./nТебе нужно собрать 50 томатов, после чего отвезти их на склад и сдать./nЗа 1 томат я тебе заплочу ${func.formatCash(enums.jobSalary.farm[2])}/n/nЧуть не забыл... Теплицы с томатами у нас далеко от сюда, поэтому можешь бесплатно взять в аренду квадрацикл у Венди.`,
                                    `Тебе необходимо взять в аренду трактор у Венди и отправиться к полям с сеном./nТебе нужно проехать трактором поле одно за другим./nЗа каждый проезд я тебе заплачу ${func.formatCash(enums.jobSalary.farm[3])}`
                                ]

                                npcDialog.setText(player, `Отличный выбор. Итак, слушай, что тебе нужно делать:/n/n${typesText[parseInt(button)]}`, [
                                    { id: 'yes', title: 'Все понял, иду работать' },
                                    { id: 'exit', title: 'Я передумал', isExit: true }
                                ])
                                container.set('user', player.id, 'job-farm-type', parseInt(button))

                                player.npcDialogTrigger = button =>
                                {
                                    if(button === 'exit')
                                    {
                                        npcDialog.setText(player, 'Окей. Если передумаешь - я всегда здесь')
                                        npcDialog.toggle(player, false, 3000)
                                    }
                                    else
                                    {
                                        npcDialog.toggle(player, false)

                                        switch(container.get('user', player.id, 'job-farm-type'))
                                        {
                                            case 1:
                                            {
                                                user.notify(player, 'Вы начали работу на ферме. Теперь Вы можете Собирать пшеницу с полей')
                                                break
                                            }
                                            case 2:
                                            {
                                                user.notify(player, 'Вы начали работу на ферме. Теперь Вы можете Собирать яблоки с деревьев')
                                                break
                                            }
                                            case 3:
                                            {
                                                user.notify(player, 'Вы начали работу на ферме. Теперь Вы можете Собирать томаты из теплицы')
                                                break
                                            }
                                            case 4:
                                            {
                                                user.notify(player, 'Вы начали работу на ферме. Арендуйте трактор и отправляйтесь на поле')
                                                break
                                            }
                                        }

                                        user.setJobActive(player, 'farm')
                                        container.set('user', player.id, 'job-farm-count', 0)

                                        container.set('user', player.id, 'job-farm-type-4-field', func.random(0, farm.markers[4].length - 1))
                                        container.set('user', player.id, 'job-farm-type-4-field-count', 0)

                                        farm.setClothesForType(player)
                                        farm.setMarker(player)
                                    }
                                }
                            }
                        }
                    }
                    else if(button === 'no')
                    {
                        npcDialog.setText(player, 'Окей. Если передумаешь - я всегда здесь')
                        npcDialog.toggle(player, false, 3000)
                    }
                }
            }
            break
        }
        case 'job-farm-rent-veh':
        {
            npcDialog.toggle(player, true)
            npcDialog.setText(player, 'Привет, хочешь арендовать транспорт для работы?', [
                { id: 'yes', title: 'Да' },
                { id: 'no', title: 'Нет', isExit: true }
            ])

            player.npcDialogTrigger = button =>
            {
                if(button === 'yes')
                {
                    if(container.get('user', player.id, 'rentVehicle'))
                    {
                        npcDialog.setText(player, 'Похоже ты уже арендуешь транспорт')
                        return npcDialog.toggle(player, false, 3000)
                    }
                    if(user.getJobActive(player) !== 'farm')
                    {
                        npcDialog.setText(player, 'Ты не работаешь на ферме, я своих знаю')
                        return npcDialog.toggle(player, false, 5000)
                    }

                    npcDialog.toggle(player, false)
                    let veh

                    if(container.get('user', player.id, 'job-farm-type') >= 1
                        && container.get('user', player.id, 'job-farm-type') <= 3) veh = vehicles.createRent(player, 'blazer2', [ 2411.80859375, 4989.44873046875, 46.25341033935547, 132.09584045410156 ])
                    else if(container.get('user', player.id, 'job-farm-type') === 4) veh = vehicles.createRent(player, 'tractor2', [ 2411.80859375, 4989.44873046875, 46.25341033935547, 132.09584045410156 ])

                    if(!veh)return user.notify(player, 'Не удалось создать транспорт', 'error')
                    user.notify(player, 'Вы успешно арендовали рабочий транспорт. Срок действия аренды Час. Вам запрещено выезжать за пределы фермы на нем')
                }
                else npcDialog.toggle(player, false)
            }
            break
        }
    }
}

farm.enterColshape = (player, shape) =>
{
    farm.warehouses.forEach(item =>
    {
        if(shape === item.colshape) user.toggleActionText(player, true, ' для взаимодействия со складом')
    })
}
farm.exitColshape = (player, shape) =>
{
    farm.warehouses.forEach(item =>
    {
        if(shape === item.colshape) user.toggleActionText(player, false)
    })
}

module.exports = farm
