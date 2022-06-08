/**
 * @author 			emansilla
 * @description 	description
 */

import mainTemplate = require("../templates/main.html");
import indexTemplate = require("../templates/index.html");
import errorTemplate = require("../templates/error.html");
import template401 = require("../templates/401.html");
import template404 = require("../templates/404.html");
import authErrorTemplate = require("../templates/auth-error.html");
import { ICredentialsDataService } from "core/security";

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(routes);

		routes.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];

		// Definimos la ruta por defecto
		function routes ($urlRouterProvider, $stateProvider, $locationProvider)
		{

			$urlRouterProvider.otherwise('/Home');
			
			// $locationProvider.html5Mode({
			// 	enabled: true,
			// 	requireBase: false
			// });

			$stateProvider.state({
				name : 'main',
				abstract : true,
				template : mainTemplate,
				data : {
					module: 'HOME',
					path : 'Home',
					menuIf: false,
					headerIf : true,
					userRequired: false,
					save : true
				},
				controller: RootController,
				controllerAs : 'vm'
			});

			$stateProvider.state({
				name : 'index',
				parent : 'main',
				template : indexTemplate,
				// data : {
				// 	module: 'HOME',
				// 	path : 'Home',
				// 	menuIf: false,
				// 	headerIf : true,
				// 	userRequired: false
				// },
			});

			$stateProvider.state({
				name : 'signed',
				parent : 'index',
				abstract : true,
				template : '<ui-view><sa-loading></sa-loading></ui-view>',
				data : {
					menuIf: true,
					userRequired: true
				},
				resolve : {
					User : User
				}
			});

			$stateProvider.state({
				name : 'main.signed',
				abstract : true,
				template : '<ui-view><sa-loading-page></sa-loading-page></ui-view>',
				data : {
					menuIf: true,
					userRequired: true
				},
				resolve : {
					User : User
				}
			});



			$stateProvider.state({
				name : 'onlysigned',
				template : '<ui-view><sa-loading-page></sa-loading-page></ui-view>',
				abstract : true,
				resolve : {
					User : User
				}
			});

			User.$inject = ['CredentialsDataService', '$q', '$state'];
			function User(CredentialsDataService: ICredentialsDataService, $q, $state) {
				var def = $q.defer();

				CredentialsDataService.Get()
				.then(function (pUser) {
					def.resolve(pUser);
				}, function (pError) {
					$state.go('login');
					def.reject(pError);
				});

				return def.promise;
			}

			RootController.$inject = ['$scope', '$state'];
			function RootController ($scope, $state) {
				var vm = this;

				$scope.$watch(function () {
					return $state.current.data;
				}, function(newValue) {
					vm.module = newValue.module;
					vm.path = newValue.path;
					vm.menuIf = newValue.menuIf;
					vm.headerIf = newValue.headerIf;
					
				});
			}

			$stateProvider.state({
				name :'error',
				url : '/Error',
				template: errorTemplate
			});

			$stateProvider.state({
				name :'error.notfound',
				url : '/NotFound',
				template: template404
			});

			$stateProvider.state({
				name :'error.unauthorized',
				url : '/Unauthorized',
				template: template401
			});

			$stateProvider.state({
				name :'error.auth',
				url : '/AuthError',
				template: authErrorTemplate
			});
		}
	};

	return module;
})();