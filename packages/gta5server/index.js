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
		npc.add([ -80.0335693359375, 6341.1884765625, 31.490365982055664, 38.13648223876953, 0 ], 'rentMoto', 'Арендодатель транспорта', 'csb_denise_friend', {
			desc: "Арендовать мопед",
			blip: 512,
			blipName: "Арендодатель мопедов"
		})
	})
}
catch(e)
{
	logger.error(`Mode Start`, e)
}
