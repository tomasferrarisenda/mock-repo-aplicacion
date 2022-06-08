import infoFinanciadores = require('../templates/infoFinanciadores.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('FinanciadorLogicService', FinanciadorLogicService);

		FinanciadorLogicService.$inject = ['$log', '$uibModal'];

		function FinanciadorLogicService ($log, $uibModal) {
			
			const service = {
				infoFinanciador : infoFinanciador
			};
			
			return service;

			function infoFinanciador(idFinanciador) {
				return $uibModal.open({
					template: infoFinanciadores,
					controller: 'InfoFinanciadorController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idFinanciador: function () {
							return idFinanciador;
						}
					}
				}).result;
			}
		}
	};

	return module;

})();