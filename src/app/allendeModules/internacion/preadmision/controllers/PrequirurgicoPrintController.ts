/**
 * @author 			emansilla
 * @description 	description
 */
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PrequirurgicoPrintController', PrequirurgicoPrintController);

		PrequirurgicoPrintController.$inject = ['Logger', '$uibModalInstance', 'PreadmisionDataService',
			'SupportDataService',
			'User'
		];
		
		function PrequirurgicoPrintController ($log, $uibModalInstance, PreadmisionDataService,
			SupportDataService: ISupportDataService,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrequirurgicoPrintController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();
			vm.title = {
				page : 'Prequirurgicos',
				module: 'PREADMISION'
			};
			vm.numeroSolicitud = PreadmisionDataService.idSolicitud;

			vm.data = {
				user : User,
				firmaMedico : '',
				solicitud : {}
			};

			vm.formControl = {
				error: true,
				loading: true,
				reloadPage: activate
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function inicializarVariables () {
				vm.data.user = User;
				vm.data.solicitud = {};
				vm.formControl.error = true;
				vm.formControl.loading = true;
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

				if (pSolicitud.Prequirurgicos && pSolicitud.Prequirurgicos.length) {

					SupportDataService.getFirmaMedico(pSolicitud.matricula_medico_solicitante)
					.then(function (pFirma) {
						vm.data.firmaMedico = 'data:image/jpeg;base64,' + pFirma.Stream;
					});

					vm.data.solicitud = pSolicitud;
					vm.formControl.loading = false;
					vm.formControl.error = false;

					setTimeout(function (){ window.print(); }, 1000);
					$log.debug('Inicializar OK.-', pSolicitud);
				} else {
					_error = {
						message: 'Sin prequirurgicos.'
					};
					activateError(_error);
				}
			}

			function activateError (pError) {
				vm.formControl.loading = false;
				$uibModalInstance.dismiss(pError);
				$log.error('Inicializar-GetOneSolicitudPreadmision ERROR.-', pError);
			}
		}
	};

	return module;

})();