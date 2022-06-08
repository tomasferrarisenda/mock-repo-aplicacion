/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('TITLE_MUTUAL', {
			MODULE : 'MUTUAL', // ADMISION
			VIEW : 'Ver mutual',
			MUTUAL_SELECTOR : 'Seleccionar Mutual',
			PLAN_SELECTOR : 'Seleccionar plan',
			PLAN_EDIT :'Editar plan',
			PLAN_NEW : 'Nuevo plan'
		});

		module.constant('ACTION_MUTUAL', {
			INIT : '/Mutual',
			DEFAULT : '/Financiadores/Mutual/View',
			VIEW : '/Financiadores/Mutual/View'
		});

		module.constant('ROL_MUTUAL', {
			ADMIN : 'Admision-Admision-Administrador'
		});

	};

	return module;

})();