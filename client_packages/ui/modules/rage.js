const rage =
{
	start: () =>
	{
		$('body').append(`
			<div id="rage-events" style="position: fixed; top: 0; left: 0; width: 0; height: 0;"></div>`)
	},

	send: (event, args = {}) =>
	{
		console.log(`rage.event: ${event} | ${args}`)
		mp.trigger(event, JSON.stringify(args))
	},
	trigger: (event, args = null, isJSON = true) =>
	{
		if(args) isJSON ? args = JSON.parse(args) : args = args
		$('#rage-events').trigger(event, args)
	},

	events: [],
	addEvent: (event, callback) =>
	{
		if(event.indexOf(event)) rage.removeEvent(event)
		rage.events.push(event)

		$('#rage-events').on(event, (elem, results) =>
		{
			callback(results)
		})

		console.log(rage.events)
	},
	removeEvent: (event) =>
	{
		const id = events.indexOf(event)
		if(id === -1)return

		rage.events.splice(id, 1)
		$('#rage-events').off(event)
	}
}
