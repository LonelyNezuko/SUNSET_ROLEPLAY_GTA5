const join =
{
    goStatus: false,
    wrapChanger: false,

    toggle: (toggle) =>
    {
        if(!toggle) $('#join').hide()
        else $("#join").show()

        if(toggle) join.wrap('auth')
    },

    wrap: (id) =>
    {
        if(join.wrapChanger
            || join.goStatus)return
        join.wrapChanger = true

        let buttonID = id
        if(id === 'recovery-name') buttonID = 'recovery'

        $('#join .header button.header-select').removeClass('header-select')
        $('#join .wrap.wrap-opened').removeClass('wrap-opened')

        $(`#join .header button[data-id=${buttonID}]`).addClass('header-select')

        $('#join .header span').css({
            left: $(`#join .header button[data-id=${buttonID}]`).offset().left
        })

        setTimeout(() =>
        {
            $(`#join .wrap[data-id=${id}]`).addClass('wrap-opened')
            join.check()

            setTimeout(() =>  join.wrapChanger = false, 700)
        }, 400)
    },
    check: () =>
    {
        const inputs = $('#join .wrap-opened .input input')
        let count = 0

        inputs.each((i, item) =>
        {
            if($(item).val().length) count ++
        })
        count === inputs.length ? $('#join .wrap-opened .join-button-go').removeAttr('disabled') : $('#join .wrap-opened .join-button-go').attr('disabled', '')
    },

    go: () =>
    {
        function goLoading()
        {
            $(`#join .wrap-opened .input span`).remove()
            join.goStatus = true

            $(`#join .wrap-opened .join-button-go`).attr('disabled', '')
            $(`#join .wrap-opened .join-button-go`).html('')

            $('#join .wrap-opened input').attr('disabled', '')
            loading(`#join .wrap-opened .join-button-go`, {
                style: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "20px",
                    height: "20px"
                }
            })
        }
        function goLoadingStop()
        {
            join.goStatus = false

            $(`#join .wrap-opened .join-button-go`).removeAttr('disabled')
            $(`#join .wrap-opened .join-button-go`).html($(`#join .wrap-opened`).attr('data-id') === 'auth' ? 'Войти' : 'Зарегистрироваться')

            $('#join .wrap-opened input').removeAttr('disabled')
        }
        function goError(input, error)
        {
            $(input).parent().find('span').remove()
            $(input).parent().append(`<span>${error}</span>`)
        }

        if($(`#join .wrap-opened .join-button-go`).attr('disabled'))return
        switch($(`#join .wrap-opened`).attr('data-id'))
        {
            case 'auth':
            {
                const
                    name = $('#join #join-auth-val-name').val(),
                    password = $('#join #join-auth-val-password').val()

                goLoading()
                rage.addEvent('client::join:result:auth', results =>
                {
                    $('body').append('<span style="color:white;">2</span>')
                    goLoadingStop()

                    if(results === 'account not found')return goError('#join-auth-val-name', 'Аккаунт не найден')
                    if(results === 'invalid password')return goError('#join-auth-val-password', 'Не верный пароль')
                })

                rage.send('ui::join', {
                    username: name,
                    password: password,
                    authRemember: $('#join #join-auth-val-remember').is(":checked"),
                    authRememberAutoLogin: $('#join #join-auth-val-auto-login').is(":checked"),
                    type: 'auth'
                })
                break
            }
            case 'reg':
            {
                const
                    name = $('#join #join-reg-val-name').val(),
                    password = $('#join #join-reg-val-password').val(),
                    passwordConfirm = $('#join #join-reg-val-password-confirm').val(),
                    email = $('#join #join-reg-val-email').val()

                function isValidEmail(emailAddress) {
                    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
                    return pattern.test(emailAddress);
                }

                if(!isValidEmail(email)
                    || email.length < 4 || email.length > 144)return goError('#join-reg-val-email', 'Некорректный Email адрес')

                if(password.length < 6 || password.length > 64)return goError('#join-reg-val-password', 'Длина пароля 6 - 64 символа')
                if(password !== passwordConfirm)return goError('#join-reg-val-password, #join-reg-val-password-confirm', 'Пароли не совпадают')

                if(name.length < 4 || name.length > 32)return goError('#join-reg-val-name', 'Длина ника 4 - 32 символа')

                goLoading()
                rage.send('ui::join', {
                    name: name,
                    password: password,
                    passwordConfirm: passwordConfirm,
                    email: email,
                    type: 'reg'
                })

                rage.addEvent('client::join:result:reg', results =>
                {
                    goLoadingStop()

                    if(results === 'account busy')return goError('#join-reg-val-name', 'Данное имя уже занято')
                    if(results === 'email busy')return goError('#join-reg-val-email', 'Данный Email адрес уже используется на другом аккаунте')

                    $(`#join .wrap-opened .btns`).remove()
                    const iCode = inputCode(`#join .wrap-opened .body`, {
                        title: 'Введите код, отправленный на Ваш Email адрес'
                    })

                    iCode.on('success', (elem, data) =>
                    {
                        if(parseInt(data.code) !== parseInt(results))
                        {
                            iCode.error(`Не верный код ${data.code} | ${results}`)
                            iCode.clearCode()

                            return
                        }

                        iCode.remove()
                        loading(`#join .wrap-opened .body`, {
                            style: {
                                width: "30px",
                                height: "30px",
                                left: "50%",
                                "margin-top": "30px"
                            }
                        })

                        rage.send('ui::join:createAccount', {
                            username: name,
                            password: password,
                            email: email
                        })
                    })
                })

                break
            }
            case 'recovery':
            {
                break
            }
            case 'recovery-name':
            {
                break
            }
        }
    }
}

