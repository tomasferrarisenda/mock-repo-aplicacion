/**
 * @author:			Ezequiel Mansilla
 * @description:	Contenedor de ABMC
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwAbmcContainer', fwAbmcContainer);

		fwAbmcContainer.$inject = ['$log'];
		function fwAbmcContainer ($log) {
			return {
				restrict : 'E',
				controller: AbmcContainerController,
				link: link
			};

			function link (scope, element, attrs) {
				$log.debug('fwAbmcContainer linked');
			}
		}

		AbmcContainerController.$inject = ['Logger'];
		function AbmcContainerController($log) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AbmcContainerController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var abmc = {
				model : [],
				actionService : ''
			};
			
			var vm = this;
			vm.setActionService = setActionService;
			vm.setModel = setModel;
			vm.getAbmc = getAbmc;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function setActionService(pService) {
				abmc.actionService = pService;
			}

			function getAbmc() {
				return abmc;
			}

			function setModel(pModel) {
				abmc.model = pModel;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
		}
	};

	return module;
})();