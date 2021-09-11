function loading(element, data = {})
{
    if(!$('*').is(element))return

    const newElement = $(element).append(`<div class="loading"><div></div><div></div><div></div><div></div></div>`).find('.loading')
    if(data.style) $(newElement).css(data.style)

    return newElement
}