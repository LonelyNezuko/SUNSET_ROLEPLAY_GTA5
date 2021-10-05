const logger = require('./modules/logger')
try
{
    const user = require('./user')

    const menuList = require('./modules/menuList')
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

        menuList.reset(player)
        menuList.header(player, 'Админка', 'Создание транспорта')

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

        menuList.append(player, 'inputs', 'model', 'Модель транспорта', defaultVehicleModel)

        menuList.append(player, 'choice', 'type', 'Владелец транспорта', 'Игрок', {
            list: [ 'Игрок' ]
        })
        menuList.append(player, 'inputs', 'typeID', 'ID владельца', user.getID(player))

        menuList.append(player, 'inputs', 'color1', 'Первый цвет (RGB)', '255, 255, 255')
        menuList.append(player, 'inputs', 'color2', 'Второй цвет (RGB)', '255, 255, 255')

        menuList.append(player, 'empty')

        menuList.append(player, 'normal', 'create', '~g~Создать транспорт')
        menuList.append(player, 'normal', '_exit', '~r~Закрыть')

        menuList.toggle(player, true)
        player.menuListTrigger = (id, value, elems) =>
        {
            if(id === 'create')
            {
                try
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
                    menuList.toggle(player, false)
                }
                catch(e)
                {
                    logger.error('', e)
                    user.notify(player, 'Что-то пошло не так. Проверьте еще раз все данные', 'error')
                }
            }
        }
    }
    admin.showCreateHouseMenu = player =>
    {
        if(user.getAdmin(player) < 5)return

        menuList.reset(player)
        menuList.header(player, 'Админка', 'Создание дома')

        menuList.append(player, 'choice', 'type', 'Тип имущества', enums.housesType[0], {
            list: enums.housesType
        })
        menuList.append(player, 'choice', 'classes', 'Класс имущества', enums.housesClass[0], {
            list: enums.housesClass
        })
        menuList.append(player, 'inputs', 'price', 'Стоимость', '0', {
            desc: "Устанавливается по желанию"
        })

        menuList.append(player, 'empty')

        menuList.append(player, 'normal', 'create', '~g~Создать дом')
        menuList.append(player, 'normal', '_exit', '~r~Закрыть')

        menuList.toggle(player, true)
        player.menuListTrigger = (id, value, elems) =>
        {
            if(id === 'create')
            {
                const data = {}

                if(parseFloat(elems.price) > 0) data.price = parseFloat(elems.price)
                data.dimension = player.dimension

                houses.create(enums.housesType.indexOf(elems.type), enums.housesClass.indexOf(elems.classes), [ player.position.x, player.position.y, player.position.z - 1, player.position.a ], data, status =>
                {
                    if(status === false)return user.notify(player, 'Не удалось создать дом', 'error')

                    menuList.toggle(player, false)
                    user.notify(player, `Вы успешно создали дом #${status}`, 'warning')
                })
            }
        }
    }
    admin.showCreateBizMenu = player =>
    {
        if(user.getAdmin(player) < 5
            || !enums.bizType.length)return

        menuList.reset(player)
        menuList.header(player, 'Админка', 'Создание бизнеса')

        menuList.append(player, 'choice', 'type', 'Тип бизнеса', enums.bizType[0], {
            list: enums.bizType
        })
        menuList.append(player, 'inputs', 'price', 'Стоимость', '0', {
            desc: "Устанавливается по желанию"
        })

        menuList.append(player, 'empty')

        menuList.append(player, 'normal', 'create', '~g~Создать бизнес')
        menuList.append(player, 'normal', '_exit', '~r~Закрыть')

        menuList.toggle(player, true)
        player.menuListTrigger = (id, value, elems) =>
        {
            if(id === 'create')
            {
                const data = {}

                if(parseFloat(elems.price) > 0) data.price = parseFloat(elems.price)
                data.dimension = player.dimension

                biz.create(enums.bizType.indexOf(elems.type), [ player.position.x, player.position.y, player.position.z, player.position.a ], data, status =>
                {
                    if(status === false)return user.notify(player, 'Не удалось создать бизнес', 'error')

                    menuList.toggle(player, false)
                    user.notify(player, `Вы успешно создали бизнес #${status}`, 'warning')
                })
            }
        }
    }


    admin.fastAdminMenu = (player, userid = -1) =>
    {
        if(!user.getAdmin(player))return
        if(userid === -1) userid = player.id

        menuList.reset(player)
        menuList.header(player, 'Админка', 'Быстрое меню')

        menuList.append(player, 'inputs', 'playerMenu', 'Управление игроком', userid)

        if(user.getAdmin(player) >= 5)
        {
            menuList.append(player, 'empty')

            menuList.append(player, 'normal', 'houseMenu', '~g~Менеджер домов')
            menuList.append(player, 'normal', 'bizMenu', '~g~Менеджер бизнесов')
            menuList.append(player, 'normal', 'vehicleMenu', '~g~Менеджер транспорта')
        }

        menuList.append(player, 'empty')
        menuList.append(player, 'normal', '_exit', '~r~Закрыть')

        menuList.toggle(player, true)
        player.menuListTrigger = (id, value) =>
        {
            if(id === 'playerMenu') user.notify(player, 'В разработке', 'warning')
            else if(id === 'houseMenu'
                && user.getAdmin(player) >= 5)
            {
                menuList.reset(player)
                menuList.header(player, 'Админка', 'Менеджер домов')

                menuList.append(player, 'normal', 'create', '~g~Создать дом/квартиру')
                menuList.append(player, 'inputs', 'selectHouseForID', 'Выбрать дом/квартиру по ID')

                menuList.append(player, 'normal', 'back', '~r~<< Назад')
                menuList.append(player, 'empty')

                const all = container.all('houses')
                for(var key in all)
                {
                    menuList.append(player, 'normal', `selectHouse-${all[key].id}`, `${enums.housesType[all[key].type]} ${enums.housesClass[all[key].class]} #${all[key].id}`, '')

                    // , {
                    //     desc: `
                    //         Владелец: ${all[key].owner.name}<br>
                    //         Стоимость: ${func.formatCash(all[key].price)}<br>
                    //         Статус: ${all[key].locked ? "Закрыт" : "Открыт"}`
                    // }
                }

                menuList.toggle(player, true)
                player.menuListTrigger = (id, value) =>
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
                menuList.reset(player)
                menuList.header(player, 'Админка', 'Менеджер бизнесов')

                menuList.append(player, 'normal', 'create', '~g~Создать бизнес')
                menuList.append(player, 'inputs', 'selectBizForID', 'Выбрать бизнес по ID')

                menuList.append(player, 'normal', 'back', '~r~<< Назад')
                menuList.append(player, 'empty')

                const all = container.all('biz')
                for(var key in all)
                {
                    menuList.append(player, 'normal', `selectBiz-${all[key].id}`, `${enums.bizType[all[key].type]} #${all[key].id}`, '')

                    // , {
                    //     desc: `
                    //         Владелец: ${all[key].owner.name}<br>
                    //         Стоимость: ${func.formatCash(all[key].price)}<br>
                    //         Статус: ${all[key].locked ? "Закрыт" : "Открыт"}`
                    // }
                }

                menuList.toggle(player, true)
                player.menuListTrigger = (id, value) =>
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
                menuList.reset(player)
                menuList.header(player, 'Админка', 'Менеджер транспорта')

                menuList.append(player, 'normal', 'create', '~g~Создать транспорт')
                menuList.append(player, 'normal', 'selectVehicleIn', 'Выбрать транспорт в котором сижу')

                menuList.append(player, 'normal', 'back', '~r~<< Назад')
                menuList.append(player, 'empty')

                const all = container.all('vehicles')
                for(var key in all)
                {
                    menuList.append(player, 'normal', `selectVehicle-${all[key].id}`, `${all[key].model} ${vehicles.getTypeName(parseInt(key))} #${parseInt(key)}`, '')

                    // , {
                    //     desc: `
                    //         Владелец: ${all[key].owner.name}<br>
                    //         Стоимость: ${func.formatCash(all[key].price)}<br>
                    //         Статус: ${all[key].locked ? "Закрыт" : "Открыт"}`
                    // }
                }

                menuList.toggle(player, true)
                player.menuListTrigger = (id, value) =>
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
