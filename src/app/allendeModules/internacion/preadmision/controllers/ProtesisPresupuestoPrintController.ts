/**
 * @author 			emansilla
 * @description 	description
 */
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProtesisPresupuestoPrintController', ProtesisPresupuestoPrintController);

		ProtesisPresupuestoPrintController.$inject = [
			'Logger', '$uibModalInstance',
			'User', 'PreadmisionDataService', 'SupportDataService',
			'Title', 'Module'
		];
		
		function ProtesisPresupuestoPrintController (
			$log, $uibModalInstance,
			User, PreadmisionDataService, SupportDataService: ISupportDataService,
			Title, Module) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProtesisPresupuestoPrintController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.today = new Date();
			vm.numeroSolicitud = PreadmisionDataService.idSolicitud;
			vm.title = {
				module : Module,
				page : Title + vm.numeroSolicitud
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
				reloadPage: activate,
				print : print,
				show : show,
				hide : false
			};

			vm.protesis = {
				totalPresupuesto: 0
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function inicializarVariables () {
				vm.data.user = User;
				vm.data.solicitud = {};

				vm.formControl.externo = PreadmisionDataService.externo || false;
				vm.formControl.error = true;
				vm.formControl.dataLoading = true;
				vm.formControl.hide = true;
			}

			function print () {
				vm.formControl.hide = true;
				calcularTotal();
				
				setTimeout(function (){ window.print(); }, 10);
			}

			function show () {
				vm.formControl.hide = false;
				vm.protesis.totalPresupuesto = 0;
			}

			function calcularTotal () {
				if (vm.data.solicitud.ProtesisPreadmision != null) {
					for (var i = 0; i < vm.data.solicitud.ProtesisPreadmision.length; i++) {

						if (vm.data.solicitud.ProtesisPreadmision[i].presupuesto != null &&
							vm.data.solicitud.ProtesisPreadmision[i].seleccionada)
							vm.protesis.totalPresupuesto +=  vm.data.solicitud.ProtesisPreadmision[i].presupuesto;
					};
				}
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				$log.info('Inicializar ON.-');
						
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

				if (!vm.data.solicitud.ProtesisPreadmision.length) {
					_error = {
						message: 'No hay prótesis'
					};
					$uibModalInstance.dismiss(_error);
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