const menuList =
{
    toggle: toggle =>
    {
        if(!toggle)
        {
            $('#menuList').removeClass('menuList-show')
            rage.send('ui::menuList:close')
        }
        else if(!$('input').is(":focus")) $('#menuList').addClass('menuList-show')
    },

    header: (title, desc) =>
    {
        $('#menuList header h1').text(title)
        $('#menuList header span').text(desc)
    },
    reset: () =>
    {
        menuList.header('', '')
        $('#menuList .wrap').html('')
    },

    append: (type = 'empty', id = '', title = '', value = '', data = {}) =>
    {
        if(type === 'choice'
            && !data.list) data.list = []

        const colors = [
            { index: 'r', color: 'red' },
            { index: 'g', color: 'green' },
            { index: 'b', color: 'blue' },
            { index: 'y', color: 'yellow' },
            { index: 'p', color: 'purple' },
            { index: 'q', color: 'pink' },
            { index: 'o', color: 'orange' },
            { index: 'c', color: 'grey' },
            { index: 'm', color: 'darkgrey' },
            { index: 'u', color: 'black' }
        ]

        colors.forEach(item => title = title.replace(`~${item.index}~`, `<span style="color: ${item.color};">`))
        title = title.replace(`~h~`, `<span style="font-weight: bold;">`)

        $('#menuList .wrap').append(`
            <section class="${type} ${type === 'normal' && !value.length ? 'center' : ''}" data-id="${id}" ${type === 'choice' ? `data-list='${JSON.stringify(data.list)}'` : ""} ${data.desc ? `data-desc="${data.desc}"` : ""}>
                ${type !== 'normal' && type !== 'choice' && type !== 'inputs' ? '' : `<h1>${title}</h1>`}
                ${type === 'normal' ? `<h2>${value}</h2>` : type === 'choice' ? `<div><button></button><h2>${value}</h2><button></button></div>` : type === 'inputs' ? `<input type="text" placeholder=" " value="${value}">` : ''}
            </section>`)

        if($('#menuList .wrap section:not(.empty)').length === 1) menuList.select($('#menuList .wrap section:not(.empty)'))
    },
    select: elem =>
    {
        $('#menuList .desc').removeClass('desc-show')

        $('#menuList .wrap section').removeClass('select')
        $('#menuList .wrap section input').blur()

        elem.addClass('select')
        if(elem.attr('data-desc'))
        {
            $('#menuList .desc span').text(elem.attr('data-desc'))
            $('#menuList .desc').addClass('desc-show')
        }

        if(elem.hasClass('inputs')) elem.find('input').focus()
        $('#menuList .wrap').scrollTop(elem.offset().top - $('#menuList .wrap').offset().top)
    },

    enter: elem =>
    {
        const value = elem.hasClass('normal') ? elem.find('h2').text() : elem.hasClass('choice') ? elem.find('div h2').text() : elem.hasClass('inputs') ? elem.find('input').val() : ''
        const id = elem.attr('data-id')

        rage.send('ui::menuList:trigger', {
            id: id,
            value: value
        })
    }
}

$(document).ready(() =>
{
    rage.addEvent('UI::menuList', value =>
    {
        switch(value.cmd)
        {
            case 'toggle':
            {
                menuList.toggle(value.data)
                break
            }
            case 'reset':
            {
                menuList.reset()
                break
            }
            case 'append':
            {
                menuList.append(value.data.type, value.data.id, value.data.title, value.data.data)
                break
            }
            case 'header':
            {
                menuList.header(value.data.title, value.data.desc)
            }
        }
    })

    $('body').append(`
        <div id="menuList">
    		<div class="wrapper">
    			<header>
    				<h1>Создать ТС</h1>
    				<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit..</span>
    			</header>
    			<div class="wrap">
    			</div>
    		</div>
    		<div class="desc">
    			<h1>Подсказка</h1>
    			<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur totam nostrum quae placeat, commodi quia est, quaerat in libero nemo eligendi ab esse inventore. Animi, non recusandae maxime. Placeat, delectus?</span>
    		</div>
    	</div>`)

    $('body').on('keydown', elem =>
    {
        if((elem.keyCode === 40
            || elem.keyCode === 38)
            && $('#menuList').hasClass('menuList-show'))
        {
            const itemSelect = $('#menuList .wrap section.select')
            let itemNext

            if(!itemSelect.length
                || (!itemSelect.next().length
                    && elem.keyCode === 40)
                || (itemSelect.next().hasClass('empty')
                    && elem.keyCode === 40)) itemNext = $('#menuList .wrap section:not(.empty)').first()
            else if((!itemSelect.prev().length
                && elem.keyCode === 38)
                || (itemSelect.prev().hasClass('empty')
                    && elem.keyCode === 38)) itemNext = $('#menuList .wrap section:not(.empty)').last()
            else itemNext = elem.keyCode === 40 ? itemSelect.next() : itemSelect.prev()

            menuList.select(itemNext)
        }
        if((elem.keyCode === 37
            || elem.keyCode === 39)
            && $('#menuList').hasClass('menuList-show')
            && $('#menuList .wrap section.choice.select'))
        {
            const list = JSON.parse($('#menuList .wrap section.choice.select').attr('data-list'))
            let value = $('#menuList .wrap section.choice.select div h2').text()

            if(!list.length)return

            if(list.indexOf(value) === -1
                || (elem.keyCode === 39
                    && list.indexOf(value) >= list.length - 1)) value = list[0]
            else if(elem.keyCode === 37
                && list.indexOf(value) <= 0) value = list[list.length - 1]
            else value = elem.keyCode === 39 ? list[list.indexOf(value) + 1] : list[list.indexOf(value) - 1]

            $('#menuList .wrap section.choice.select').find('div h2').text(value)
        }
        if(elem.keyCode === 13
            && $('#menuList').hasClass('menuList-show')
            && $('#menuList .wrap section.select'))
        {
            menuList.enter($('#menuList .wrap section.select'))
        }
        if(elem.keyCode === 27
            && $('#menuList').hasClass('menuList-show')) menuList.toggle(false)
    })
})
