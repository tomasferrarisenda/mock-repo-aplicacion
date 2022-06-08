/**
 * @author 			emansilla
 * @description 	description
 */
import userTemplate = require("../views/user-view.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };
	
	module.init = function (ngModule) {

		ngModule.config(routes);

		routes.$inject = ['$stateProvider'];

		function routes ($stateProvider)
		{
			$stateProvider.state({
				name:'user',
				url: '/User',
				parent : 'signed',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});

			$stateProvider.state({
				name:'user.view',
				url: '/View',
				template: userTemplate,
				controller: 'UserViewController',
				controllerAs: 'userView',
				data : {
					module : 'USER',
					path : '/User/View'
				}
			});
		}
	};

	return module;
})();