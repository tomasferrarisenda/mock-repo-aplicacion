/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$urlRouterProvider'];

		function states ($urlRouterProvider)
		{
			$urlRouterProvider.when('/Persona', '/Paciente');
		}
	};

	return module;

})();