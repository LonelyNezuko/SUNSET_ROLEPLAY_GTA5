import $ from 'jquery'
import CircleType from 'circletype'

import './css.css'

const body = $('body')
export default function join()
{
	body.append(`
		<div id="join">
			<div class="wrap">
				<section class="join-selector join-selector-elem" id="join-selector-auth">Авторизация</section>
				<section class="join-selector" id="join-selector-reg">Регистрация</section>
				<section class="join-selector" id="join-selector-recovery">Восстановление доступа</section>
				<section class="join-selector"></section>

				<section class="join-body">
					
				</section>
			</div>
		</div>`)
}