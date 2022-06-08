/**
 * @author 			
 * @description 	description
 */
import * as angular from 'angular';
import { ISucursalDataService } from '../services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SucursalSelectorController', SucursalSelectorController);

		// Inyección de Dependencia
		SucursalSelectorController.$inject = ['Logger', '$uibModalInstance', 'SucursalDataService',
			'Title', 'User'];

		// Constructor del Controller
		function SucursalSelectorController ($log, $uibModalInstance, SucursalDataService: ISucursalDataService,
			Title, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SucursalSelectorController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				page: Title
			};

			vm.formData = {
				sucursalSeleccionada : null
			};

			vm.data = {
				sucursales : []
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

				if (vm.formData.sucursalSeleccionada && !angular.isUndefined(vm.formData.sucursalSeleccionada.id_sucursal))
					_flag=true;

				return _flag;
			}

			function cancel () {
				$uibModalInstance.dismiss('close');
			}

			function returnMutual () {
				$uibModalInstance.close(vm.formData.sucursalSeleccionada);
			}

			/* OTROS */

			function inicializarVariables () {
				vm.data.sucursales = [];
			}

 			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();
			
			function activate () {
				$log.debug('Inicializar ON.-');
				inicializarVariables();
				vm.formControl.loading = true;

				SucursalDataService.getAllSucursalesSinTodas()
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				vm.formControl.loading = false;
				vm.data.sucursales = pResults;
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