/**
 * @author:			Ezequiel Mansilla
 * @description:	Controller para print de autorizacion de internados
 * @type:			Controller
 **/
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AutorizacionInternadoPrintController', AutorizacionInternadoPrintController);

		AutorizacionInternadoPrintController.$inject = [
			'Logger', '$uibModalInstance',
			'AdmisionDataService', 'SupportDataService', 'ModalService',
			'Title', 'IdInternacion', 'IdIntervencionAdmision', 'User'
		];

		function AutorizacionInternadoPrintController (
			$log, $uibModalInstance,
			AdmisionDataService, SupportDataService: ISupportDataService, ModalService,
			Title, IdInternacion, IdIntervencionAdmision, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AutorizacionInternadoPrintController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				// module : Module,
				page : Title
			};

			vm.data = {
				solicitud : {},
				user : User
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false,
				error : true,
				esPedidoMaterial: false,
				esOrdenInternacion: false,
				esRp: false,
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				AdmisionDataService.getOneByIntervencion(IdInternacion, IdIntervencionAdmision)
				.then(successCallback, errorCallback);

				// $q.all([])
				// .then(successCallback, errorCallback);
				
	 			function successCallback (pResults) {
	 				// variable = pResult[0];
	 				vm.data.solicitud = pResults;
	 				
	 				SupportDataService.getFirmaMedico(pResults.IntervencionAdmision.matricula_medico_cabecera)
	 				.then(function (pFirma) {
	 					vm.data.firmaMedico = 'data:image/jpeg;base64,' + pFirma.Stream;
	 				});

	 				switch (Title) {
	 					case 'Pedido de Materiales':
			 				if (vm.data.solicitud.IntervencionAdmision.ProtesisPreadmision
			 					&& vm.data.solicitud.IntervencionAdmision.ProtesisPreadmision.length ) {
			 					vm.formControl.esPedidoMaterial = true;
			 					setTimeout(function (){ window.print(); }, 1000);
			 				} else {
			 					$uibModalInstance.dismiss('sin material');
			 				}
			 				break;
			 			case 'ORDEN DE INTERNACIÓN':
			 				vm.formControl.esOrdenInternacion = true;
			 				setTimeout(function (){ window.print(); }, 1000);
			 				break;
			 			case 'RP':
			 				vm.formControl.esRp = true;
			 				setTimeout(function (){ window.print(); }, 1000);
			 				break;
	 				}

	 				vm.formControl.loading = false;
	 				vm.formControl.error = false;

	 				$log.debug('Inicializar OK.-', pResults);
	 			}

	 			function errorCallback (pError) {
	 				vm.formControl.loading = false;
	 				vm.formControl.error = true;
	 			}
			}

		}
	};

	return module;

})();