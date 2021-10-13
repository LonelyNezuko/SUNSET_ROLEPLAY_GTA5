const logger = require('./modules/logger')
logger.log('Mode Loading...')

try
{
	const mysql = require('./mysql')
	const nodemailer = require('./modules/nodemailer')

	const enums = require('./modules/enums')

	nodemailer.connect()
	mysql.connect(() =>
	{
		require('./events/events')
		require('./commands/_connect')

		require('./modules/noClip')

		const vehicles = require('./property/vehicles')
		const houses = require('./property/houses')
		const biz = require('./property/biz')

		const user = require('./user')

		const farm = require('./jobs/farm')

		vehicles.load()
		houses.load()
		biz.load()

		setInterval(() =>
		{
			vehicles.timer()
			user.timer()
		}, 1000)

		const npc = require('./modules/npc')

		npc.add([ -92.78142547607422, 6353.16064453125, 31.575790405273438, -131.6939239501953, 0 ], 'test', 'Эдвард', 'u_m_o_filmnoir', {
			desc: "Тестовый NPC"
		})
		npc.add([ -80.0335693359375, 6341.1884765625, 31.490365982055664, 38.13648223876953, 0 ], 'rentMoto', 'Эмма', 'csb_denise_friend', {
			desc: "Арендодатель мопедов",
			blip: 512,
			blipName: "Арендодатель мопедов"
		})

		npc.add([ 2437.059814453125, 4978.345703125, 46.5714225769043, 95.19161987304688, 0 ], 'job-farm', 'Шерон', 'a_m_m_farmer_01', {
			desc: "Работник фермы.",
			blip: 540,
			blipName: "Ферма"
		})
		npc.add([ 2418.80322265625, 4989.794921875, 46.15338134765625, 112.79861450195312, 0 ], 'job-farm-rent-veh', 'Венди', 'g_f_y_ballas_01', {
			desc: "Работник фермы.",
			blip: 665,
			blipName: "Ферма - Аренда транспорта"
		})

		farm._initMode()
	})
}
catch(e)
{
	logger.error(`Mode Start`, e)
}
