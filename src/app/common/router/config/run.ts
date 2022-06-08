/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import { ICredentialsDataService } from 'core/security';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.run(runMethod);

		runMethod.$inject = ['$rootScope', '$state', '$urlRouter', '$location', '$exceptionHandler', 'Logger',
			'StorageService', 'AuthorizationService', 'CredentialsDataService', 'AllendeException', 'StateHelperService'];
			
		function runMethod ($rootScope, $state, $urlRouter, $location, $exceptionHandler, $log, 
			StorageService, AuthorizationService, CredentialsDataService: ICredentialsDataService, AllendeException, StateHelperService) {
			$log = $log.getInstance('Common.Router.Run');
			$log.debug('ON.-');
			// keep user logged in after page refresh
			
			$rootScope.globals = StorageService.get('globals') || {};

			/* --------------------------------------------- EVENTS SA --------------------------------------------- */

			$rootScope.$on('fw-menu-item-selected-event', function (event, route) {
				if (route.route === 'login' || route.route === 'signed.about') {
					$state.go(route.route);
				} else {
					$state.go('homesistemas', {moduleName: route.route});
				}
			});

			/* ------------------------------------------- EVENTS ROUTER ------------------------------------------- */

			/* LOCATION EVENTS */

			$rootScope.$on('$locationChangeStart', function () {
				// $log.warn('$locationChangeStart: CHANGED');

				// $log.debug('$locationChangeStart-Path', $location.path());
				// $log.debug('$locationChangeStart-Estado', angular.toJson($state.current));

				// redirect to login page if not logged in
				
			 	if ($rootScope.globals.currentUser) return;
				
				if ($state.current && $state.current.data && !$state.current.data.userRequired) return;
				$state.go('login')
				//window.location.href = 'https://app2dev.sanatorioallende.com/auth';
				
			});

			// $rootScope.$on('$locationChangeSuccess', function () {
			// 	$log.info('$locationChangeSuccess');
			// });

			// $rootScope.$on('$locationChangeError', function () {
			// 	$log.error('$locationChangeError');
			// });

			// $rootScope.$on('$locationChangeEnd', function () {
			// 	$log.warn('$locationChangeEnd');
			

			// $rootScope.$on('$stateChangeStart', function () {
			// 	if ($rootScope.globals.currentUser) return;
				
			// 	if ($state.current && $state.current.data && !$state.current.data.userRequired) return;
			// 	$state.go('login');
			// });
			$rootScope.$on('$stateChangeSuccess', function () {

				StateHelperService.addStateToQuote();

				if ($state.current && $state.current.data && $state.current.data.idPermiso) {
					// $log.debug('Permiso', $state.current.data.idPermiso);
					var user = CredentialsDataService.GetForce();
					var flag = AuthorizationService.tienePermisoById(user, $state.current.data.idPermiso);
					if (!flag) $state.go('error.unauthorized');
				}
			});

			$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
				var exception = new AllendeException('No se pudo ir al estado '+ toState.name, 'state');
				$log.error(exception, error);
				// $state.go('homesistemas');
				// $state.go('error');
			});
			// $rootScope.$on('$stateChangeEnd', function () {
			// 	$log.warn('$stateChangeEnd');
			// });

			// $rootScope.$on('$stateNotFound', function () {
			// 	$state.go('error.notfound');
			// });
			
			// $rootScope.$on('$locationChangeSuccess', function(e) {
				// $log.debug('$locationChangeSuccess-Path', $location.path());
				// $log.debug('$locationChangeSuccess-Estado', angular.toJson($state.current));
			// 	// UserService is an example service for managing user state
			// 	// if (UserService.isLoggedIn()) return;
			// 	if ($rootScope.globals.currentUser) return;

			// 	// Prevent $urlRouter's default handler from firing
			// 	e.preventDefault();
			// 	$log.debug('Estado actual success', $state);
			// 	if ($state.current && $state.current.data && !$state.current.data.userRequired) return;
			// 	$state.go('login');
			// 	// UserService.handleLogin().then(function() {
			// 	// 	// Once the user has logged in, sync the current URL
			// 	// 	// to the router:
			// 	// 	$urlRouter.sync();
			// 	// });
			// });
 
			// Configures $urlRouter's listener *after* your custom listener
  			$urlRouter.listen();
		}
	};

	return module;

})();