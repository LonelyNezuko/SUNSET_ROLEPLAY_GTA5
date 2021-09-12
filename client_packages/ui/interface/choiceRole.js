const choiceRole =
{
    toggle: toggle =>
    {
        if(!toggle)
        {
            $('#choiceRole .choiceRole-elem:nth-child(1), #choiceRole .choiceRole-elem:nth-child(3)').animate({
                top: '200%',
                opacity: '0'
            }, 1000)
            $('#choiceRole .choiceRole-elem:nth-child(2)').animate({
                top: '-200%',
                opacity: '0'
            }, 1000)

            setTimeout(() => $('#choiceRole').removeClass('choiceRole-show'), 1200)
        }
        else
        {
            $('#choiceRole').addClass('choiceRole-show')
            setTimeout(() =>
            {
                $('#choiceRole .choiceRole-elem').animate({
                    top: '0',
                    opacity: '1'
                }, 1000)
            })
        }
    },
    go: id =>
    {
        rage.send('ui::choiceRole', {
            id: id
        })
    }
}

$(document).ready(() =>
{
    rage.addEvent('UI::choiceRole', value =>
    {
        switch(value.cmd)
        {
            case 'toggle':
            {
                choiceRole.toggle(value.data)
                break
            }
        }
    })

    $('body').append(`
        <div id="choiceRole">
    		<section class="choiceRole-elem">
    			<div class="bg" style="background-image: url(src/images/choiceRole/tourist.jpeg);"></div>

    			<h1>Турист</h1>
    			<section class="desc">
    				Вы - прилетевший со своей родины турист, хотевший посмотреть на достопримечательности Лос Сантоса и его округа.
    				<br>
    				Но Лос Сантос оказался не такой прекрасный и красочный, как это говорят по ТВ и пишут в журналах. Не успев выйти из аэропорта, Вам предлагают услуги такси: "Довезем, куда угодно" - говорил водитель.
    				<br>
    				Вы подумали, что быстрее будет доехать на такси и согласились. Но не успев оглянуться во круг, Вы оказались где-то в лесу. Таксист потребовал с Вас Ваши деньги или он убьет Вас. Вы отдали деньги таксисту и он, оставив Вас, уехал.
    				<br>
    				Теперь Вы один в лесу и Вам необходимо отыскать транспорт, чтобы доехать хотя бы до города, не говоря уж про перелет обратно на родину...
    			</section>
    			<div class="choiceRole-receive">
    				<h2>При старте Вы получите:</h2>
    				<div>
    					<section>
    						<img src="src/images/inventory/xiaomi.png">
    						<h6>Телефон Xiaomi</h6>
    					</section>
    					<section>
    						<img src="src/images/inventory/cash.png">
    						<h6>Наличные: <span style="color: #69e840; font-weight: bold;">250$</span></h6>
    					</section>
    					<section>
    						<img src="src/images/inventory/clothes_set.png">
    						<h6>Комлпект одежды туриста</h6>
    					</section>
    					<section>
    						<img src="src/images/choiceRole/hotel.png">
    						<h6>Номер в отеле на 3 дня</h6>
    					</section>
    				</div>
    			</div>
    			<div class="btn">
    				<button class="button" onclick="choiceRole.go(1)">Начать игру</button>
    			</div>
    		</section>
    		<section class="choiceRole-elem">
    			<div class="bg" style="background-image: url(src/images/choiceRole/rich.jpg);"></div>

    			<h1>Бывший миллионер</h1>
    			<section class="desc">
    				Вы - миллионер, покаривший Лос Сантос и добившийся всего, чего хотели от жизни. Но в прошлом...
    				<br>
    				Ныне же Вы банкрот, потерявший все из-за обмана Вашего лучшего друга, с которым Вы начали свой путь и которому Вы доверяли больше, чем себе.
    				<br>
    				Из оставшишся средств у Вас остался лишь Ваш телефон, немного налички и личный счет в банке, который был заморожен. Поблуждав несколько дней и пожив в отелях на последние деньги Вы решаетесь начать все заного.
    				<br>
    				В Ваших планах заного обрести богатства, известность, а так же отыскать своего, уже бывшего, друга и взыскать с него все долги...
    			</section>
    			<div class="choiceRole-receive">
    				<h2>При старте Вы получите:</h2>
    				<div>
    					<section>
    						<img src="src/images/inventory/iphone.png">
    						<h6>Телефон Iphone</h6>
    					</section>
    					<section>
    						<img src="src/images/inventory/cash.png">
    						<h6>Наличные: <span style="color: #69e840; font-weight: bold;">500$</span><br>Замороженный счет в банке: <span style="color: #69e840; font-weight: bold;">3000$</span></h6>
    					</section>
    					<section>
    						<img src="src/images/inventory/clothes_set.png">
    						<h6>Комлпект одежды миллионера</h6>
    					</section>
    					<section>
    						<img src="src/images/choiceRole/bad_health.png">
    						<h6>Ухудшенное здоровье<br>(Здоровье ухудшается раз в 30 минут)</h6>
    					</section>
    				</div>
    			</div>
    			<div class="btn">
    				<button class="button" onclick="choiceRole.go(2)">Начать игру</button>
    			</div>
    		</section>
    		<section class="choiceRole-elem">
    			<div class="bg" style="background-image: url(src/images/choiceRole/homeless.jpg);"></div>

    			<h1>Бездомный Лос Сантоса</h1>
    			<section class="desc">
    				Вы - бездомный Лос Сантоса, живущий под мостом. Вы спокойно живете своей жизнью и не влипаете в неприятности.
    				<br>
    				Но вот, в один момент, Вас переклинило и Вы решаетесь, что все, пора с этим заканчивать.
    				<br>
    				Посидев и обдумав все по лучше Вы составляете план своего рассвета и уже представляете, как Вы будуте рассекать улицы Лос Сантоса на самой дорогой тачке, с наркотой и шлюхами, и жить в прекрасном доме на ВайнВуде.
    				<br>
    				Составив план действий Вы начинаете действовать...
    			</section>
    			<div class="choiceRole-receive">
    				<h2>При старте Вы получите:</h2>
    				<div>
    					<section>
    						<img src="src/images/choiceRole/x2salary.png">
    						<h6>Трудолюбие<br>(Зарплаты на работах в 2 раза выше)</h6>
    					</section>
    					<section>
    						<img src="src/images/inventory/cash.png">
    						<h6>Наличные: <span style="color: #69e840; font-weight: bold;">50$</span></h6>
    					</section>
    					<section>
    						<img src="src/images/inventory/clothes_set.png">
    						<h6>Комлпект одежды бездомного</h6>
    					</section>
    					<section>
    						<img src="src/images/choiceRole/good_health.png">
    						<h6>Улучшенное здоровье<br>(Здоровье восстанавливается раз в 30 минут)</h6>
    					</section>
    				</div>
    			</div>
    			<div class="btn">
    				<button class="button" onclick="choiceRole.go(3)">Начать игру</button>
    			</div>
    		</section>
    	</div>`)

    // choiceRole.toggle(true)
})
