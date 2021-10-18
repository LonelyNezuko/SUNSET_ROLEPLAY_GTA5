const logger = require('./modules/logger')
try
{
    const user = require('./user')

    const modal = require('./modules/modal')
    const enums = require('./modules/enums')
    const container = require('./modules/container')
    const func = require('./modules/func')

    const vehicles = require('./property/vehicles')
    const houses = require('./property/houses')
    const biz = require('./property/biz')

    const admin = {}

    admin.showCreateHouseMenu = player =>
    {
        if(user.getAdmin(player) < 5)return

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

        modal.append(player, 'button', 'create', '~5eb05c~Создать дом')
        modal.append(player, 'button', '_exit', '~b05c5c~Закрыть')

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
                    user.notify(player, `Вы успешно создали дом #${status}`, 'warning')
                })
            }
        }
    }
    admin.showCreateBizMenu = player =>
    {
        if(user.getAdmin(player) < 5
            || !enums.bizType.length)return

        modal.reset(player)
        modal.header(player, 'Админка', 'Создание бизнеса')

        modal.append(player, 'select', 'type', 'Тип бизнеса', 0, {
            list: enums.bizType
        })
        modal.append(player, 'input', 'price', 'Стоимость', '0', {
            descr: "Устанавливается по желанию"
        })

        modal.append(player, 'empty')

        modal.append(player, 'buttton', 'create', '~5eb05c~Создать бизнес')
        modal.append(player, 'buttton', '_exit', '~b05c5c~Закрыть')

        modal.toggle(player, true)
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
                    user.notify(player, `Вы успешно создали бизнес #${status}`, 'warning')
                })
            }
        }
    }

    admin.vehicleManager = (player, vehid = -1) =>
    {
        if(!user.getAdmin(player) < 5)return

        modal.reset(player)
        modal.header(player, 'Админка', 'Менеджер транспорта')

        // if(vehid !== -1
        //     && vehicles.isState(vehid))
        // {
        //     modal.append(player, 'button', '', `~3be4de~${vehicles.getModel(vehid)}`)
        //     modal.append(player, 'empty')
        //
        //     const typeList = [ 'player' ]
        //     modal.append(player, 'select', 'type', 'Владелец транспорта', typeList.indexOf(vehicles.getOwner(vehid)), {
        //         list: [ 'Игрок' ]
        //     })
        //     modal.append(player, 'input', 'typeID', 'ID владельца', vehicles.getOwner(vehid).id)
        //     return
        // }

        modal.append(player, 'button', 'create', 'Создать транспорт')
        modal.append(player, 'button', 'back', '<< Назад')

        modal.append(player, 'empty')

        if(player.vehicle) modal.append(player, 'input', 'selectVehicleIn', `Выбрать ${vehicles.getModel(player.vehicle.id)} #${player.vehicle.id}`)
        modal.append(player, 'input', 'selectVehicleForID', 'Выбрать по ID')

        modal.append(player, 'empty')

        const all = container.all('vehicles')
        for(var key in all)
        {
            modal.append(player, 'button', `selectVehicle-${all[key].id}`, `${all[key].model} ${vehicles.getTypeName(parseInt(key))} #${parseInt(key)}`, '', {
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
                // if(!defaultVehicle)return user.notify(player, 'Не удалось открыт меню создания транспорта', 'error')

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
                modal.append(player, 'button', '_exit', 'Закрыть')

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
                        modal.toggle(player, false)
                    }
                }
            }
            else if(id === 'back') admin.fastAdminMenu(player, userid)
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
                if(!vehicles.isState(id))return user.notify(player, 'Транспорт не найден', 'error')

                admin.vehicleManager(player, veh.id)
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
                && user.getAdmin(player) >= 5)
            {
                modal.reset(player)
                modal.header(player, 'Админка', 'Менеджер домов')

                modal.append(player, 'button', 'create', 'Создать дом/квартиру')
                modal.append(player, 'empty')

                modal.append(player, 'input', 'selectHouseForID', 'Выбрать по ID')
                modal.append(player, 'button', 'back', '<< Назад')

                modal.append(player, 'empty')

                const all = container.all('houses')
                for(var key in all)
                {
                    modal.append(player, 'button', `selectHouse-${all[key].id}`, `${enums.housesType[all[key].type]} ${enums.housesClass[all[key].class]} #${all[key].id}`, '', {
                        descr: `Владелец: ${all[key].owner.name}/nСтоимость: ${func.formatCash(all[key].price)}/nСтатус: ${all[key].locked ? "Закрыт" : "Открыт"}`
                    })
                }

                modal.toggle(player, true)
                player.modalTrigger = (id, value) =>
                {
                    if(id === 'create') admin.showCreateHouseMenu(player)
                    else if(id === 'back') admin.fastAdminMenu(player, userid)
                    else if(id === 'selectHouseForID')
                    {
                        const id = parseInt(value)
                        if(isNaN(id)
                            || id < 0)return user.notify(player, 'Введите ID дома/квартиры', 'error')

                        user.notify(player, 'В разработке', 'warning')
                    }

                    for(var key in all)
                    {
                        if(id === `selectHouse-${all[key].id}`)return user.notify(player, 'В разработке', 'warning')
                    }
                }
            }
            else if(id === 'bizMenu'
                && user.getAdmin(player) >= 5)
            {
                modal.reset(player)
                modal.header(player, 'Админка', 'Менеджер бизнесов')

                modal.append(player, 'button', 'create', 'Создать бизнес')
                modal.append(player, 'empty')

                modal.append(player, 'input', 'selectBizForID', 'Выбрать по ID')
                modal.append(player, 'button', 'back', '<< Назад')

                modal.append(player, 'empty')

                const all = container.all('biz')
                for(var key in all)
                {
                    modal.append(player, 'button', `selectBiz-${all[key].id}`, `${enums.bizType[all[key].type]} #${all[key].id}`, '', {
                        descr: `Владелец: ${all[key].owner.name}/nСтоимость: ${func.formatCash(all[key].price)}/nСтатус: ${all[key].locked ? "Закрыт" : "Открыт"}`
                    })
                }

                modal.toggle(player, true)
                player.modalTrigger = (id, value) =>
                {
                    if(id === 'create') admin.showCreateBizMenu(player)
                    else if(id === 'back') admin.fastAdminMenu(player, userid)
                    else if(id === 'selectBizForID')
                    {
                        const id = parseInt(value)
                        if(isNaN(id)
                            || id < 0)return user.notify(player, 'Введите ID бизнеса', 'error')

                        user.notify(player, 'В разработке', 'warning')
                    }

                    for(var key in all)
                    {
                        if(id === `selectBiz-${all[key].id}`)return user.notify(player, 'В разработке', 'warning')
                    }
                }
            }
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
