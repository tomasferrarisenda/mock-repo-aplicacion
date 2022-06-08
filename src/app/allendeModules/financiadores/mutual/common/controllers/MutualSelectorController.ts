/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('MutualSelectorController', MutualSelectorController);

		// Inyección de Dependencia
		MutualSelectorController.$inject = ['Logger', '$q', '$uibModalInstance', 'MutualDataService',
			'Module', 'Title'];

		// Constructor del Controller
		function MutualSelectorController ($log, $q, $uibModalInstance, MutualDataService,
			Module, Title) {

			/* ------------------------------------------------- LOG ------------------------------------------------- */

			$log = $log.getInstance(this.constructor.name);
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				module: Module,
				page: Title
			};

			vm.formData = {
				mutualSeleccionada : null
			};

			vm.data = {
				mutuales : []
			};

			vm.formControl = {
				loading : false,
				noResult: true,
				ok: returnMutual,
				cancel : cancel,
				reloadPage : activate,
				validarForm : validarForm
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function validarForm () {
				var _flag = false;

				if (vm.formData.mutualSeleccionada && !angular.isUndefined(vm.formData.mutualSeleccionada.id_mutual))
					_flag=true;

				return _flag;
			}

			function cancel () {
				$uibModalInstance.dismiss('close');
			}

			function returnMutual () {
				$uibModalInstance.close(vm.formData.mutualSeleccionada);
			}

			/* OTROS */

			function inicializarVariables () {
				vm.data.mutuales = [];
			}

 			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();
			
			function activate () {
				$log.debug('Inicializar ON.-');
				inicializarVariables();
				vm.formControl.loading = true;

				var _mutuales = MutualDataService.getAllOldMutual();

				$q.all([_mutuales])
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				vm.formControl.loading = false;
				vm.data.mutuales = pResults[0];
				// vm.data.planes = pResults[1];
				// getPage();
				$log.debug('Inicializar OK.-', pResults);
			}

			function activateError (pError) {
				$uibModalInstance.dismiss(pError);
				$log.error('Inicializar ERROR.-', pError);
			}
		}
	};
	return module;

})();