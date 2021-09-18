const logger = require('./client/modules/logger')

try
{
	const ui = require('./client/ui/index')
	const user = require('./client/user')

	const chat = require('./client/chat')

	mp.events.add({
		'ui::hud:openChat': (returns = false) =>
		{
			if(!returns) mp.events.callRemote('client::hud:openChat')
			else
			{
				user.cursor(true, false)
				ui.call('UI::hud', {
					cmd: 'chatOpen'
				})
			}
		},
        'ui::hud:closeChat': () =>
        {
            user.cursor(false, true)
        },
        'ui::hud:pushChat': data =>
        {
            data = JSON.parse(data)
			logger.debug('ui::hud:pushChat', data)

            switch(data.chat)
            {
                case 'chat':
                {
                    if(data.text[0] === '/'
                        || data.text[0] === '!')
                    {
                        const command = data.text.split(' ')[0].replace('!', '').replace('/', '')

                        const args = data.text.trim().split(' ')
                        args.splice(0, 1)

                        let strArgs = ''
                        args.forEach(item => strArgs += item + ' ')

                        mp.events.callRemote('client::goCommand', command, strArgs.trim())
                    }
					else mp.events.callRemote('client::chat:send', data.text)
                    break
                }
            }
        },

		'server::chat:send': (text, data) =>
		{
			chat.send(text, data)
		}
	})
}
catch(e)
{
	logger.error('events.js', e)
}
