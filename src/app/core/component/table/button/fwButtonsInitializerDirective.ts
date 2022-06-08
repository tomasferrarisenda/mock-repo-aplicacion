/**
 * @author:			Ezequiel Mansilla
 * @description:	Inicializador de botones
 * @type:			Directive
 **/
import fwButtonsTemplate = require('./fwButtonsTemplate.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwButtonsInitializer', fwButtonsInitializer);

		fwButtonsInitializer.$inject = ['$log'];
		function fwButtonsInitializer ($log) : any {
			return {
				restrict : 'E',
				template : fwButtonsTemplate,
				// controller : fwButtonsInitializerController,
				link: link
			};

			function link () {
				// $log.debug('fwButtonsInitializer linked');
			}
		}
		
		fwButtonsInitializerController.$inject = ['Logger', '$scope', '$rootScope'];
		function fwButtonsInitializerController($log, $scope, $rootScope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwButtonsInitializerController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			$scope.pageChanged = pageChanged;

			/* ------------------------------------------ IMPLEMENTACION ------------------------------------------ */

			function pageChanged(buttons, idTable) {
				$rootScope.$broadcast('fw-table-buttons-change-event', {
					buttons : buttons,
					idTable : idTable
				});
			}
		}
	};

	return module;
})();