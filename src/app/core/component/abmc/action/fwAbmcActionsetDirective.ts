/**
 * @author:			Ezequiel Mansilla
 * @description:	Lista de acciones de ABMC
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwAbmcActionset', fwAbmcActionset);

		fwAbmcActionset.$inject = ['$log'];
		function fwAbmcActionset ($log) {
			return {
				restrict : 'E',
				require : ['^fwAbmcContainer', 'fwAbmcActionset'],
				scope : {
					service : '<'
				},
				controller: AbmcActionsetController,
				link: link
			};

			function link (scope, element, attrs, controllers) {
				$log.debug('fwAbmcActionset linked');
				var fwAbmcContainerController = controllers[0];
				var fwAbmcActionsetController = controllers[1];

				fwAbmcActionsetController.setDataService(scope.service);
				fwAbmcContainerController.setActionService(fwAbmcActionsetController.getActionService());
			}
		}

		AbmcActionsetController.$inject = ['Logger', '$injector', 'AbmcActionService', 'AbmcAction'];
		function AbmcActionsetController($log, $injector, AbmcActionService, AbmcAction) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AbmcActionsetController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var action = {
				dataService : '',
				actions : Array<any>()
			};
			
			var vm = this;
			vm.setDataService = setDataService;
			vm.addAction = addAction;
			vm.getActionService = getActionService;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function setDataService(pDataService) {
				var _service = $injector.get(pDataService);
				if (_service) {
					action.dataService = _service;
				} else {
					$log.error('El data service no se encontró');
				}

			}

			function addAction(pAction) {
				var a = AbmcAction.build(pAction);
				if (a.isValid()) action.actions.push(a);
			}

			function getActionService() {
				return action;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate() {
				action = AbmcActionService.build(action);
			}
		}
	};

	return module;
})();