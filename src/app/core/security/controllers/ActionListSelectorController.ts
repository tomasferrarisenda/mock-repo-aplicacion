/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('ActionListSelectorController',ActionListSelectorController);

		// Inyeccion de dependencia
		ActionListSelectorController.$inject = ['Logger', '$uibModalInstance', 'Actions', 'Title'];
		
		// Constructor del Controller
		function ActionListSelectorController ($log, $uibModalInstance, Actions, Title) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ActionListSelectorController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;
			vm.title = {
				page : Title 
			};

			vm.data = {
				acciones: []
			};

			vm.formControl = {
				error: true,
				loading: false,
				ok : ok,
				cancel : cancel
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function ok(pAction) {
				$uibModalInstance.close(pAction);
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-');

				vm.formControl.error = true;
				vm.formControl.loading = true;

				if (Actions.length) {
					if (Actions.length > 0) {
						if (Actions.length == 1) {
							setTimeout(function (){ ok(Actions[0]); }, 500);
						} else {
							successCallback();
						}
					}
				} else {
					$uibModalInstance.dismiss('Sin acciones');
				}

				function successCallback () {
					vm.formControl.error = false;
					vm.formControl.loading = false;
					vm.data.acciones = Actions;
					$log.debug('Inicializar OK', vm.data.acciones);
				}

				function errorCalback (pError) {
					vm.formControl.error = true;
					vm.formControl.loading = false;
					$log.error('Inicializar ERROR.-', pError);
					$uibModalInstance.dismiss(pError);
				}
			}

		}

	};

	return module;

})();