/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PreadmisionDeleteController', PreadmisionDeleteController);

		// Inyeccion de dependencia
		PreadmisionDeleteController.$inject = ['Logger', '$q', '$uibModalInstance', 'User', 'PreadmisionDataService'];
		
		// Constructor del Controller
		function PreadmisionDeleteController ($log, $q, $uibModalInstance, User, PreadmisionDataService) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionDeleteController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			// En todas los controllers.
			vm.constante = {
				idSolicitud: PreadmisionDataService.idSolicitud
			};

			vm.data = {
				solicitud: {}					
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false,
				validarOk : validarForm,
				cancel : cancelarModal,
				ok : anularSolicitudPreadmision
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function validarForm () {
				var _flag = false;
				return _flag;
			}

			function cancelarModal () {
				$uibModalInstance.dismiss('Anulación cancelada.');
			}

			function anularSolicitudPreadmision () {
				$log.debug('AnularSolicitudPreadmision ON.-');
				PreadmisionDataService.anularSolicitudPreAdmision(vm.data.solicitud, User)
				.then(function (pResult) {
					$log.debug('AnularSolicitudPreadmision OK.-');
					$uibModalInstance.close('Solicitud anulada');
				}, function (pError) {
					$log.debug('AnularSolicitudPreadmision ERROR.-', pError);
					$uibModalInstance.dismiss(pError);
				});
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				$log.debug('Inicializar ON.-');

				var _solicitud = PreadmisionDataService.getOneSolicitudPreadmision(vm.constante.idSolicitud);

				$q.all([_solicitud])
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				$log.debug('Inicializar OK.-', pResults);
				vm.formControl.loading = false;
				vm.data.solicitud = pResults[0];
				vm.data.solicitud.usuario_baja = User.userName;
			}

			function activateError (pError) {
				$log.error('Inicializar ERROR.-');
				vm.formControl.loading = false;
				$uibModalInstance.dismiss(pError.message);
			}
		}
	};

	return module;
})();