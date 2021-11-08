const logger = require('./client/modules/logger')

try
{
	const ui = require('./client/ui/index')
	const user = require('./client/user')

	const chat = require('./client/chat')

	mp.events.add({
		'server::chat:open': admin =>
		{
			ui.call('UI::chat', {
				cmd: 'toggleInput',
				data: true
			})
            user.cursor(true, false)
		},
        'server::chat:close': () =>
        {
			ui.call('UI::chat', {
				cmd: 'toggleInput',
				data: false
			})
            user.cursor(false, true)
        },
        'ui::chat::send': text =>
        {
			if(text[0] === '/'
                || text[0] === '!')
            {
                const command = text.split(' ')[0].replace('!', '').replace('/', '')

                const args = text.trim().split(' ')
                args.splice(0, 1)

                let strArgs = ''
                args.forEach(item => strArgs += item + ' ')

                mp.events.callRemote('client::goCommand', command, strArgs.trim())
            }
			else mp.events.callRemote('client::chat:send', text)
        },
		'ui::hud:prompt': data =>
		{
			data = JSON.parse(data)

			mp.events.callRemote('client::user:promptTrigger', data.response)
			user.cursor(false, true)
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