$(document).ready(() =>
{
    $('body').append(`
    	<div id="join" style="display: none;">
            <div class="header">
                <button id="join-auth" data-id="auth" onclick="join.wrap('auth')">Авторизация</button>
                <button id="join-reg" data-id="reg" onclick="join.wrap('reg')">Регистрация</button>
                <!-- <button id="join-recovery" data-id="recovery" onclick="join.wrap('recovery')" style="position: relative;">Восстановление <h6 class="new">NEW</h6></button> -->

                <span></span>
            </div>
            <div class="wrap" data-id="auth">
                <div class="body">
                    <h1>Авторизация</h1>
                    <section class="inputs">
                        <div class="input">
                            <input type="text" id="join-auth-val-name" placeholder=" " maxlength="32">
                            <label for="join-auth-val-name">Игровой ник</label>
                            <svg viewBox="-42 0 512 512.002" xmlns="http://www.w3.org/2000/svg"><path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/><path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/></svg>
                        </div>
                        <div class="input">
                            <input type="password" id="join-auth-val-password" placeholder=" " maxlength="64">
                            <label for="join-auth-val-password">Пароль</label>
                            <svg viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"/></svg>
                        </div>
                    </section>
                    <!-- <section class="desc">
                        Не удается войти? <button onclick="join.wrap('recovery')">Восстановите доступ</button>
                    </section> -->
                    <section class="desc">
                        Еще нет аккаунта? <button onclick="join.wrap('reg')">Зарегистрируйтесь!</button>
                    </section>
                    <section class="desc" style="display: flex; align-items: center; justify-content: center; margin-top: 30px;">
                        <input type="checkbox" id="join-auth-val-remember" checked>
                        <label for="join-auth-val-remember" style="margin-left: 7px; cursor: pointer;">Запомнить меня</label>
                    </section>
                    <section class="desc" style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
                        <input type="checkbox" id="join-auth-val-auto-login">
                        <label for="join-auth-val-auto-login" style="margin-left: 7px; cursor: pointer;">Автоматический вход</label>
                    </section>
                    <section class="btns">
                        <button class="button join-button-go" disabled onclick="join.go()">Войти</button>
                    </section>
                </div>
                <div class="bg"></div>
            </div>
            <div class="wrap" data-id="reg">
                <div class="body">
                    <h1>Регистрация</h1>
                    <section class="inputs">
                        <div class="input">
                            <input type="text" id="join-reg-val-name" placeholder=" " maxlength="32">
                            <label for="join-reg-val-name">Придумайте ник аккаунта</label>
                            <svg viewBox="-42 0 512 512.002" xmlns="http://www.w3.org/2000/svg"><path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/><path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/></svg>
                        </div>
                        <div class="input">
                            <input type="password" id="join-reg-val-password" placeholder=" " maxlength="64">
                            <label for="join-reg-val-password">Придумайте пароль (до 64 символов)</label>
                            <svg viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"/></svg>
                        </div>
                        <div class="input">
                            <input type="password" id="join-reg-val-password-confirm" placeholder=" " maxlength="64">
                            <label for="join-reg-val-password-confirm">Введите пароль еще раз</label>
                            <svg viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"/></svg>
                        </div>
                        <div class="input">
                            <input type="email" id="join-reg-val-email" placeholder=" " maxlength="255">
                            <label for="join-reg-val-email">Введите Ваш Email (на него придет код)</label>
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><polygon points="339.392,258.624 512,367.744 512,144.896         "/><polygon points="0,144.896 0,367.744 172.608,258.624         "/><path d="M480,80H32C16.032,80,3.36,91.904,0.96,107.232L256,275.264l255.04-168.032C508.64,91.904,495.968,80,480,80z"/><path d="M310.08,277.952l-45.28,29.824c-2.688,1.76-5.728,2.624-8.8,2.624c-3.072,0-6.112-0.864-8.8-2.624l-45.28-29.856L1.024,404.992C3.488,420.192,16.096,432,32,432h448c15.904,0,28.512-11.808,30.976-27.008L310.08,277.952z"/></svg>
                        </div>
                    </section>
                    <section class="desc">
                        Уже есть аккаунт? <button onclick="join.wrap('auth')">Войдите!</button>
                    </section>
                    <section class="btns">
                        <button class="button join-button-go" disabled onclick="join.go()">Зарегистрироваться</button>
                    </section>
                </div>
                <div class="bg"></div>
            </div>
            <!-- <div class="wrap" data-id="recovery">
                <div class="body">
                    <h1>Восстановление доступа</h1>
                    <section class="inputs">
                        <div class="input">
                            <input type="text" id="join-recovery-val-name" placeholder=" " maxlength="32">
                            <label for="join-recovery-val-name">Ник аккаунта</label>
                            <svg viewBox="-42 0 512 512.002" xmlns="http://www.w3.org/2000/svg"><path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/><path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/></svg>
                        </div>
                        <div class="input">
                            <input type="email" id="join-recovery-val-email" placeholder=" " maxlength="255">
                            <label for="join-recovery-val-email">Email (на него придет код)</label>
                            <svg viewBox="-42 0 512 512.002" xmlns="http://www.w3.org/2000/svg"><path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/><path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/></svg>
                        </div>
                    </section>
                    <section class="desc">
                        <button onclick="">Я не помню Email</button>
                    </section>
                    <section class="desc">
                        <button onclick="join.wrap('recovery-name')">Я не помню ник</button>
                    </section>
                    <section class="btns">
                        <button class="button join-button-go" disabled onclick="join.go()">Восстановить</button>
                    </section>
                </div>
                <div class="bg"></div>
            </div> -->
            <div class="wrap" data-id="recovery-name">
                <div class="body">
                    <h1>Восстановление доступа: Ник</h1>
                    <section class="inputs">
                        <div class="input">
                            <input type="email" id="join-recovery-name-val-email" placeholder=" " maxlength="255">
                            <label for="join-recovery-name-val-email">Email</label>
                            <svg viewBox="-42 0 512 512.002" xmlns="http://www.w3.org/2000/svg"><path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/><path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/></svg>
                        </div>
                    </section>
                    <section class="desc">
                        <button onclick="join.wrap('recovery')">Я помню ник</button>
                    </section>
                    <section class="desc">
                        <button onclick="">Я не помню Email</button>
                    </section>
                    <section class="btns">
                        <button class="button join-button-go" onclick="join.go()">Восстановить</button>
                    </section>
                </div>
                <div class="bg"></div>
            </div>
        </div>`)

    rage.addEvent('UI::join', data =>
    {
        switch(data.cmd)
        {
            case 'toggle':
            {
                join.toggle(data.data)
                break
            }
            case 'remember':
            {
                $('#join #join-auth-val-name').val(data.data.username)
                $('#join #join-auth-val-password').val(data.data.password)

                $('#join #join-auth-val-remember').attr('checked', 'checked')
                break
            }
            case 'authLogin':
            {
                join.wrap('auth')
                join.go()
                break
            }
        }

        // if(data.username
        //     && data.toggle) $('#join #join-auth-val-name, #join #join-reg-val-name').val(data.username)
        // join.toggle(data.toggle)
    })


    $('#join').on('input', '.wrap-opened .input input', elem =>
    {
        join.check()
        $(elem.currentTarget).parent().find('span').remove()
    })
    $('#join').on('keydown', '.wrap-opened .input input', elem =>
    {
        if(elem.keyCode === 13)
        {
            const inputs = $('#join .wrap-opened .input input')
            let count = 0

            inputs.each((i, item) =>
            {
                if($(item).val().length) count ++
            })

            if(count === inputs.length
                || elem.currentTarget === inputs[inputs.length - 1]) $(elem.currentTarget).blur()
            else $(inputs[Array.from(inputs).indexOf(elem.currentTarget) + 1]).focus()
        }
    })
    $('#join').on('keydown', elem =>
    {
        if(elem.keyCode === 13) join.go()
    })
})
