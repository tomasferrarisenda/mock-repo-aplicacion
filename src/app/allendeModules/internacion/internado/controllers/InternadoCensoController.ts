/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoCensoController', InternadoCensoController);

		// Inyeccion de dependencia
		InternadoCensoController.$inject = ['Logger', '$q', '$uibModalInstance', 'INTERNADO_ORDER_BY_LAZY',
			'Title', 'Module', 'OrderBy', 'Internados', 'User'];
		
		// Constructor del Controller
		function InternadoCensoController ($log, $q, $uibModalInstance, INTERNADO_ORDER_BY,
			Title, Module, OrderBy, Internados, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoCensoController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
				
			// En this va lo que se modifica de la vista (VM: ViewModel)
			var vm = this;

			vm.title = {
				module: Module,
				page: Title
			};
			vm.sucursal = '';
			vm.order = OrderBy;
			vm.listOrderBy = INTERNADO_ORDER_BY;

			vm.data = {
				internaciones: [],
				user : User
			};

			vm.formControl = {
				error: true,
				loading: false,
				cancel: cancel
			};

 			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				
				$log.debug('Inicializar ON.-');

				activateOk(Internados);
			}

			function activateOk (results) {
				vm.data.internaciones = results;
				vm.formControl.error = false;
				vm.formControl.loading = false;
				setTimeout(function (){ window.print(); }, 1000);
				$log.debug('Inicializar OK', results);
			}

			function activateError (pError) {
				vm.formControl.loading = false;
				$log.error('Inicializar ERROR.-', pError);
				$uibModalInstance.dismiss(pError);
			}
		}

	};

	return module;

})();