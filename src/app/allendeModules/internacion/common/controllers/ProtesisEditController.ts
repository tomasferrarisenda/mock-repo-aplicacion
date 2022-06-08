/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProtesisEditController', ProtesisEditController);

		ProtesisEditController.$inject = ['Logger', '$q', '$filter',
			'InternacionCommonDataService', 'ProtesisDataService', 'ProtesisLogicService', 'ModalService',
			'Title', 'Module', '$uibModalInstance', 'Protesis'];

		function ProtesisEditController ($log, $q, $filter,
			InternacionCommonDataService, ProtesisDataService, ProtesisLogicService, ModalService,
			Title, Module, $uibModalInstance, Protesis) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProtesisEditController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;
			vm.today = new Date();

			vm.title = {
				module : Module,
				page : Title
			};

			vm.data = {
				protesisActual : {},
				tiposGestion : [],
				tiposPreadmision : [],
				prioridadesProtesis : [],
				depositosProtesis : [],
				proveedoresPreAdmision : [],
				dificultadesGestion : [],
				estadosProtesisAutorizacion : [],
				estadosProtesisEsterilizacion : [],
				estadosProtesisVerificacion : []
			};

			vm.formControl = {
				error: true,
				loading: false,
				ok : returnProtesis,
				cancel : cancel,

				addProveedor : addProveedorPreadmision
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function inicializarVariables () {
			}

			function crearProtesis () {
				var protesis = vm.data.protesisActual;

				protesis.fecha_recepcion_probable = $filter('date')(protesis.fecha_recepcion_probable, 'MM/dd/yyyy');

				angular.copy(protesis, Protesis);

				return protesis;
			}

			function returnProtesis () {
				var protesis = crearProtesis();

				$uibModalInstance.close(protesis);
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			function addProveedorPreadmision () {
				var _proveedor;

				ModalService.prompt('Nombre de la marca', '', functionModal);

				function functionModal (pResult) {
					if (pResult) {
						
						_proveedor = ProtesisLogicService.crearProveedorPreadmision(pResult);

						ProtesisDataService.addOneProveedorPreAdmision(_proveedor)
						.then(addProveedorPreadmisionOk);
					}
				}

				function addProveedorPreadmisionOk () {
					ModalService.success('Nueva marca agregada');
					// Actualizo la lista de proveedores
					ProtesisDataService.getAllProveedoresPreAdmision()
					.then(function (pProveedores) {
						vm.data.proveedoresPreAdmision = pProveedores;
						$log.debug('AgregarProveedor-GetAllProveedoresPreAdmision OK.-');
					});
				}
			}



			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-');
				inicializarVariables();
				vm.formControl.loading = true;

				var _proveedores = ProtesisDataService.getAllProveedoresPreAdmision();
				var _dificultadesGestion = InternacionCommonDataService.getAllDificultadesGestion();
				var _tiposGestion = ProtesisDataService.getAllTiposProtesisGestion();
				var _tiposPreadmision = ProtesisDataService.getAllTipoProtesisPreadmision();
				var _prioridadesProtesis = ProtesisDataService.getAllPrioridadProtesis();
				var _depositosProtesis = ProtesisDataService.getAllDepositoProtesis();
				var _estadosProtesisAutorizacion = ProtesisDataService.getAllEstadoProtesisAutorizacion();
				var _estadosProtesisEsterilizacion = ProtesisDataService.getAllEstadoProtesisEsterilizacion();
				var _estadosProtesisVerificacion = ProtesisDataService.getAllEstadoProtesisVerificacion();

				$q.all([_proveedores, _dificultadesGestion, _tiposGestion, _tiposPreadmision, _prioridadesProtesis,
					_depositosProtesis, 
					_estadosProtesisAutorizacion, _estadosProtesisEsterilizacion, _estadosProtesisVerificacion])
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				vm.data.proveedoresPreAdmision = pResults[0];
				vm.data.dificultadesGestion = pResults[1];
				vm.data.tiposGestion = pResults[2];
				vm.data.tiposPreadmision = pResults[3];
				vm.data.prioridadesProtesis = pResults[4];
				vm.data.depositosProtesis = pResults[5];
				vm.data.estadosProtesisAutorizacion = pResults[6];
				vm.data.estadosProtesisEsterilizacion = pResults[7];
				vm.data.estadosProtesisVerificacion = pResults[8];

				if (Protesis) {
					angular.copy(Protesis, vm.data.protesisActual);
					if (vm.data.protesisActual.fecha_recepcion_probable)
						vm.data.protesisActual.fecha_recepcion_probable = new Date(Protesis.fecha_recepcion_probable);
				} else {
					vm.data.protesisActual.PrioridadProtesis = {
						id : 49,
						nombre : 'PRINCIPAL'
					};
				}


				vm.formControl.loading = false;
			}

			function activateError (pError) {
				$log.error('Error', pError);
				vm.formControl.loading = false;
				vm.formControl.error = true;
			}
		}
	};

	return module;

})();