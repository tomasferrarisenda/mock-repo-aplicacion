/**
 * @author 			emansilla
 * @description 	description
 */
import loginTemplate = require("../views/login.html");
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(routes);

		routes.$inject = ['$stateProvider'];

		function routes ($stateProvider)
		{
			$stateProvider.state({
				name: 'login',
				url : '/Login',
				template: loginTemplate,
				controller: 'AuthenticationController',
				controllerAs: 'login'
			});
			
			$stateProvider.state(
			{
				name : 'loginmparams',
				url : '/Login/ParamsMedico/{matricula}',
				template: loginTemplate,
				controller: 'AuthenticationMedicoController',
				controllerAs: 'login',
				data : {
					userRequired : false
				}
			});

			$stateProvider.state(
			{
				name : 'loginuparams',
				url : '/Login/ParamsUsuario/{nombreLegacy}',
				template: loginTemplate,
				controller: 'AuthenticationUsuarioController',
				controllerAs: 'login',
				data : {
					userRequired : false
				}
			});

			$stateProvider.state(
			{
				name : 'loginOk',
				url: '/LoginOk/{userName}/{token}?redirecTo',
				template: '<sa-login-ok></sa-login-ok>',
				data : {
					userRequired : false
				}
			});
		}
	};

	return module;

})();