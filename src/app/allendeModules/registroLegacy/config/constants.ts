export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_MEDICO_REGISTER', {
			// INIT : '/Medico',
			// DEFAULT : '/Medico/View',
			PARAMS : '/Medico/Params/',
			CONFIRM : '/Medico/Confirm',
			ERROR : '/Medico/Error'
		});

		module.constant('ACTION_USUARIO_REGISTER', {
			// INIT : '/Medico',
			// DEFAULT : '/Medico/View',
			PARAMS : '/Usuario/Params/',
			CONFIRM : '/Usuario/Confirm',
			ERROR : '/Usuario/Error'
		});
	};

	return module;
})();