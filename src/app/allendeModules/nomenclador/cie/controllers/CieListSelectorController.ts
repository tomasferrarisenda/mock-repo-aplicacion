/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('CieListSelectorController', CieListSelectorController);

		// Inyección de Dependencia
		CieListSelectorController.$inject = [
			'Logger', '$filter', '$q', '$uibModalInstance',
			'CieDataService', 
			'Title', 'Module'
		];

		// Constructor del Controller
		function CieListSelectorController (
			$log, $filter, $q, $uibModalInstance,
			CieDataService,
			Title, Module) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CieListSelectorController');
			$log.debug('ON.-');

				/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;
				vm.title = {
					module : Module,
					page: Title
				};

				vm.formData = {
					// Información del formulario
					capitulo : '',
					subCapitulo : '',
					diagnostico : '',
					enfermedad : ''
				};

				vm.data = {
					// Información traida desde la BD
					capitulos: [],
					subCapitulos: [],
					diagnosticos : [],
					enfermedades: [],
					allEnfermedades : [],
					objeto: {}
				};

				vm.formControl = {
					// Manejo del formulario
					error : true,
					loading : false,
					valid : validarForm,

					ok : returnEnfermedad,
					cancel : cancel,

					getSubcapitulos : getSubcapitulos,
					getDiagnosticos : getDiagnosticos,
					getEnfermedades : getEnfermedades
				};

				/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

 				/* FORMULARIO */

 				function validarForm () {
 					if (vm.formData.enfermedad && vm.formData.enfermedad.titulo_cie_enfermedad)
 						return true;
 					else
 						return false;
 				}

 				function cancel () {
 					$uibModalInstance.dismiss('close');
 				}

 				function returnEnfermedad () {
 					$uibModalInstance.close(vm.formData.enfermedad);
 				}

 				function getSubcapitulos () {
 					$log.debug('Get SubCapitulos ON.-');
 					vm.formData.subCapitulo = '';
 					vm.formData.diagnostico= '';
 					vm.formData.enfermedad = '';
					vm.data.subCapitulos = [];
					vm.data.diagnosticos = [];
					vm.data.enfermedades = vm.data.allEnfermedades;
 					if (vm.formData.capitulo) {
 						// $log.debug('Get SubCapitulos Cap OK.-');
	 					CieDataService.GetSubCapitulosByCapitulo(vm.formData.capitulo)
	 					.then(function (pSubCapitulos) {
	 						// $log.debug('Get SubCapitulos OK.-');
	 						vm.data.subCapitulos = pSubCapitulos;
	 					});
 					}
 				}

 				function getDiagnosticos () {
 					$log.debug('Get Diagnosticos ON.-');
 					vm.formData.diagnostico = '';
 					vm.formData.enfermedad = '';	
					vm.data.diagnosticos = [];
					vm.data.enfermedades = vm.data.allEnfermedades;
 					if (vm.formData.subCapitulo) {
 						// $log.debug('Get Diagnosticos SubCap OK.-');
	 					CieDataService.GetDiagnosticosBySubCapitulo(vm.formData.subCapitulo)
	 					.then(function (pDiagnosticos) {
	 						// $log.debug('Get Diagnosticos OK.-');
	 						vm.data.diagnosticos = pDiagnosticos;
	 					});
 					} 
 				}

 				function getEnfermedades () {
 					$log.debug('Get Enfermedades ON.-');
 					vm.formData.enfermedad = '';
					vm.data.enfermedades = vm.data.allEnfermedades;
 					if (vm.formData.diagnostico) {
 						// $log.debug('Get Enfermedades Diag OK.-');
	 					CieDataService.GetEnfermedadesByDiagnostico(vm.formData.diagnostico)
	 					.then(function (pEnfermedades) {
	 						// $log.debug('Get Enfermedades OK.-');
	 						vm.data.enfermedades = pEnfermedades;
	 					});
 					} 
 				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();
				
				function activate () {
					$log.debug('Inicializar ON.-');
					// inicializarVariables();
					vm.formControl.loading = true;

					$q.all([
						CieDataService.GetCapitulos(),
						CieDataService.GetEnfermedades()
					])
					.then(activateOk, activateError);
				}

				function activateOk (pResults) {
					vm.formControl.loading = false;
					vm.formControl.error = false;
					vm.data.capitulos = pResults[0];
					vm.data.enfermedades = pResults[1];
					vm.data.allEnfermedades = pResults[1];
					$log.debug('Inicializar OK.-', pResults);
				}

				function activateError (pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}

				
			};
	};

	return module;

})();