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

    let keyRepeat = false
    $('body').on('keyup', () => keyRepeat = false)
    $('body').on('keydown', elem =>
    {
        if(!$('input').is(":focus")
            && !keyRepeat)
        {
            keyRepeat = true
            rage.send('ui::tryKey', {
                key: elem.keyCode
            })
        }
    })
})
