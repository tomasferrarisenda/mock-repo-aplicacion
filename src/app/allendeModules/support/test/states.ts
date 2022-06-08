/**
 * @author:			Ezequiel Mansilla
 * @description:	States para test
 * @type:			Route
 */
import testTemplate = require('./testListTemplate.html');
import carouselTempalte = require('./carouselTemplate.html');

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		// Definimos la ruta por defecto
		function states ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Test', '/Test/List');

			$stateProvider.state('signed.test', {
				url: '/Test/List',
				template: carouselTempalte,
				controller: 'TestController',
				controllerAs: 'vm'
			});
		}
	};

	return module;

})();