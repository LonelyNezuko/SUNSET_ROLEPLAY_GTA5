const logger = require('./modules/logger')
try
{
    const user = require('./user')
    const mysql = require('./mysql')

    const modal = require('./modules/modal')
    const enums = require('./modules/enums')
    const container = require('./modules/container')
    const func = require('./modules/func')

    const vehicles = require('./property/vehicles')
    const houses = require('./property/houses')
    const biz = require('./property/biz')

    const admin = {}

    admin.bizManager = (player, bizid = -1) =>
    {
        if(user.getAdmin(player) < 5)return user.notify(player, 'Не доступно', 'error')

        modal.reset(player)
        modal.header(player, 'Админка', 'Менеджер бизнесов')

        if(bizid != -1
            && biz.isState(bizid))
        {
            modal.append(player, 'button', '', `${enums.bizType[biz.getType(bizid)]} #${biz.getID(bizid)}`)
            modal.append(player, 'empty')

            modal.append(player, 'button', '', `Владелец: ${biz.getOwner(bizid).name}`)
            modal.append(player, 'input', 'changeOwner', 'Изменить владельца', `${houses.getOwner(bizid).id}`)

            modal.append(player, 'empty')
            modal.append(player, 'select', 'position', `Позиция`, 1, {
                list: [ container.get('biz', bizid, 'position').x, container.get('biz', bizid, 'position').y, container.get('biz', bizid, 'position').z ],
                descr: 'Нажмите Enter, чтобы телепортироваться'
            })
            modal.append(player, 'button', 'changePosition', 'Изменить позицию')

            modal.append(player, 'empty')
            modal.append(player, 'input', 'changePrice', 'Стоимость', container.get('biz', bizid, 'price'))

            modal.append(player, 'empty')
            modal.append(player, 'button', 'back', '<< Назад')

            modal.toggle(player, true)
            player.modalTrigger = (id, value) =>
            {
                if(id === 'changeOwner')
                {
                    const id = parseInt(value)
                    if(isNaN(id)
                        || id < 1)return user.notify(player, 'Введите уникальный ID персонажа', 'error')
                    if(biz.getOwner(bizid).id === id)return user.notify(player, `Вы ввели ID владельца бизнеса`, 'error')

                    mysql.query('select charname from character where id = ?', [ id ], (err, res) =>
                    {
                        if(err)return logger.error('admin.bizManager', err)
                        if(!res.length)return user.notify(player, 'Персонаж не найден', 'error')

                        container.get('biz', bizid, 'owner').id = id
                        container.get('biz', bizid, 'owner').name = res[0]['charname']

                        biz.save(bizid)
                        biz.refresh(bizid)

                        admin.bizManager(player, bizid)
                        user.notify(player, `Вы успешно изменили владельца ${enums.bizType[biz.getType(bizid)]} #${biz.getID(bizid)}`)

                        user.sendLog(player, `Изменил владельца BIZ:${biz.getID(bizid)} на CHARACTER:${id}`, 1)
                    })
                }
                else if(id === 'position') biz.tp(player, bizid)
                else if(id === 'changePosition')
                {
                    user.showPrompt(player, `Вы действительно хотите изменить позицию ~0bc6a9~${enums.bizType[biz.getType(bizid)]} #${biz.getID(bizid)} ~ffffff~на Ваше местоположение?`)
                    player.promptTrigger = response =>
                    {
                        if(response)
                        {
                            container.set('biz', bizid, 'position', {
                                x: player.position.x,
                                y: player.position.y,
                                z: player.position.z,
                                a: player.heading
                            })
                            container.set('biz', bizid, 'dimension', player.dimension)

                            biz.save(bizid)
                            biz.refresh(bizid)

                            admin.bizManager(player, bizid)
                            user.notify(player, `Вы успешно изменили позицию ${enums.bizType[biz.getType(bizid)]} #${biz.getID(bizid)}`)

                            user.sendLog(player, `Изменил позицию BIZ:${biz.getID(bizid)} на ${player.position.x}.${player.position.y}.${player.position.z}. Heading: ${player.heading}. Dimension: ${player.dimension}`, 1)
                        }
                    }
                }
                else if(id === 'changePrice')
                {
                    value = parseInt(value)
                    if(value < 1)return user.notify(player, 'Цена должна быть не ниже 1', 'error')

                    container.set('biz', bizid, 'price', value)

                    biz.save(bizid)
                    biz.refresh(bizid)

                    admin.bizManager(player, bizid)
                    user.notify(player, `Вы успешно изменили цену ${enums.bizType[biz.getType(bizid)]} #${biz.getID(bizid)}`)

                    user.sendLog(player, `Изменил цену BIZ:${biz.getID(bizid)} на ${func.formatCash(value)}`, 1)
                }

                else if(id === 'back') admin.houseManager(player)
            }

            return
        }

        modal.append(player, 'button', 'create', 'Создать бизнес')
        modal.append(player, 'button', 'back', '<< Назад')

        modal.append(player, 'empty')

        modal.append(player, 'input', 'selectBizForID', 'Выбрать по ID')
        if(biz.nearPlayer(player) !== -1) modal.append(player, 'input', 'selectBizNear', 'Выбрать рядом')

        modal.append(player, 'empty')

        const all = container.all('biz')
        for(var key in all)
        {
            modal.append(player, 'button', `selectBiz-${biz.getServerID(all[key].id)}`, `${enums.bizType[all[key].type]} #${all[key].id}`, '', {
                descr: `Владелец: ${all[key].owner.name}/nСтоимость: ${func.formatCash(all[key].price)}/nСтатус: ${all[key].locked ? "Закрыт" : "Открыт"}`
            })
        }

        modal.toggle(player, true)
        player.modalTrigger = (id, value) =>
        {
            if(id === 'create')
            {
                if(!enums.bizType.length)return user.notify(player, 'Ошибка: BIZ_TYPE_NOT_FOUND')

                modal.reset(player)
                modal.header(player, 'Админка', 'Создание бизнеса')

                modal.append(player, 'select', 'type', 'Тип бизнеса', 0, {
                    list: enums.bizType
                })
                modal.append(player, 'input', 'price', 'Стоимость', '0', {
                    descr: "Устанавливается по желанию"
                })

                modal.append(player, 'empty')

                modal.append(player, 'button', 'create', 'Создать бизнес')
                modal.append(player, 'button', 'back', 'Назад')

                player.modalTrigger = (id, value, elems) =>
                {
                    if(id === 'create')
                    {
                        const data = {}

                        if(parseFloat(elems.price) > 0) data.price = parseFloat(elems.price)
                        data.dimension = player.dimension

                        biz.create(elems.type, [ player.position.x, player.position.y, player.position.z, player.position.a ], data, status =>
                        {
                            if(status === false)return user.notify(player, 'Не удалось создать бизнес', 'error')

                            modal.toggle(player, false)
                            user.notify(player, `Вы успешно создали бизнес #${biz.getID(status)}`, 'warning')

                            user.sendLog(player, `Создал BIZ:${biz.getID(status)}`, 1)
                        })
                    }
                }
            }
            else if(id === 'back') admin.fastAdminMenu(player)
            else if(id === 'selectBizForID')
            {
                const id = parseInt(value)
                if(isNaN(id)
                    || id < 0)return user.notify(player, 'Введите ID бизнеса', 'error')
                if(!biz.isState(id))return user.notify(player, 'Бизнес не найден', 'error')

                admin.bizManager(player, id)
            }
            else if(id === 'selectBizNear')
            {
                const id = biz.nearPlayer(player)
                if(id === -1 && biz.isState(id))return user.notify(player, 'Вы должны быть возле бизнеса', 'error')

                admin.bizManager(player, id)
            }

            for(var key in all)
            {
                if(id === `selectBiz-${biz.getServerID(all[key].id)}`)return admin.bizManager(player, biz.getServerID(all[key].id))
            }
        }
    }
    admin.houseManager = (player, houseid = -1) =>
    {
        if(user.getAdmin(player) < 5)return user.notify(player, 'Не доступно', 'error')

        modal.reset(player)
        modal.header(player, 'Админка', 'Менеджер домов')

        logger.log('', houseid)
        if(houseid !== -1
            && houses.isState(houseid))
        {
            modal.append(player, 'button', '', `${enums.housesType[houses.getType(houseid)]} #${houses.getID(houseid)}`)
            modal.append(player, 'empty')

            modal.append(player, 'button', '', `Владелец: ${houses.getOwner(houseid).name}`)
            modal.append(player, 'input', 'changeOwner', 'Изменить владельца', `${houses.getOwner(houseid).id}`)

            modal.append(player, 'empty')
            modal.append(player, 'select', 'position', `Позиция`, 1, {
                list: [ container.get('houses', houseid, 'position').x, container.get('houses', houseid, 'position').y, container.get('houses', houseid, 'position').z ],
                descr: 'Нажмите Enter, чтобы телепортироваться'
            })
            modal.append(player, 'button', 'changePosition', 'Изменить позицию')
            modal.append(player, 'button', 'changePositionInt', 'Изменить позицию интерьера')

            modal.append(player, 'empty')
            modal.append(player, 'input', 'changePrice', 'Стоимость', container.get('houses', houseid, 'price'))

            modal.append(player, 'empty')
            modal.append(player, 'button', 'back', '<< Назад')

            modal.toggle(player, true)
            player.modalTrigger = (id, value) =>
            {
                if(id === 'changeOwner')
                {
                    const id = parseInt(value)
                    if(isNaN(id)
                        || id < 1)return user.notify(player, 'Введите уникальный ID персонажа', 'error')
                    if(houses.getOwner(houseid).id === id)return user.notify(player, `Вы ввели ID владельца ${enums.housesType[houses.getType(houseid)]}`, 'error')

                    mysql.query('select charname from character where id = ?', [ id ], (err, res) =>
                    {
                        if(err)return logger.error('admin.houseManager', err)
                        if(!res.length)return user.notify(player, 'Персонаж не найден', 'error')

                        container.get('houses', houseid, 'owner').id = id
                        container.get('houses', houseid, 'owner').name = res[0]['charname']

                        houses.save(houseid)
                        houses.refresh(houseid)

                        admin.houseManager(player, houseid)
                        user.notify(player, `Вы успешно изменили владельца ${enums.housesType[houses.getType(houseid)]} #${houses.getID(houseid)}`)

                        user.sendLog(player, `Изменил владельца HOUSE:${houses.getID(houseid)} на CHARACTER:${id}`, 1)
                    })
                }
                else if(id === 'position') houses.tp(player, houseid)
                else if(id === 'changePosition')
                {
                    user.showPrompt(player, `Вы действительно хотите изменить позицию ~0bc6a9~${enums.housesType[houses.getType(houseid)]} #${houses.getID(houseid)} ~ffffff~на Ваше местоположение?`)
                    player.promptTrigger = response =>
                    {
                        if(response)
                        {
                            container.set('houses', houseid, 'position', {
                                x: player.position.x,
                                y: player.position.y,
                                z: player.position.z - 1.0,
                                a: player.heading
                            })
                            container.set('houses', houseid, 'dimension', player.dimension)

                            houses.save(houseid)
                            houses.refresh(houseid)

                            admin.houseManager(player, houseid)
                            user.notify(player, `Вы успешно изменили позицию ${enums.housesType[houses.getType(houseid)]} #${houses.getID(houseid)}`)

                            user.sendLog(player, `Изменил позицию HOUSE:${house.getID(houseid)} на ${player.position.x}.${player.position.y}.${player.position.z}. Heading: ${player.heading}. Dimension: ${player.dimension}`, 1)
                        }
                    }
                }
                else if(id === 'changePositionInt')
                {
                    user.showPrompt(player, `Вы действительно хотите изменить позицию интерьера ~0bc6a9~${enums.housesType[houses.getType(houseid)]} #${houses.getID(houseid)} ~ffffff~на Ваше местоположение?`)
                    player.promptTrigger = response =>
                    {
                        if(response)
                        {
                            container.set('houses', houseid, 'interior', {
                                x: player.position.x,
                                y: player.position.y,
                                z: player.position.z - 1.0,
                                a: player.heading
                            })

                            houses.save(houseid)
                            houses.refresh(houseid)

                            admin.houseManager(player, houseid)
                            user.notify(player, `Вы успешно изменили позицию ${enums.housesType[houses.getType(houseid)]} #${houses.getID(houseid)}`)

                            user.sendLog(player, `Изменил позицию интерьера HOUSE:${house.getID(houseid)} на ${player.position.x}.${player.position.y}.${player.position.z}. Heading: ${player.heading}. Dimension: ${player.dimension}`, 1)
                        }
                    }
                }
                else if(id === 'changePrice')
                {
                    value = parseInt(value)
                    if(value < 1)return user.notify(player, 'Цена должна быть не ниже 1', 'error')

                    container.set('houses', houseid, 'price', value)

                    houses.save(houseid)
                    houses.refresh(houseid)

                    admin.houseManager(player, houseid)
                    user.notify(player, `Вы успешно изменили цену ${enums.housesType[houses.getType(houseid)]} #${houses.getID(houseid)}`)

                    user.sendLog(player, `Изменил цену HOUSE:${houses.getID(houseid)} на ${func.formatCash(value)}`)
                }

                else if(id === 'back') admin.houseManager(player)
            }

            return
        }

        modal.append(player, 'button', 'create', 'Создать дом/квартиру')
        modal.append(player, 'button', 'back', '<< Назад')

        modal.append(player, 'empty')

        modal.append(player, 'input', 'selectHouseForID', 'Выбрать по ID')
        if(houses.nearPlayer(player) !== -1) modal.append(player, 'input', 'selectHouseNear', 'Выбрать рядом')

        modal.append(player, 'empty')

        const all = container.all('houses')
        for(var key in all)
        {
            modal.append(player, 'button', `selectHouse-${houses.getServerID(all[key].id)}`, `${enums.housesType[all[key].type]} ${enums.housesClass[all[key].class]} #${all[key].id}`, '', {
                descr: `Владелец: ${all[key].owner.name}/nСтоимость: ${func.formatCash(all[key].price)}/nСтатус: ${all[key].locked ? "Закрыт" : "Открыт"}`
            })
        }

        modal.toggle(player, true)
        player.modalTrigger = (id, value) =>
        {
            if(id === 'create')
            {
                modal.reset(player)
                modal.header(player, 'Админка', 'Создание дома')

                modal.append(player, 'select', 'type', 'Тип имущества', 0, {
                    list: enums.housesType
                })
                modal.append(player, 'select', 'classes', 'Класс имущества', 0, {
                    list: enums.housesClass
                })
                modal.append(player, 'input', 'price', 'Стоимость', '0', {
                    descr: "Устанавливается по желанию"
                })

                modal.append(player, 'empty')

                modal.append(player, 'button', 'create', 'Создать дом')
                modal.append(player, 'button', 'back', 'Назад')

                modal.toggle(player, true)
                player.modalTrigger = (id, value, elems) =>
                {
                    if(id === 'create')
                    {
                        const data = {}

                        if(parseFloat(elems.price) > 0) data.price = parseFloat(elems.price)
                        data.dimension = player.dimension

                        houses.create(elems.type, elems.classes, [ player.position.x, player.position.y, player.position.z - 1, player.position.a ], data, status =>
                        {
                            if(status === false)return user.notify(player, 'Не удалось создать дом', 'error')

                            modal.toggle(player, false)
                            user.notify(player, `Вы успешно создали дом #${houses.getID(status)}`, 'warning')

                            user.sendLog(player, `Создал HOUSE:${houses.getID(status)}`)
                        })
                    }
                    else if(id === 'back') admin.houseManager(player)
                }
            }
            else if(id === 'back') admin.fastAdminMenu(player)
            else if(id === 'selectHouseForID')
            {
                let id = parseInt(value)
                if(isNaN(id)
                    || id < 0)return user.notify(player, 'Введите ID дома/квартиры', 'error')

                id = houses.getServerID(id)
                if(!houses.isState(id))return user.notify(player, 'Дом/Квартира не найдены', 'eror')

                admin.houseManager(player, id)
            }
            else if(id === 'selectHouseNear')
            {
                const id = houses.nearPlayer(player)
                if(id === -1 || !houses.isState(id))return user.notify(player, 'Вы должны быть рядом с домом/квартирой', 'error')

                admin.houseManager(player, id)
            }

            for(var key in all)
            {
                if(id === `selectHouse-${houses.getServerID(all[key].id)}`)return admin.houseManager(player, houses.getServerID(all[key].id))
            }
        }
    }
    admin.vehicleManager = (player, vehid = -1) =>
    {
        if(user.getAdmin(player) < 5)return user.notify(player, 'Не доступно', 'error')
        return user.notify(player, 'Пока не доступно', 'error')

        modal.reset(player)
        modal.header(player, 'Админка', 'Менеджер транспорта')

        if(vehid !== -1
            && vehicles.getVehicle(vehid))
        {
            modal.append(player, 'button', '', `${vehicles.getModel(vehid)} [${vehicles.getID(vehid)}]`)
            modal.append(player, 'empty')

            modal.append(player, 'button', '', `Владелец: ${vehicles.getTypeName(vehid)}`)
            modal.append(player, 'input', 'typeID', 'ID владельца', vehicles.getOwner(vehid).id, {
                descr: 'Нажмите Enter, чтобы изменить'
            })

            modal.append(player, 'empty')

            modal.append(player, 'select', 'position', `Позиция`, 1, {
                list: [ vehicles.getVehicle(vehid).position.x, vehicles.getVehicle(vehid).position.y, vehicles.getVehicle(vehid).position.z ],
                descr: 'Нажмите Enter, чтобы телепортироваться'
            })

            modal.append(player, 'empty')
            modal.append(player, 'button', 'back', '<< Назад')

            player.modalTrigger = (id, value) =>
            {
                if(id === 'typeID')
                {
                    const id = parseInt(value)
                    if(!isNaN(id)
                        || id < 1)return user.notify(player, 'Введите уникальный ID персонажа', 'error')
                    // if(houses.getOwner(houseid).id === id)return user.notify(player, `Вы ввели ID владельца ${enums.housesType[houses.getType(houseid)]}`, 'error')
                    //
                    // mysql.query('select charname from character where id = ?', [ id ], (err, res) =>
                    // {
                    //     if(err)return logger.error('admin.houseManager', err)
                    //     if(!res.length)return user.notify(player, 'Персонаж не найден', 'error')
                    //
                    //     container.get('houses', houseid, 'owner').id = id
                    //     container.get('houses', houseid, 'owner').name = res[0]['charname']
                    //
                    //     houses.save(houseid)
                    //     houses.refresh(houseid)
                    //
                    //     admin.houseManager(player, houseid)
                    //     user.notify(player, `Вы успешно изменили владельца ${enums.housesType[houses.getType(houseid)]}`)
                    // })

                    container.get('vehicles', vehid, 'owner')[Object.keys(container.get('vehicles', vehid, 'owner'))[0]] = value
                    vehicles.save(vehid)

                    user.notify(player, 'Вы успешно изменили владельца транспорта')
                }
                else if(id === 'position')
                {
                    modal.toggle(player, false)
                    user.setPos(player, vehicles.getVehicle(vehid).position.x + 1.0, vehicles.getVehicle(vehid).position.y + 1.0, vehicles.getVehicle(vehid).position.z, vehicles.getVehicle(vehid).heading, vehicles.getVehicle(vehid).dimension)
                }
                else if(id === 'back') admin.vehicleManager(player)
            }
            return
        }

        modal.append(player, 'button', 'create', 'Создать транспорт')
        modal.append(player, 'button', 'back', '<< Назад')

        modal.append(player, 'empty')

        if(player.vehicle) modal.append(player, 'input', 'selectVehicleIn', `Выбрать ${vehicles.getModel(player.vehicle.id)} #${player.vehicle.id}`)
        modal.append(player, 'input', 'selectVehicleForID', 'Выбрать по ID')

        modal.append(player, 'empty')

        const all = container.all('vehicles')
        for(var key in all)
        {
            modal.append(player, 'button', `selectVehicle-${vehicles.getServerID(all[key].id)}`, `${all[key].model} ${vehicles.getTypeName(parseInt(key))} #${parseInt(key)}`, '', {
                descr: `Владелец: ${all[key].owner.name}/nСтоимость: ${func.formatCash(all[key].price)}/nСтатус: ${all[key].locked ? "Закрыт" : "Открыт"}`
            })
        }

        modal.toggle(player, true)
        player.modalTrigger = (id, value) =>
        {
            if(id === 'create')
            {
                modal.reset(player)
                modal.header(player, 'Админка', 'Создание транспорта')

                let
                    defaultVehicle = null,
                    defaultVehicleModel = ''

                for(var key in enums.vehiclesData)
                {
                    if(!defaultVehicle)
                    {
                        defaultVehicle = enums.vehiclesData[key]
                        defaultVehicleModel = key
                    }
                }

                modal.append(player, 'input', 'model', 'Модель транспорта', defaultVehicleModel)

                const typeList = [ 'player' ]
                modal.append(player, 'select', 'type', 'Владелец транспорта', 0, {
                    list: [ 'Игрок' ]
                })
                modal.append(player, 'input', 'typeID', 'ID владельца', user.getID(player))

                const colorList = [ 'ffffff', '000000', 'b9b9b9', 'ff0000', 'ADFF2F', 'FFC0CB', 'FF1493', 'FFA07A', 'FF4500', 'FFD700', 'FFA500', '008080', '00FFFF', '0000FF' ]
                modal.append(player, 'color', 'color1', 'Первый цвет', 0, {
                    list: colorList
                })
                modal.append(player, 'color', 'color2', 'Второй цвет', 0, {
                    list: colorList
                })

                modal.append(player, 'empty')

                modal.append(player, 'button', 'create', 'Создать транспорт')
                modal.append(player, 'button', 'back', '<< Назад')

                modal.toggle(player, true)
                player.modalTrigger = (id, value, elems) =>
                {
                    if(id === 'create')
                    {
                        const owner = {}
                        owner[typeList[elems.type]] = parseInt(elems.typeID)

                        const color = []

                        color.push([ func.hexToRGB(colorList[elems.color1]).r, func.hexToRGB(colorList[elems.color1]).g, func.hexToRGB(colorList[elems.color1]).b ])
                        color.push([ func.hexToRGB(colorList[elems.color2]).r, func.hexToRGB(colorList[elems.color2]).g, func.hexToRGB(colorList[elems.color2]).b ])

                        const veh = vehicles.create(elems.model, [ player.position.x, player.position.y, player.position.z ], {
                            heading: player.heading,
                            owner: owner,
                            save: true,
                            color: color
                        })
                        if(!veh)return user.notify(player, 'Не удалось создать транспорт', 'error')

                        user.notify(player, 'Транспорт был успешно создан', 'warning')
                        admin.vehicleManager(player, veh.id)
                    }
                    else if(id === 'back') admin.vehicleManager(player)
                }
            }
            else if(id === 'back') admin.fastAdminMenu(player)
            else if(id === 'selectVehicleIn')
            {
                const veh = player.vehicle

                if(!veh)return user.notify(player, 'Вы должны сидеть в транспорте', 'error')
                if(!vehicles.isState(veh.id))return user.notify(player, 'Транспорт не найден', 'error')

                admin.vehicleManager(player, veh.id)
            }
            else if(id === 'selectVehicleForID')
            {
                const id = parseInt(value)
                if(isNaN(id)
                    || id < 0)return user.notify(player, 'Введите ID транспорта', 'error')
                if(!vehicles.getVehicle(id))return user.notify(player, 'Транспорт не найден', 'error')

                admin.vehicleManager(player, id)
            }

            for(var key in all)
            {
                if(id === `selectVehicle-${all[key].id}`)return admin.vehicleManager(player, all[key].id)
            }
        }
    }


    admin.fastAdminMenu = (player, userid = -1) =>
    {
        if(!user.getAdmin(player))return
        if(userid === -1) userid = player.id

        modal.reset(player)
        modal.header(player, 'Админка', 'Быстрое меню')

        modal.append(player, 'input', 'playerMenu', 'Управление игроком', userid)

        if(user.getAdmin(player) >= 5)
        {
            modal.append(player, 'empty')

            modal.append(player, 'button', 'houseMenu', 'Менеджер домов')
            modal.append(player, 'button', 'bizMenu', 'Менеджер бизнесов')
            modal.append(player, 'button', 'vehicleMenu', 'Менеджер транспорта')
        }

        modal.append(player, 'empty')
        modal.append(player, 'button', '_exit', 'Закрыть')

        modal.toggle(player, true)
        player.modalTrigger = (id, value) =>
        {
            if(id === 'playerMenu') user.notify(player, 'В разработке', 'warning')
            else if(id === 'houseMenu'
                && user.getAdmin(player) >= 5) admin.houseManager(player)
            else if(id === 'bizMenu'
                && user.getAdmin(player) >= 5) admin.bizManager(player)
            else if(id === 'vehicleMenu'
                && user.getAdmin(player) >= 5) admin.vehicleManager(player)
        }
    }

    module.exports = admin
}
catch(e)
{
    logger.error('admin.js', e)
}
