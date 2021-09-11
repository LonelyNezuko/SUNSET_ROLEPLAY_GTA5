$(document).ready(() =>
{
    $('body').on('focus', 'button', elem =>
    {
        setTimeout(() =>
        {
            $(elem.target).blur()
        }, 100)
    })
    $('body').on('click', elem =>
    {
        const onclick = $(elem.target).attr('data-onclick')
        if(onclick) eval(onclick)
    })    
})
