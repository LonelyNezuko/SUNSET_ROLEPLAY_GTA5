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

    admin.showCreateVehicleMenu = player =>
    {
        if(user.getAdmin(player) < 5)return

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
        if(!defaultVehicle)return user.notify(player, 'Не удалось открыт меню создания транспорта', 'error')

        modal.append(player, 'input', 'model', 'Модель транспорта', defaultVehicleModel)

        modal.append(player, 'select', 'type', 'Владелец транспорта', 'Игрок', {
            list: [ 'Игрок' ]
        })
        modal.append(player, 'input', 'typeID', 'ID владельца', user.getID(player))

        modal.append(player, 'input', 'color1', 'Первый цвет (RGB)', '255, 255, 255')
        modal.append(player, 'input', 'color2', 'Второй цвет (RGB)', '255, 255, 255')

        // modal.append(player, 'empty')

        modal.append(player, 'button', 'create', '~5eb05c~Создать транспорт')
        modal.append(player, 'button', '_exit', '~b05c5c~Закрыть')

        modal.toggle(player, true)
        player.modalTrigger = (id, value, elems) =>
        {
            if(id === 'create')
            {
                const ownerTypes = {
                    'Игрок': 'player'
                }

                const owner = {}
                owner[ownerTypes[elems.type]] = parseInt(elems.typeID)

                const color = []
                color.push([
                    parseInt(elems.color1.split(',')[0]),
                    parseInt(elems.color1.split(',')[1]),
                    parseInt(elems.color1.split(',')[2])
                ])
                color.push([
                    parseInt(elems.color2.split(',')[0]),
                    parseInt(elems.color2.split(',')[1]),
                    parseInt(elems.color2.split(',')[2])
                ])

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
    admin.showCreateHouseMenu = player =>
    {
        if(user.getAdmin(player) < 5)return

        modal.reset(player)
        modal.header(player, 'Админка', 'Создание дома')

        modal.append(player, 'select', 'type', 'Тип имущества', enums.housesType[0], {
            list: enums.housesType
        })
        modal.append(player, 'select', 'classes', 'Класс имущества', enums.housesClass[0], {
            list: enums.housesClass
        })
        modal.append(player, 'input', 'price', 'Стоимость', '0', {
            desc: "Устанавливается по желанию"
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

                houses.create(enums.housesType.indexOf(elems.type), enums.housesClass.indexOf(elems.classes), [ player.position.x, player.position.y, player.position.z - 1, player.position.a ], data, status =>
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

        modal.append(player, 'select', 'type', 'Тип бизнеса', enums.bizType[0], {
            list: enums.bizType
        })
        modal.append(player, 'input', 'price', 'Стоимость', '0', {
            desc: "Устанавливается по желанию"
        })

        // modal.append(player, 'empty')

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

                biz.create(enums.bizType.indexOf(elems.type), [ player.position.x, player.position.y, player.position.z, player.position.a ], data, status =>
                {
                    if(status === false)return user.notify(player, 'Не удалось создать бизнес', 'error')

                    modal.toggle(player, false)
                    user.notify(player, `Вы успешно создали бизнес #${status}`, 'warning')
                })
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
            // modal.append(player, 'empty')

            modal.append(player, 'button', 'houseMenu', '~caad40~Менеджер домов')
            modal.append(player, 'button', 'bizMenu', '~caad40~Менеджер бизнесов')
            modal.append(player, 'button', 'vehicleMenu', '~caad40~Менеджер транспорта')
        }

        // modal.append(player, 'empty')
        modal.append(player, 'button', '_exit', '~b05c5c~Закрыть')

        modal.toggle(player, true)
        player.modalTrigger = (id, value) =>
        {
            if(id === 'playerMenu') user.notify(player, 'В разработке', 'warning')
            else if(id === 'houseMenu'
                && user.getAdmin(player) >= 5)
            {
                modal.reset(player)
                modal.header(player, 'Админка', 'Менеджер домов')

                modal.append(player, 'button', 'create', '~g~Создать дом/квартиру')
                modal.append(player, 'input', 'selectHouseForID', 'Выбрать дом/квартиру по ID')

                modal.append(player, 'button', 'back', '~r~<< Назад')
                // modal.append(player, 'empty')

                const all = container.all('houses')
                for(var key in all)
                {
                    modal.append(player, 'button', `selectHouse-${all[key].id}`, `${enums.housesType[all[key].type]} ${enums.housesClass[all[key].class]} #${all[key].id}`, '')

                    // , {
                    //     desc: `
                    //         Владелец: ${all[key].owner.name}<br>
                    //         Стоимость: ${func.formatCash(all[key].price)}<br>
                    //         Статус: ${all[key].locked ? "Закрыт" : "Открыт"}`
                    // }
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
                            && id < 0)return user.notify(player, 'Введите ID дома/квартиры', 'error')

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

                modal.append(player, 'button', 'create', '~g~Создать бизнес')
                modal.append(player, 'input', 'selectBizForID', 'Выбрать бизнес по ID')

                modal.append(player, 'button', 'back', '~r~<< Назад')
                // modal.append(player, 'empty')

                const all = container.all('biz')
                for(var key in all)
                {
                    modal.append(player, 'button', `selectBiz-${all[key].id}`, `${enums.bizType[all[key].type]} #${all[key].id}`, '')

                    // , {
                    //     desc: `
                    //         Владелец: ${all[key].owner.name}<br>
                    //         Стоимость: ${func.formatCash(all[key].price)}<br>
                    //         Статус: ${all[key].locked ? "Закрыт" : "Открыт"}`
                    // }
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
                            && id < 0)return user.notify(player, 'Введите ID бизнеса', 'error')

                        user.notify(player, 'В разработке', 'warning')
                    }

                    for(var key in all)
                    {
                        if(id === `selectBiz-${all[key].id}`)return user.notify(player, 'В разработке', 'warning')
                    }
                }
            }
            else if(id === 'vehicleMenu'
                && user.getAdmin(player) >= 5)
            {
                modal.reset(player)
                modal.header(player, 'Админка', 'Менеджер транспорта')

                modal.append(player, 'button', 'create', '~g~Создать транспорт')
                modal.append(player, 'input', 'selectVehicleIn', 'Выбрать транспорт в котором сижу')

                modal.append(player, 'button', 'back', '~r~<< Назад')
                // modal.append(player, 'empty')

                const all = container.all('vehicles')
                for(var key in all)
                {
                    modal.append(player, 'button', `selectVehicle-${all[key].id}`, `${all[key].model} ${vehicles.getTypeName(parseInt(key))} #${parseInt(key)}`, '')

                    // , {
                    //     desc: `
                    //         Владелец: ${all[key].owner.name}<br>
                    //         Стоимость: ${func.formatCash(all[key].price)}<br>
                    //         Статус: ${all[key].locked ? "Закрыт" : "Открыт"}`
                    // }
                }

                modal.toggle(player, true)
                player.modalTrigger = (id, value) =>
                {
                    if(id === 'create') admin.showCreateVehicleMenu(player)
                    else if(id === 'back') admin.fastAdminMenu(player, userid)
                    else if(id === 'selectVehicleIn')
                    {
                        const veh = player.vehicle
                        if(!veh)return user.notify(player, 'Вы должны сидеть в транспорте', 'error')

                        user.notify(player, 'В разработке', 'warning')
                    }

                    for(var key in all)
                    {
                        if(id === `selectVehicle-${all[key].id}`)return user.notify(player, 'В разработке', 'warning')
                    }
                }
            }
        }
    }

    module.exports = admin
}
catch(e)
{
    logger.error('admin.js', e)
}
