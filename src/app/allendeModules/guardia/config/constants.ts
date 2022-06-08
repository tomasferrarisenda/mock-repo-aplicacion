export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('COLOR_GUARDIA', {
			AZUL: 'color-azul',
			VERDE: 'btn-verde',
			NEGRO: 'color-letra-negro',
			GRIS: 'color-letra-gris',
			AMARILLO: 'btn-amarillo',
			ROJO: 'btn-rojo',
			NARANJA: 'btn-naranja'
		});

		module.constant('PRIORIDAD_PRESCRIPCION',{
			MUY_URGENTE: 'Muy Urgente',
			URGENTE: 'Urgente',
			MENOR_URGENCIA: 'Menor Urgencia',
			NO_URGENTE: 'No Urgente',
			REALIZADA: 'Realizada'

		});
	};
	
	return module;
})();