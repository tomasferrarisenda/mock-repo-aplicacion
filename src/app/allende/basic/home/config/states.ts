/**
 * @author 			emansilla
 * @description 	description
 */
import homeTemplate = require("../views/home.html");
import homeSistemasTemplate = require("../views/sistemas.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(routes);

		routes.$inject = ['$urlRouterProvider', '$stateProvider'];

		function routes ($urlRouterProvider, $stateProvider)
		{
			$urlRouterProvider.when('/Home', '/Home/Sistemas');

			$stateProvider.state({
				name : 'homesistemas',
				parent : 'signed',
				url: '/Home/Sistemas',
				params : {
					moduleName : ''
				},
				template: homeSistemasTemplate,
				controller: 'HomeSistemaController',
				controllerAs: 'vm',
				data : {
					module : 'HOME',
					title: 'Home - Sistemas habilitados',
					icon : 'HOME'
				}
			});
		}
	};

	return module;
})();