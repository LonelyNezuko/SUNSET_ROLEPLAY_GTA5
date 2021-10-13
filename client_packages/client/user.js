const logger = require('./client/modules/logger')

try
{
    const ui = require('./client/ui/index')

    const enums = require('./client/modules/enums')
    const func = require('./client/modules/func')

    const user = {}

    user.adminLevel = 0

    user.showHelper = null

    user.toggleHud = toggle =>
    {
        mp.game.ui.displayRadar(toggle)

        ui.call('UI::hud', {
            cmd: 'update',
            data: {
                show: toggle,
                helper: user.showHelper
            }
        })

        if(!toggle)
        {
            ui.call('UI::chat', {
                cmd: 'hide'
            })
        }
        else
        {
            ui.call('UI::chat', {
                cmd: 'show',
                data: !user.adminLevel ? false : true
            })
        }

        if(!toggle)
        {
            ui.call('UI::hud', {
                cmd: 'update',
                data: {
                    helper: null
                }
            })
        }
    }

    user.camera = null
    user.cameraEdit = false

    user.setCamera = (position, atCoord, data = {}) =>
    {
		if(user.camera) user.destroyCamera()

		user.camera = mp.cameras.new('default', position, new mp.Vector3(0, 0, 0), data.fov ? data.fov : 40)
		user.camera.pointAtCoord(atCoord[0], atCoord[1], atCoord[2])

		user.camera.setActive(true)
		if(data.render === undefined
            || data.render === true) mp.game.cam.renderScriptCams(true, data.ease ? true : false, data.ease ? data.ease : 0, false, false)
    }
    user.destroyCamera = (data = {}) =>
    {
        if(!user.camera)return
        if(!data.renderDisable || data.renderDisable === false) mp.game.cam.renderScriptCams(false, data.ease ? true : false, data.ease ? data.ease : 0, false, false)

        user.camera.destroy()
        user.camera = null

        if(data.cameraEditDisable)
        {
            user.cameraEdit = false
            ui.call('UI', {
                cmd: "cameraEdit",
                data: false
            })
        }
    }
    user.setCameraToPlayer = (data = {}) =>
    {
        const playerPosition = mp.players.local.position
        const cameraPosition = func.getCameraOffset(new mp.Vector3(playerPosition.x, playerPosition.y, playerPosition.z + (data.height || 0.5)), mp.players.local.getHeading() + (data.angle || 90), data.dist || 1.5)

        user.setCamera([ cameraPosition.x, cameraPosition.y, cameraPosition.z ], [ playerPosition.x, playerPosition.y, playerPosition.z + (data.height || 0.5)], {
            ease: data.ease
        })
        // user.cameraEdit = edit

        // ui.call('UI', {
        //     cmd: "cameraEdit",
        //     data: edit
        // })
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
            else
            {
                user.escStatus = false

                clearTimeout(user.escStatusTimer)
                user.escStatusTimer = null
            }
        }
    }

    user.notify = (text, type = 'success') =>
    {
        ui.call('UI::alert', {
            cmd: 'show',
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
        if(!gender) mp.players.local.model = mp.game.joaat('mp_m_freemode_01')
        else mp.players.local.model = mp.game.joaat('mp_f_freemode_01')

		mp.players.local.setHeadBlendData(
			settings.genetic.mother,
			settings.genetic.father,
			0,

			settings.genetic.mother,
			settings.genetic.father,
			0,

			settings.genetic.similarity,
			settings.genetic.skinTone,
			0,

			true
		) // Родословность

        mp.players.local.setComponentVariation(2, settings.hair.head, 0, 0) // Волосы на голове
        mp.players.local.setHairColor(settings.hair.color, 0) // Цвет волос на голове

        mp.players.local.setHeadOverlay(1, settings.hair.beard, !settings.hair.beard ? 0.0 : 100.0, settings.hair.color, settings.hair.color) // Волосы на лице
        mp.players.local.setHeadOverlay(2, settings.hair.eyebrow, !settings.hair.eyebrow ? 0.0 : 100.0, settings.hair.color, settings.hair.color) // Брови
        mp.players.local.setHeadOverlay(10, settings.hair.breast, !settings.hair.breast ? 0.0 : 100.0, settings.hair.color, settings.hair.color) // Волосы на теле

        mp.players.local.setEyeColor(settings.appearance[0]) // Цвет глаз
        mp.players.local.setHeadOverlay(0, settings.appearance[1], !settings.appearance[1] ? 0 : 100.0, 0, 0) // Пятна на лице
        mp.players.local.setHeadOverlay(3, settings.appearance[2], !settings.appearance[2] ? 0 : 100.0, 0, 0) // Старение
        mp.players.local.setHeadOverlay(6, settings.appearance[3], !settings.appearance[3] ? 0 : 100.0, 0, 0) // Цвет лица
        mp.players.local.setHeadOverlay(7, settings.appearance[4], !settings.appearance[4] ? 0 : 100.0, 0, 0) // Повреждения кожи
        mp.players.local.setHeadOverlay(8, settings.appearance[5], !settings.appearance[5] ? 0.0 : 100.0, settings.appearance[6], 0) // Губная помада (цвет помады)
        mp.players.local.setHeadOverlay(9, settings.appearance[7], !settings.appearance[7] ? 0 : 100.0, 0, 0) // Родинки
        mp.players.local.setHeadOverlay(11, settings.appearance[8], !settings.appearance[8] ? 0 : 100.0, 0, 0) // Пятна на теле

        for(var i = 0; i < 20; i ++) mp.players.local.setFaceFeature(i, settings.face[i])
    }
    user.setClothes = (clothes, logger) =>
    {
        if(typeof clothes !== 'object')return

        if(logger) logger.log('user.setClothes', clothes)
        for(var key in clothes) mp.players.local.setComponentVariation(enums.clothesComponentID[key], clothes[key], 0, 0)
    }


    user.save = () =>
    {
        mp.events.callRemote('client::user:save')
    }

    user.toggleActionText = (toggle, keyName = 'E', desc = 'для взаимодействия') =>
    {
        ui.call('UI::hud', {
            cmd: 'update',
            data: {
                helper: !toggle ? null : `Нажмите ~${keyName}~ ${desc}`
            }
        })
        user.showHelper = !toggle ? null : `Нажмите ~${keyName}~ ${desc}`
    }


    user.timer = () =>
    {
        ui.call('UI::hud', {
            cmd: 'update',
            data: {
                date: new Date().getTime().toString(),
                serverDate: new Date().getTime().toString(),
                region: func.getStreetNames()
            }
        }, false)
    }

    user.marker = null
    user.markerBlip = null
    user.markerColshape = null
    user.markerEnabled = false

    user.setMarker = (x, y, z, dimension = -1, name = '') =>
    {
        if(user.marker) user.destroyMarker()
        if(dimension === -1) dimension = mp.players.local.dimension

        user.marker = mp.markers.new(1, new mp.Vector3(x, y, z), 1,
        {
            color: [255, 255, 255, 100],
            dimension: dimension
        })
        user.markerBlip = mp.blips.new(1, new mp.Vector3(x, y, z),
        {
            name: name.length ? name : 'Маркер',
            scale: 1,
            dimension: dimension
        })

        user.marker.name = name
        user.markerEnabled = false
    }
    user.destroyMarker = () =>
    {
        if(!user.marker)return

        user.marker.destroy()
        user.markerBlip.destroy()

        user.marker = null
    }
    user.setRaceMarker = (x, y, z, dimension = -1, name = '') =>
    {
        if(user.marker) user.destroyMarker()
        if(dimension === -1) dimension = mp.players.local.dimension

        user.marker = mp.markers.new(2, new mp.Vector3(x, y, z), 1,
        {
            color: [255, 255, 255, 100],
            dimension: dimension,
            scale: 5.0
        })
        user.markerBlip = mp.blips.new(1, new mp.Vector3(x, y, z),
        {
            name: name.length ? name : 'Маркер',
            scale: 1,
            dimension: dimension
        })

        user.marker.name = name
        user.markerEnabled = false
    }

    user.setPos = (x, y, z, a = -1, vw = -1) =>
    {
        mp.events.callRemote('client::user:setPos', x, y, z, a, vw)
    }

    exports = user
}
catch(e)
{
    logger.error('user.js', e)
}
