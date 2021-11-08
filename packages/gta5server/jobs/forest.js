const logger = require('../modules/logger')
const container = require('../modules/container')
const func = require('../modules/func')
const npcDialog = require('../modules/npcDialog')
const enums = require('../modules/enums')

const vehicles = require('../property/vehicles')

const user = require('../user')

const forest = {}

try
{
    forest.warehouses = [
        { name: 'Склад сруба #1', position: new mp.Vector3(196.17437744140625, 6814.365234375, 26.175413131713867), count: 0 }, // 1 склад
        { name: 'Склад сруба #2', position: new mp.Vector3(-800.9021606445312, 5402.27001953125, 34.19060134887695), count: 0 }, // 2 склад
        { name: 'Склад сруба #3', position: new mp.Vector3(363.2001953125, 4430.53125, 62.87049865722656), count: 0 }, // 3 склад
        { name: 'Склад сруба #4', position: new mp.Vector3(-1607.927734375, 4744.8828125, 53.77132034301758), count: 0 } // 4 склад
    ]

    forest.markers = [
        { // 1 склад
            type1: [ // Метки у деревьев
                [ 195.70286560058594, 6848.54736328125, 22.09992790222168 - 1, -73.71060180664062 ],
                [ 198.80406188964844, 6845.1015625, 22.14773941040039 - 1, -47.2972526550293 ],
                [ 236.46371459960938, 6851.2275390625, 18.267440795898438 - 1, -63.44892883300781 ],
                [ 241.54428100585938, 6849.2509765625, 17.760087966918945 - 1, -10.003426551818848 ],
                [ 251.8173370361328, 6839.6806640625, 16.822185516357422 - 1, -122.32605743408203 ],
                [ 209.32730102539062, 6862.810546875, 19.496543884277344 - 1, -39.03519821166992 ],
                [ 211.8459014892578, 6866.41552734375, 18.573423385620117 - 1, 110.70732116699219 ],
                [ 153.3533477783203, 6849.24658203125, 19.22328758239746 - 1, 91.51322937011719 ]
            ],
            type2: {
                pos: [ 195.69793701171875, 6823.5498046875, 24.436185836791992 ], // Место загрузки сруба
                trailer: [ 211.22193908691406, 6831.52587890625, 21.48379898071289, -128.81195068359375 ] // Спавн трейлера
            },
            salaryBonus: 1.7 // Бонус к зарплате указанной в enums.jobSalary.forest
        },
        { // 2 склад
            type1: [
                [ -737.0831909179688, 5405.7900390625, 48.8303337097168 ],
                [ -739.7564086914062, 5406.7666015625, 48.04439163208008 ],
                [ -749.1676025390625, 5397.953125, 45.615093231201 ],
                [ -758.0726318359375, 5385.23095703125, 49.152732849121094 ],
                [ -761.3427124023438, 5379.02978515625, 50.87844467163086 ],
                [ -766.51904296875, 5379.60546875, 48.47417831420898 ],
                [ -764.2564697265625, 5361.1279296875, 54.75002670288086 ],
                [ -762.0795288085938, 5358.3935546875, 55.75482177734375 ],
                [ -760.0177001953125, 5356.27392578125, 56.626285552978516 ],
                [ -749.9190063476562, 5347.8984375, 60.65665817260742 ],
                [ -680.1052856445312, 5390.2822265625, 54.0656661987304 ],
                [ -676.2199096679688, 5389.24658203125, 53.924598693847656 ],
                [ -692.4720458984375, 5431.02001953125, 46.5657958984375 ],
                [ -792.6549682617188, 5447.056640625, 33.6688919067382 ],
                [ -798.2758178710938, 5457.86376953125, 32.64849853515625 ]
            ],
            type2: {
                pos: [ -823.366455078125, 5435.8271484375, 33.593536376953125 ],
                trailer: [ -804.3438110351562, 5427.08251953125, 34.55182647705078 ]
            },
            salaryBonus: 1
        },
        { // 3 склад
            type1: [
                [ 333.6625671386719, 4521.45458984375, 64.742897033691 ],
                [ 354.3377685546875, 4526.92626953125, 71.74376678466797 ],
                [ 356.92236328125, 4528.13427734375, 72.56045532226562 ],
                [ 360.2205810546875, 4529.17431640625, 74.04145050048828 ],
                [ 363.543701171875, 4517.66455078125, 73.89811706542969 ],
                [ 356.52069091796875, 4514.41796875, 69.5060958862304 ],
                [ 384.9583435058594, 4479.5986328125, 71.51181030273438 ],
                [ 420.8355407714844, 4509.70068359375, 100.00325012207031 ],
                [ 410.6881103515625, 4481.51171875, 81.96208190917969 ],
                [ 394.65570068359375, 4459.5576171875, 71.699440002441 ],
                [ 403.93017578125, 4449.23388671875, 71.74404907226562 ],
                [ 395.9396057128906, 4444.71435546875, 63.63095474243164 ]
            ],
            type2: {
                pos: [ 352.79443359375, 4441.14892578125, 63.05046844482422 ],
                trailer: [ 380.4158630371094, 4406.8916015625, 62.400184631347656 ]
            },
            salaryBonus: 2.2
        },
        { // 4 склад
            type1: [
                [ -1598.3104248046875, 4712.2236328125, 45.39883804321289, ],
                [ -1594.0267333984375, 4713.5166015625, 46.721038818359375, ],
                [ -1583.1470947265625, 4692.919921875, 46.7932014465332 ],
                [ -1583.8846435546875, 4688.2001953125, 45.6930465698242 ],
                [ -1580.199462890625, 4685.4169921875, 45.91890335083008, ],
                [ -1575.54638671875, 4688.2197265625, 47.3530387878418 ],
                [ -1574.71337890625, 4681.1943359375, 46.24567413330078 ],
                [ -1562.0003662109375, 4684.46142578125, 47.42756652832031 ],
                [ -1560.2467041015625, 4690.646484375, 49.089805603027344 ],
                [ -1553.8961181640625, 4687.435546875, 47.22820663452148 ],
                [ -1541.9658203125, 4675.84033203125, 41.802303314208984 ],
                [ -1537.577392578125, 4679.1044921875, 41.63441848754883 ],
                [ -1530.957275390625, 4678.4091796875, 40.329227447509766 ],
                [ -1524.7626953125, 4667.072265625, 35.998924255371094 ],
                [ -1526.7340087890625, 4662.82763671875, 34.33421325683594, ],
                [ -1553.1453857421875, 4655.8232421875, 40.25804901123047 ],
                [ -1555.4229736328125, 4660.02490234375, 41.47739028930664 ],
                [ -1560.1236572265625, 4657.2646484375, 42.557655334472656 ],
                [ -1561.521240234375, 4663.24853515625, 43.811649322509766 ],
                [ -1566.32421875, 4665.767578125, 45.1432647705078 ]
            ],
            type2: {
                pos: [ -1611.5001220703125, 4748.60546875, 53.189849853515625 ],
                trailer: [ -1628.99365234375, 4740.45556640625, 52.98065185546875 ]
            },
            salaryBonus: 2.7
        }
    ]

    forest.setMarker = player =>
    {
        if(!user.getJobActive(player, 'forest'))return

        if(container.get('user', player.id, 'job-forest-type') === 0)
        {
            user.setMarker(player, forest.markers[container.get('user', player.id, 'job-forest-place')].type1[func.random(0, forest.markers[container.get('user', player.id, 'job-forest-place')].type1.length - 1)], 0, 'Задание лесопилки')
            player.enterMarker = name =>
            {
                if(name === 'Задание лесопилки')
                {
                    player.playAnimation('amb@medic@standing@kneel@base', 'base', 1, 1)
                    user.destroyMarker(player)

                    setTimeout(() =>
                    {
                        container.set('user', player.id, 'job-forest-count', container.get('user', player.id, 'job-forest-count') + 1)
                        player.stopAnimation()

                        user.notify(player, 'Вы успешно срубили дерево. Теперь отнесите его на склад!')
                        user.setMarker(player, [ forest.warehouses[container.get('user', player.id, 'job-forest-place')].position.x, forest.warehouses[container.get('user', player.id, 'job-forest-place')].position.y, forest.warehouses[container.get('user', player.id, 'job-forest-place')].position.z - 1 ], 0, 'Склад лесопилки')
                    }, 10000)
                }
                else if(name === 'Склад лесопилки')
                {
                    user.giveJobActiveSalary(player, enums.jobSalary.forest[0] * forest.markers[container.get('user', player.id, 'job-forest-place')].salaryBonus)
                    user.notify(player, `Вы сдали срубленное дерево на склад. Вы заработали уже ${func.formatCash(user.getJobActiveSalary(player))}`)

                    forest.warehouses[container.get('user', player.id, 'job-forest-place')].count ++
                    forest.warehouses[container.get('user', player.id, 'job-forest-place')].update()

                    if(container.get('user', player.id, 'job-forest-count') >= container.get('user', player.id, 'job-forest-max-count'))
                    {
                        user.notify(player, 'Теперь отправляйтесь на следующую точку для вырубки деревьев!', 'warning')

                        container.get('user', player.id, 'job-forest-count', 0)
                        container.set('user', player.id, 'job-forest-max-count', func.random(5, 10))

                        container.set('user', player.id, 'job-forest-place', func.random(0, forest.markers.length))
                    }

                    forest.setMarker(player)
                }
            }
        }
        else if(container.get('user', player.id, 'job-forest-type') === 1)
        {
            user.setRaceMarker(player, forest.markers[container.get('user', player.id, 'job-forest-place')].type2.pos, 0, 'Задание лесопилки')

            player.enterMarker = name =>
            {
                if(name === 'Задание лесопилки')
                {
                    if(container.get('vehicles', player.vehicle.id, 'model') !== 'hauler2')return user.notify(player, "Вы должны быть на рабочем транспорте", 'error')
                    user.destroyMarker(player)

                    if(forest.warehouses[container.get('user', player.id, 'job-forest-place')].count < 10)
                    {
                        forest.setMarker(player)
                        return user.notify(player, "На данном складе не достаточно бревен. Отправляйтесь на другой!")
                    }

                    const trailer = vehicles.create('trailerlogs', forest.markers[container.get('user', player.id, 'job-forest-place')].type2.trailer, {
                        locked: true,
                        heading: forest.markers[container.get('user', player.id, 'job-forest-place')].type2.trailer[3],
                        dimension: 0,
                        owner: {
                            trailer: player.id
                        }
                    })
                    if(!trailer)return user.notify(player, 'Не удалось создать транспорт', 'error')

                    container.set('user', player.id, 'job-forest-trailer', trailer)
                    user.notify(player, "Лес был загружен. Возьмите груз и отправляйтесь на склад.")

                    forest.warehouses[container.get('user', player.id, 'job-forest-place')].count -= 10
                    forest.warehouses[container.get('user', player.id, 'job-forest-place')].update()

                    user.setRaceMarker(player, [ -510.8410339355469, 5264.794921875, 80.61012268066406 ], 0, 'Склад лесопилки')
                }
                else if(name === 'Склад лесопилки')
                {
                    const veh = player.vehicle
                    if(!veh)return user.notify(player, "Вы должны быть в рабочем транспорте", 'error')

                    const trailer = container.get('user', player.id, 'job-forest-trailer')
                    if(!trailer)
                    {
                        forest.setMarker(player)
                        return user.notify(player, 'У Вас нет груза', 'error')
                    }

                    // logger.log('', veh.trailer, trailer)
                    // if(veh.trailer !== trailer)return user.notify(player, 'Вы где-то потеряли грузи', 'error')

                    user.giveJobActiveSalary(player, enums.jobSalary.forest[1] * forest.markers[container.get('user', player.id, 'job-forest-place')].salaryBonus)
                    user.notify(player, `Вы успешно доставили груз и получили ${func.formatCash(enums.jobSalary.forest[1] * forest.markers[container.get('user', player.id, 'job-forest-place')].salaryBonus)}. Вы заработали уже ${func.formatCash(user.getJobActiveSalary(player))}`)

                    vehicles.destroy(trailer.id)
                    container.clear('user', player.id, 'job-forest-trailer')

                    forest.setMarker(player)
                }
            }
        }
    }
    forest.setClothesForType = player =>
    {
        if(!user.isLogged(player))return
        if(user.getJobActive(player) !== 'forest')return

        if(container.get('user', player.id, 'job-forest-type') === 0)
        {
            if(user.getGender(player) === 0)
            {
                user.setClothes(player, {
                    tops: 25,
                    torsos: 2
                }, false, false)
            }
            else
            {
                user.setClothes(player, {
                    tops: 382,
                    torsos: 3
                }, false, false)
            }
        }
    }

    forest._initMode = () =>
    {
        forest.warehouses.forEach((item, i) =>
        {
            forest.warehouses[i].update = () =>
            {
                if(forest.warehouses[i].blip) forest.warehouses[i].blip.destroy()
                if(forest.warehouses[i].label) forest.warehouses[i].label.destroy()

                forest.warehouses[i].blip = mp.blips.new(369, item.position, {
                    name: `${item.name} - Лесопилка. Загруженность: ${item.count}`,
                    color: 4,
                    shortRange: true,
                    dimension: 0
                })
                forest.warehouses[i].label = mp.labels.new(`${item.name}\n~c~Загруженность: ${item.count}`, item.position, {
                    font: 0,
                    drawDistance: 10.0,
                    dimension: 0
                })
            }

            forest.warehouses[i].colshape = mp.colshapes.newCircle(item.position.x, item.position.y, 1.5, 0)
            forest.warehouses[i].marker = mp.markers.new(0, item.position, 1.0, {
                color: [ 255, 255, 255, 100 ],
                dimension: 0
            })

            forest.warehouses[i].update()
        })
    }



    // Events
    forest.actionNPC = (player, hash) =>
    {
        switch(hash)
        {
            case 'job-forest':
            {
                if(user.getJobActive(player)
                    && user.getJobActive(player) !== 'forest')return user.notify(player, 'Вы уже работаете на другой работе', 'error')

                if(user.getJobActive(player) === 'forest')
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
                            npcDialog.toggle(player, false, 5000)

                            setTimeout(() => user.clearJobActive(player), 4000)
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
                                { id: '0', title: 'Рубить деревья' },
                                { id: '1', title: 'Доставлять сруб' },
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
                                        `Тебе необходимо отправиться в одно из 4х мест для рубки деревьев и срубать их./nТебе нужно срубить до 10ти деревьев в одном месте, после чего отправится на другие места./nЗа 1 срубленное дерево я тебе заплачу ${func.formatCash(enums.jobSalary.forest[0])}/n/nЧуть не забыл... Места для сруба у нас далеко от сюда, поэтому можешь взять в аренду машину у Клауса, если нет своей.`,
                                        `Тебе необходимо отправиться в одно из 4х мест для рубки деревьев и забрать от туда готовый сруб. После отвезти сруб на завод по изготовлению досок./nЗа 1 доставленный сруб я тебе заплачу ${func.formatCash(enums.jobSalary.forest[1])}/n/nЧуть не забыл... Для доставки сруба тебе необходим грузовик. Ты можешь воспользоваться личным, либо арендовать рабочий у Клауса.`
                                    ]

                                    npcDialog.setText(player, `Отличный выбор. Итак, слушай, что тебе нужно делать:/n/n${typesText[parseInt(button)]}`, [
                                        { id: 'yes', title: 'Все понял, иду работать' },
                                        { id: 'exit', title: 'Я передумал', isExit: true }
                                    ])
                                    container.set('user', player.id, 'job-forest-type', parseInt(button))

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

                                            switch(container.get('user', player.id, 'job-forest-type'))
                                            {
                                                case 0:
                                                {
                                                    user.notify(player, 'Вы начали работу на лесопилке. Отправляйтесь к первому месту для рубки деревьев.')
                                                    break
                                                }
                                                case 1:
                                                {
                                                    user.notify(player, 'Вы начали работу на лесопилке. Отправляйтесь к первому месту для доставки сруба.')
                                                    break
                                                }
                                            }

                                            user.setJobActive(player, 'forest')

                                            container.set('user', player.id, 'job-forest-count', 0)
                                            container.set('user', player.id, 'job-forest-max-count', func.random(5, 10))
                                            container.set('user', player.id, 'job-forest-place', func.random(0, forest.markers.length - 1))
                                            container.set('user', player.id, 'job-rent-vehicle', null)

                                            forest.setClothesForType(player)
                                            forest.setMarker(player)
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
            case 'job-forest-rent-veh':
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
                        if(user.getJobActive(player) !== 'forest')
                        {
                            npcDialog.setText(player, 'Ты не работаешь на лесопилке, я своих знаю')
                            return npcDialog.toggle(player, false, 5000)
                        }

                        npcDialog.toggle(player, false)
                        let veh

                        if(container.get('user', player.id, 'job-forest-type') === 0) veh = vehicles.createRent(player, 'bodhi2', [ -570.2330932617188, 5267.458984375, 70.26897430419922, 155.9022216796875 ])
                        else if(container.get('user', player.id, 'job-forest-type') === 1) veh = vehicles.createRent(player, 'hauler2', [ -600.0234985351562, 5303.4033203125, 70.21449279785156, -163.83111572265625 ])

                        if(!veh)return user.notify(player, 'Не удалось создать транспорт', 'error')
                        user.notify(player, 'Вы успешно арендовали рабочий транспорт. Срок действия аренды Час.')

                        container.set('user', player.id, 'job-rent-vehicle', veh)
                    }
                    else npcDialog.toggle(player, false)
                }
                break
            }
        }
    }
}
catch(e)
{
    logger.error('', e)
}

module.exports = forest
