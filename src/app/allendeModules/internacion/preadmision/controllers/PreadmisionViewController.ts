/**
 * @author 			emansilla
 * @description 	description
 */
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PreadmisionViewController', PreadmisionViewController);

		PreadmisionViewController.$inject = [
			'Logger', '$uibModalInstance',
			'User', 'PreadmisionDataService', 'PrintType', 'SupportDataService',
			'Title', 'Module'
		];
		
		function PreadmisionViewController (
			$log, $uibModalInstance,
			User, PreadmisionDataService, PrintType, SupportDataService: ISupportDataService,
			Title, Module) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionViewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.today = new Date();
			vm.numeroSolicitud = PreadmisionDataService.idSolicitud;
			vm.title = {
				module : Module,
				page : Title
			};

			// data contiene los datos que se traen desde la base de datos.
			vm.data = {
				user : User,
				firmaMedico : '',
				solicitud : {}
			};

			// formControl son métodos que manejan el formulario y la página.
			vm.formControl = {
				externo: PreadmisionDataService.externo || false,
				error: true,
				dataLoading: true,
				esOrdenInternacion: false,
				esPedidoMaterial: false,
				esRP: false,
				reloadPage: activate
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function inicializarVariables () {
				vm.data.user = User;
				vm.data.solicitud = {};

				vm.formControl.externo = PreadmisionDataService.externo || false;
				vm.formControl.error = true;
				vm.formControl.dataLoading = true;
				vm.formControl.esOrdenInternacion = false;
				vm.formControl.esPedidoMaterial = false;
				vm.formControl.esRP = false;
			}

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.esOrdenInternacion = false;
				vm.formControl.esRP = false;
				vm.formControl.esPedidoMaterial = false;
				vm.formControl.esVer = false;

				switch (PrintType) {
					case 'PrintOrden':
						vm.formControl.esOrdenInternacion = true;
						break;
					// case 'PrintPresupuesto':
					// 	vm.formControl.esPresupuesto = true;
					// 	break;
					case 'PrintRP':
						vm.formControl.esRP = true;
						break;
					case 'PrintPedidoMateriales':
						vm.formControl.esPedidoMaterial = true;
						break;
					default:
						vm.formControl.esVer = true;
						break;
				}
						
				PreadmisionDataService.getOneSolicitudPreadmision(vm.numeroSolicitud)
				.then(activateOk, activateError);
			}

			function activateOk (pSolicitud) {
				var _error;

				SupportDataService.getFirmaMedico(pSolicitud.matricula_medico_solicitante)
				.then(function (pFirma) {
					vm.data.firmaMedico = 'data:image/jpeg;base64,' + pFirma.Stream;
				});

				vm.data.solicitud = pSolicitud;
				vm.formControl.dataLoading = false;
				vm.formControl.error = false;

				if (vm.formControl.esPedidoMaterial && !vm.data.solicitud.ProtesisPreadmision.length) {
					_error = {
						message: 'No hay prótesis'
					};
					$uibModalInstance.dismiss(_error);
					$log.debug('Inicializar DISMISS.-');
				} else if (!vm.formControl.esVer){
					setTimeout(function (){ window.print(); }, 1000);
					$log.debug('Inicializar print.-');
				}

				$log.debug('Inicializar OK.-');
			}

			function activateError (pError) {
				vm.formControl.dataLoading = false;
				$log.error('Inicializar ERROR.-', pError);
				$uibModalInstance.dismiss(pError);
			}
		}
	};

	return module;

})();