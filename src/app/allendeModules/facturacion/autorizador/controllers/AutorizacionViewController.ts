/**
 * @author 			pferrer
 * @description 	description
 */
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AutorizacionViewController', AutorizacionViewController);

		// Inyección de Dependencia
		AutorizacionViewController.$inject = ['$scope', '$log', 'AutorizadorDataService', '$uibModalInstance'];

		// Constructor del Controller
		function AutorizacionViewController ($scope, $log, AutorizadorDataService , $uibModalInstance) {

			//$log.debug('AutorizacionViewController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */
			
			var vm = this;
			
			$scope.title = {
				module: 'AUTORIZACIONES',
				page: 'Detalle de Autorización'
			};

			$scope.data = {
				autorizacion: []
			};

			$scope.formControl = {
				error: true,
				loading: false,
				reloadPage: activate
			};

			vm.formControl = {
				cancel : cancel
			}

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables () {
				$scope.data.autorizacion = AutorizadorDataService.autorizacionView;
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}
			
			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate () {
				inicializarVariables();
			}

			function activateOk (pResult) {
				$scope.data.autorizacion = pResult[0];
				$scope.formControl.loading = false;
			}

			function activateError (pError) {
				$scope.formControl.loading = false;
				$scope.formControl.error = true;
			}
		};
	};

	return module;
})();