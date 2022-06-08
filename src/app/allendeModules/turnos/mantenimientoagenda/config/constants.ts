export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('TITLE_MANTENIMIENTOAGENDA', {
			MODULE: 'MANTENIMIENTOAGENDAES',
			LIST : 'Lista de Feriados',
			VIEW : 'Detalle de Feriado'
		});

		module.constant('ACTION_MANTENIMIENTOAGENDA', {
			INIT : '/MantenimientoAgenda',
			DEFAULT : '/MantenimientoAgenda/List/Feriados',
			LIST : '/MantenimientoAgenda/List/Feriados'
		});

	};
	return module;
})();
