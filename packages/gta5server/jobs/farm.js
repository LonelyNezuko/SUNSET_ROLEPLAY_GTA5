const logger = require('../modules/logger')
const container = require('../modules/container')
const func = require('../modules/func')
const enums = require('../modules/enums')

const user = require('../user')

const farm = {}

farm.markers = [
    [],
    [
        [ 382.0253601074219, 6485.3974609375, 28.847536087036133 - 1.0, 106.69660949707031 ],
        [ 382.0025939941406, 6479.955078125, 29.411893844604492 - 1.0, 179.9263458251953 ],
        [ 382.0586853027344, 6473.57177734375, 29.94373321533203 - 1.0, -179.5072479248047 ],
        [ 379.64288330078125, 6468.61669921875, 30.28639793395996 - 1.0, -176.2471160888672 ],
        [ 378.061279296875, 6466.39111328125, 30.234756469726562 - 1.0, 122.2237548828125 ],
        [ 375.80706787109375, 6465.9189453125, 30.21690559387207 - 1.0, 65.80461883544922 ],
        [ 373.77471923828125, 6467.45458984375, 30.031009674072266 - 1.0, 39.83816909790039 ]
    ]
]

farm.setMarker = player =>
{
    if(user.getJobActive(player) !== 'farm')return

    user.setMarker(player, farm.markers[container.get('user', player.id, 'job-farm-type')][func.random(0, farm.markers[container.get('user', player.id, 'job-farm-type')].length - 1)], 0, 'Задание фермы')
    player.enterMarker = name =>
    {
        if(name === 'Задание фермы')
        {
            player.playAnimation('amb@medic@standing@kneel@base', 'base', 1, 1)
            user.destroyMarker(player)

            setTimeout(() =>
            {
                container.set('user', player.id, 'job-farm-count', container.get('user', player.id, 'job-farm-count') + 1)
                player.stopAnimation()

                if(container.get('user', player.id, 'job-farm-count') < 5)
                {
                    user.notify(player, `Вы собрали урожай. Соберите еще ${5 - container.get('user', player.id, 'job-farm-count')} раз`)
                    user.setMarker(player, farm.markers[container.get('user', player.id, 'job-farm-type')][func.random(0, farm.markers[container.get('user', player.id, 'job-farm-type')].length - 1)], 0, 'Задание фермы')
                }
                else
                {
                    user.notify(player, `Вы собрали урожай. Теперь Вы можете его сдать на склад`)
                    user.setMarker(player, [ 408.02325439453125, 6497.52978515625, 27.790050506591797 - 1.0 ], 0, 'Склад фермы')
                }
            }, 5000)
        }
        else if(name === 'Склад фермы')
        {
            if(container.get('user', player.id, 'job-farm-count') < 5) user.notify(player, `Вы еще не собрали весь урожай. Соберите еще ${5 - container.get('user', player.id, 'job-farm-count')} раз`)
            else
            {
                container.set('user', player.id, 'job-farm-count', 0)
                user.notify(player, `Вы сдали урожай и заработали ${func.formatCash(enums.jobSalary.farm[0])}. Можете продолжить собирать урожай`)

                user.getJobActiveSalary(player, enums.jobSalary.farm)
            }
            user.setMarker(player, farm.markers[container.get('user', player.id, 'job-farm-type')][func.random(0, farm.markers[container.get('user', player.id, 'job-farm-type')].length - 1)], 0, 'Задание фермы')
        }
    }
}


// Events
farm.action = player =>
{

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
                user.notify(player, `Вы закончили работу на ферме и получили ${func.formatCash(user.getJobActiveSalary(player))}`, 'error')
                user.clearJobActive(player)
            }
            else
            {
                user.notify(player, 'Вы начали работу на ферме. Теперь Вы можете Собирать пшеницу с полей')
                user.setJobActive(player, 'farm')

                container.set('user', player.id, 'job-farm-type', 1)
                container.set('user', player.id, 'job-farm-count', 0)

                farm.setMarker(player)
            }
            break
        }
    }
}

module.exports = farm
