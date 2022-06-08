export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('LogsViewController', LogsViewController);

		LogsViewController.$inject = ['$scope', '$log', '$q', '$filter', '$location', 
			'LogsGestionDataService', 'LogsGestionLogicService','LogsGestionAuthService', '$uibModalInstance','SecurityLogicService'];

		function LogsViewController ($scope, $log, $q, $filter,$location, 
			 LogsGestionDataService, LogsGestionLogicService, LogsGestionAuthService , $uibModalInstance, SecurityLogicService) {

			var vm = this;
			
			$scope.title = {
				module: 'LOG',
				page: 'Detalle del Item'
			};

			$scope.data = {
				item: ''
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
				$scope.data.item = LogsGestionDataService.itemView;
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
				$scope.data.item = pResult[0];
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