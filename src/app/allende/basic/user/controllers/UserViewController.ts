/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };
	
	module.init = function (ngModule) {

		ngModule.controller('UserViewController', UserViewController);

		UserViewController.$inject = ['User', 'Logger', 'TITLE_USER'];

		function UserViewController (User, $log, TITLE_USER) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UserViewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			
			vm.tituloPagina = TITLE_USER.MODULE;
			vm.nombrePagina = TITLE_USER.VIEW;
			vm.dataLoading = false;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			vm.data = {
				user: User
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				// body
			}
		}
	};

	return module;
})();