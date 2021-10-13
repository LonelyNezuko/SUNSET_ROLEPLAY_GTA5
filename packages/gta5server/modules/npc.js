const logger = require('./logger')
try
{
    const container = require('./container')
    const func = require('./func')
    const enums = require('./enums')

    const user = require('../user')
    const chat = require('../chat')

    const vehicles = require('../property/vehicles')

    const farm = require('../jobs/farm')

    const npcDialog = require('./npcDialog')
    const npc = {}

    npc.add = (position, hash, name, model, data = {}) =>
    {
        const id = container.free('npc')
        if(npc.isState(id))return

        container.set('npc', id, 'position', {
            x: position[0],
            y: position[1],
            z: position[2],
            a: position[3],
            dimension: position[4]
        })
        container.set('npc', id, 'hash', hash)
        container.set('npc', id, 'name', name)
        container.set('npc', id, 'model', model)
        container.set('npc', id, 'desc', data.desc || '')

        container.set('npc', id, '_label', mp.labels.new(`${name}${data.desc ? `\n~c~${data.desc}` : ''}`, new mp.Vector3(position[0], position[1], position[2]), {
            los: false,
            font: 0,
            drawDistance: 4,
            dimension: position[4]
        }))
        container.set('npc', id, '_colshape', mp.colshapes.newCircle(position[0], position[1], 2.5, position[4])).setVariable('npcID', id)
        if(data.blip) container.set('npc', id, '_blip', mp.blips.new(data.blip, new mp.Vector3(position[0], position[1], position[2]), {
                name: data.blipName || "Персонаж: " + name,
                color: 53,
                shortRange: true
            }))

        container.set('npc', id, 'state', true)
    }
    npc.isState = id =>
    {
        return container.get('npc', id, 'state')
    }
    npc.nearPlayer = (player, id = -1) =>
    {
        if(!user.isLogged(player))return -1

        if(id === -1) id = user.getNears(player).npc
        if(!npc.isState(id))
        {
            if(id === user.getNears(player).npc) user.removeNear(player, 'npc')
            return -1
        }

        if(func.distance2D(player.position, new mp.Vector3(npc.getPosition(id).x, npc.getPosition(id).y, npc.getPosition(id).z) >= 3.0)
            || player.dimension !== npc.getPosition(id).dimension)
        {
            if(id === user.getNears(player).npc) user.removeNear(player, 'npc')
            return -1
        }

        return id
    }

    npc.getName = id =>
    {
        if(!npc.isState(id))return 'None'
        return container.get('npc', id, 'name')
    }
    npc.getDesc = id =>
    {
        if(!npc.isState(id))return 'None'
        return container.get('npc', id, 'desc')
    }

    npc.getHash = id =>
    {
        if(!npc.isState(id))return '-'
        return container.get('npc', id, 'hash')
    }
    npc.getPosition = id =>
    {
        if(!npc.isState(id))return {}
        return container.get('npc', id, 'position')
    }

    npc.setCamera = (player, id) =>
    {
        if(!user.isLogged(player)
            || !npc.isState(id))return
        if(npc.nearPlayer(player, id) !== id)return

        const cameraPosition = func.getCameraOffset(new mp.Vector3(npc.getPosition(id).x, npc.getPosition(id).y, npc.getPosition(id).z + 0.5), npc.getPosition(id).a + 90, 1.3)
        user.setCamera(player, cameraPosition, [ npc.getPosition(id).x, npc.getPosition(id).y, npc.getPosition(id).z + 0.5 ], {
            ease: 500
        })
    }


    // Events
    npc.enterColshape = (player, shape) =>
    {
        const id = shape.getVariable('npcID')
        if(!npc.isState(id))return

        if(npc.nearPlayer(player, id) === id) user.setNear(player, 'npc', id)
        else return

        user.toggleActionText(player, true, `чтобы поговорить с ${npc.getName(id)}`)
    }
    npc.exitColshape = (player, shape) =>
    {
        const id = shape.getVariable('npcID')
        if(!npc.isState(id))return

        user.removeNear(player, 'npc')
        user.toggleActionText(player, false)
    }

    npc.action = player =>
    {
        const id = npc.nearPlayer(player)
        if(id === -1)return

        if(npc.getHash(id).indexOf('job-farm') !== -1) farm.actionNPC(player, npc.getHash(id))
        else
        {
            switch(npc.getHash(id))
            {
                case 'rentMoto':
                {
                    npcDialog.toggle(player, true)
                    npcDialog.setText(player, 'Хочешь арендовать мопед?', [
                        { id: 'yes', title: `Да ( 50$ )` },
                        { id: 'no', title: 'Нет, передумал', isExit: true }
                    ])

                    player.npcDialogTrigger = button =>
                    {
                        if(button === 'yes')
                        {
                            if(user.getCash(player) < enums.rentPrices.moto)
                            {
                                npcDialog.setText(player, 'Похоже, что у тебя не хватает денег')
                                return npcDialog.toggle(player, false, 2500)
                            }

                            if(npc.getPosition(id).x === -80.0335693359375
                                || npc.getPosition(id).y === 6341.1884765625)
                            {
                                npcDialog.toggle(player, false)
                                if(container.get('user', player.id, 'rentVehicle'))return user.notify(player, 'Вы уже арендуете транспорт', 'error')

                                const position = [
                                    [ -76.63664245605469, 6346.73388671875, 31.490365982055664, 42.84047317504883 ],
                                    [ -79.74605560302734, 6344.404296875, 31.490365982055664, 40.80647277832031 ],
                                    [ -82.7188720703125, 6341.7353515625, 31.490365982055664, 40.37101745605469 ],
                                    [ -85.27088928222656, 6339.06298828125, 31.490365982055664, 42.70869064331055 ]
                                ]
                                const randomPosition = func.random(0, position.length - 1)

                                const veh = vehicles.createRent(player, 'faggio', position[randomPosition])
                                if(!veh)return user.notify(player, 'Не удалось создать транспорт', 'error')

                                user.giveCash(player, -enums.rentPrices.moto)

                                user.notify(player, 'Вы успешно арендовали транспорт. Срок действия аренды Час.')
                                user.updateQuest(player, 'Первый тестовый квест', 1, 1)
                            }
                            else
                            {
                                npcDialog.setText(player, 'Упс, похоже, что я не арендодатель мопедов...')
                                return npcDialog.toggle(player, false, 3000)
                            }
                        }
                        else npcDialog.toggle(player, false)
                    }
                    break
                }
                case 'test':
                {
                    npcDialog.toggle(player, true)
                    npcDialog.setText(player, 'Привет, ты хочешь поболтать?', [
                        { id: 'yes', title: 'Да, хочу' },
                        { id: 'no', title: 'Нет, я пожалуй пойду', isExit: true }
                    ])

                    player.npcDialogTrigger = button =>
                    {
                        if(button === 'yes')
                        {
                            npcDialog.setText(player, 'Какое твое любимое занятие?', [
                                { id: '1', title: 'Я люблю заниматься Йогой' },
                                { id: '2', title: 'Я люблю заниматься Бегом' },
                                { id: '3', title: 'Я люблю заниматься Плаваньем' },
                                { id: '4', title: 'Я люблю ездить на машине' },
                                { id: '5', title: 'Я люблю летать с парашутом' },
                                { id: 'no', title: 'Я наверно все таки пойду', isExit: true }
                            ])

                            player.npcDialogTrigger = button =>
                            {
                                if(button === 'no')
                                {
                                    npcDialog.setText(player, 'Ладно, удачи тебе')
                                    npcDialog.toggle(player, false, 1000)
                                }
                                else
                                {
                                    npcDialog.setText(player, 'Хорошо занятие. Ладно, я уже пойду по делам, спасибо за твою аудиенцию')
                                    npcDialog.toggle(player, false, 5000)

                                    setTimeout(() => user.updateQuest(player, 'Первый тестовый квест', 0, 1), 5000)
                                }
                            }
                        }
                        else
                        {
                            npcDialog.setText(player, 'Ладно, как знаешь.')
                            npcDialog.toggle(player, false, 1000)
                        }
                    }

                    break
                }
                default:
                {
                    return false
                }
            }
        }

        npc.setCamera(player, id)
        npcDialog.setHeader(player, !npc.getDesc(id).length ? npc.getName(id) : [ npc.getName(id), npc.getDesc(id) ])
    }

    module.exports = npc
}
catch(e)
{
    logger.error('modules/npc.js', e)
}
