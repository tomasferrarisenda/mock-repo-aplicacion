/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		
		module.constant('ACTION_HISTORIA_CLINICA_COMMON', {
			INIT : '/HistoriaClinica',
			DEFAULT : '/HistoriaClinica/Home',
			HOME : '/HistoriaClinica/Home',
			ABOUT : '/HistoriaClinica/About'
		});

	};

	return module;
})();