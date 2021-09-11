function inputCode(element, data = {})
{
    if(!$('*').is(element))return

    const newElement = $(element).append(`
        <div class="input-code">
            <h5>${data.title || "Введите код"}</h5>
            <section>
                <input autofocus type="text">
                <input type="text">
                <input type="text">
                <input type="text">
            </section>
        </div>`).find('.input-code')

    function result()
    {
        let code = ''
        newElement.find('input').each((i, elem) =>
        {
            code += $(elem).val()
        })
        newElement.trigger('success', { code: code })
    }
    newElement.on('input', 'input', elem =>
    {
        const inputs = newElement.find('input')
        let count = 0

        inputs.each((i, item) =>
        {
            if($(item).val().length) count ++
        })

        if($(elem.target).val().length > 1)
        {
            const value = $(elem.target).val().replace(/\D+/g,"").split('')
            value.forEach(item =>
            {
                if(item.length > 1)return
            })

            let valueCount = 0
            for(let i = 0; i < inputs.length; i ++)
            {
                if(value[valueCount]) $(inputs[i]).val(value[valueCount ++])
            }

            if(valueCount === inputs.length)
            {
                $(elem.target).blur()
                result()
            }
            else $(inputs[valueCount]).focus()
            return
        }

        let value = $(elem.target).val().replace(/\D+/g,"")
        if(!value.length)return $(elem.target).val('')

        if(count === inputs.length)
        {
            $(elem.target).blur()
            result()
        }
        else $(inputs[Array.from(inputs).indexOf(elem.target) + 1]).focus()
    })

    newElement.error = (text) =>
    {
        newElement.find('span').remove()
        newElement.append(`<span style="width: 100%; text-align: center; margin-top: 5px; color: #ff7e7e;">${text}</span>`)
    }
    newElement.clearCode = () =>
    {
        newElement.find('input').val('')
        newElement.find('input:first-child').focus()
    }

    return newElement
}
