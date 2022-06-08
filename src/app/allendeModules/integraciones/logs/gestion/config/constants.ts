/**
 * @author 			jbasiluk
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_LOGS', {
			INIT : '/Logs/Gestion',
			LIST : '/Logs/Gestion/List'
		});

	};

	return module;
})();