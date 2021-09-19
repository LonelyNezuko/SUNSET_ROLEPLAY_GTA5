require('./admin')
require('./dev')
require('./vehicles')
require('./houses')

const [ commandsAdd, commands ] = require('./_commandsAdd')

const user = require('../user')
const logger = require('../modules/logger')

const vehicles = require('../property/vehicles')

mp.events.add('client::goCommand', (player, command, args) =>
{
    command = commands[command]
    if(!command)return user.notify(player, 'Данная команда не найден', 'error')

    if(command.settings)
    {
        if(command.settings.admin
            && user.getAdmin(player) < command.settings.admin)return user.notify(player, 'Ты не админ!', 'error')

        if(command.settings.isInVehicle
            && !player.vehicle)return user.notify(player, 'Вы должны сидеть в транспорте', 'error')
        if(command.settings.isInVehicle
            && command.settings.vehicleRights
            && !vehicles.isRights(player.vehicle.id, player))return user.notify(player, 'У Вас нет доступа к этому транспорту', 'error')
    }

    const argsParse = args.split(' ')
    argsParse.forEach((item, i) =>
    {
        if(item === '') argsParse[i] = undefined
    })

    command.func(player, args, argsParse)
})
