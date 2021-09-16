const logger = require('./client/modules/logger')

try
{
    const ui = require('./client/ui/index')
    const enums = require('./client/modules/enums')

    const user = {}
    user.adminLevel = 0

    user.toggleHud = toggle =>
    {
        mp.game.ui.displayRadar(toggle)

        ui.call('UI::hud', {
            cmd: 'toggle',
            data: !toggle ? 'hide-all' : ''
        })
    }

    user.camera = null
    user.cameraEdit = false

    user.setCamera = (position, atCoord, fov = 40, render = true) =>
    {
        try
        {
    		if(user.camera) user.destroyCamera()

    		user.camera = mp.cameras.new('default', position, new mp.Vector3(0, 0, 0), fov)
    		user.camera.pointAtCoord(atCoord[0], atCoord[1], atCoord[2])

    		user.camera.setActive(true)
    		if(render) mp.game.cam.renderScriptCams(true, false, 0, false, false)
        }
        catch(e)
        {
            logger.error('user.setCamera', e)
        }
    }
    user.destroyCamera = () =>
    {
        if(!user.camera)return

        mp.game.cam.renderScriptCams(false, false, 0, false, false)

        user.camera.destroy()
        user.camera = null

        user.cameraEdit = false
    }

    user.cursorStatus = false
    user.escStatus = true
    user.escStatusTimer = null

    user.cursor = (toggle, toggleESC = null) =>
    {
        mp.gui.cursor.show(toggle, toggle)
        user.cursorStatus = toggle

        if(toggleESC !== null)
        {
            if(toggleESC === true)
            {
                if(user.escStatusTimer) clearTimeout(user.escStatusTimer)
                user.escStatusTimer = setTimeout(() =>
                {
                    user.escStatus = true

                    clearTimeout(user.escStatusTimer)
                    user.escStatusTimer = null
                }, 1500)
            }
            else user.escStatus = false
        }
    }

    user.notify = (text, type = 'info') =>
    {
        ui.call('UI::hud', {
            cmd: 'notify',
            data: {
                text: text,
                type: type
            }
        })
    }

    user.setVW = vw =>
    {
        mp.events.callRemote('client::user:setVW', vw)
    }
    user.loadScreen = (toggle, duration = 500) =>
    {
        user.toggleHud(!toggle)
        toggle ? mp.game.cam.doScreenFadeOut(duration) : mp.game.cam.doScreenFadeIn(duration)
    }

    user.resetSkin = (settings, gender) =>
    {
        if(gender === 0) mp.players.local.model = mp.game.joaat('mp_m_freemode_01')
        else mp.players.local.model = mp.game.joaat('mp_f_freemode_01')

		mp.players.local.setHeadBlendData(
			settings.pedigree.one,
			settings.pedigree.two,
			0,

			settings.pedigree.one,
			settings.pedigree.two,
			0,

			settings.pedigree.looks,
			settings.pedigree.skin,
			0,

			true
		) // Родословность

        mp.players.local.setComponentVariation(2, settings.hair.head, 0, 0) // Волосы на голове
        mp.players.local.setHairColor(settings.hair.color, 0) // Цвет волос на голове

        mp.players.local.setHeadOverlay(1, settings.hair.beard, 100.0, settings.hair.color, settings.hair.color) // Волосы на лице
        mp.players.local.setHeadOverlay(2, settings.hair.eyebrow, 100.0, settings.hair.color, settings.hair.color) // Брови
        mp.players.local.setHeadOverlay(10, settings.hair.breast, 100.0, settings.hair.color, settings.hair.color) // Волосы на теле

        mp.players.local.setEyeColor(settings.appearance[0]) // Цвет глаз
        mp.players.local.setHeadOverlay(0, settings.appearance[1], 100.0, 0, 0) // Пятна на лице
        mp.players.local.setHeadOverlay(3, settings.appearance[2], 100.0, 0, 0) // Старение
        mp.players.local.setHeadOverlay(6, settings.appearance[3], 100.0, 0, 0) // Цвет лица
        mp.players.local.setHeadOverlay(7, settings.appearance[4], 100.0, 0, 0) // Повреждения кожи
        mp.players.local.setHeadOverlay(8, settings.appearance[5], 100.0, settings.appearance[6], 0) // Губная помада (цвет помады)
        mp.players.local.setHeadOverlay(9, settings.appearance[7], 100.0, 0, 0) // Родинки
        mp.players.local.setHeadOverlay(11, settings.appearance[8], 100.0, 0, 0) // Пятна на теле

        for(var i = 0; i < 20; i ++) mp.players.local.setFaceFeature(i, settings.face[i])
    }
    user.setClothes = clothes =>
    {
        for(var key in clothes) mp.players.local.setComponentVariation(enums.clothesComponentID[key], clothes[key], 0, 0)
    }


    user.save = () =>
    {
        mp.events.callRemote('client::user:save')
    }

    exports = user
}
catch(e)
{
    logger.error('user.js', e)
}
