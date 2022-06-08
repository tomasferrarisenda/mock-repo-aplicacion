/**
 * @author 			Jorge Basiluk
 * @description 	description
 */
import * as angular from 'angular';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SociedadSelectorController', SociedadSelectorController);

		// Inyección de Dependencia
		SociedadSelectorController.$inject = ['Logger', '$q', '$uibModalInstance', 'SociedadDataService',
			'Module', 'Title'];

		// Constructor del Controller
		function SociedadSelectorController ($log, $q, $uibModalInstance, SociedadDataService,
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
				sociedadSeleccionada : null
			};

			vm.data = {
				sociedades : []
			};

			vm.formControl = {
				loading : false,
				noResult: true,
				ok: returnSociedad,
				cancel : cancel,
				reloadPage : activate,
				validarForm : validarForm
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function validarForm () {
				var _flag = false;

				if (vm.formData.sociedadSeleccionada && !angular.isUndefined(vm.formData.sociedadSeleccionada.Id))
					_flag=true;

				return _flag;
			}

			function cancel () {
				$uibModalInstance.dismiss('close');
			}

			function returnSociedad () {
				$uibModalInstance.close(vm.formData.sociedadSeleccionada);
			}

			/* OTROS */

			function inicializarVariables () {
				vm.data.sociedades = [];
			}

 			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();
			
			function activate () {
				//$log.debug('Inicializar ON.-');
				inicializarVariables();
				vm.formControl.loading = true;
				var _sociedades = SociedadDataService.getAllSociedades();
				$q.all([_sociedades])
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				vm.formControl.loading = false;
				vm.data.sociedades = pResults[0];
			}

			function activateError (pError) {
				$uibModalInstance.dismiss(pError);
				$log.error('Inicializar ERROR.-', pError);
			}
		}
	};
	return module;

})();