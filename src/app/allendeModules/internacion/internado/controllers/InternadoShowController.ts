/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoShowController',InternadoShowController);

		// Inyeccion de dependencia
		InternadoShowController.$inject = ['Logger', '$uibModalInstance', 'AdmisionDataService', 
			'IdInternacion', 'Title', 'Module', 'User'
			];
		
		// Constructor del Controller
		function InternadoShowController ($log, $uibModalInstance, AdmisionDataService,  
			IdInternacion, Title, Module, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoShowController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;
			vm.title = {
				module : Module,
				page : Title 
			};

			vm.data = {
				internacion: {}
			};

			vm.formControl = {
				error: true,
				loading: false,
				ok : ok,
				cancel : cancel
			};

			/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */

			function ok() {
				$uibModalInstance.close('ok');
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-');

				vm.formControl.error = true;
				vm.formControl.loading = true;

				AdmisionDataService.getOneInternacion(IdInternacion)
				.then(successCallback, errorCalback);

				function successCallback (pResult) {
					vm.formControl.error = false;
					vm.formControl.loading = false;
					vm.data.internacion = pResult;
					vm.title.page += ' N° '+ pResult.numero_internado; 
					$log.debug('Inicializar OK', vm.data.internacion);
				}

				function errorCalback (pError) {
					vm.formControl.error = true;
					vm.formControl.loading = false;
					$log.error('Inicializar ERROR.-', pError);
					$uibModalInstance.dismiss(pError);
				}
			}

		}

	};

	return module;

})();