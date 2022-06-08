/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		
		module.constant('ACTION_HISTORIA_CLINICA_EVOLUCION', {
			INIT : '/HistoriaClinica/Evolucion',
			DEFAULT : '/HistoriaClinica/Evolucion/New',
			NEW : '/HistoriaClinica/Evolucion/New',
			EDIT : '/HistoriaClinica/Evolucion/Edit'
		});

	};

	return module;
})();