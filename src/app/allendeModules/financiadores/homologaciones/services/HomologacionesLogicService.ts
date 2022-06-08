import verHomologacion = require('../views/homologacionView.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('HomologacionesLogicService', HomologacionesLogicService);

		// Inyección de dependencia
		HomologacionesLogicService.$inject = ['$log', '$uibModal', 'HomologacionesDataService'];

		// Definición del servicio
		function HomologacionesLogicService ($log, $uibModal, HomologacionesDataService) {

			//$log.debug('HomologacionesLogicService: ON.-');
			
			// API o Interface
			const service = {
				viewHomologacion: viewHomologacion
			};

			return service;

			function viewHomologacion () {
				$log.debug('financiadores/homologaciones/view/homologacionView.html');
				var _modalInstance = $uibModal.open({
					template: verHomologacion,
					controller: 'HomologacionViewController',
					controllerAs: 'vm',
					size: 'lg'
				});
				
				return _modalInstance.result;
			}

		}
	};

	return module;
})();