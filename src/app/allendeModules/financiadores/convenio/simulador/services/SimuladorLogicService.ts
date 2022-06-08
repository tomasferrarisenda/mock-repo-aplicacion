import editaCondicion = require('../../listado/templates/condicionEdit.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('SimuladorLogicService', SimuladorLogicService);

		SimuladorLogicService.$inject = ['$log', '$uibModal', 'ModalService', 'SimuladorDataService'];

		function SimuladorLogicService ($log, $uibModal, ModalService, SimuladorDataService) {
			
			const service = {
				editarCondicion : editarCondicion,
			};
			return service;

			function editarCondicion(condicionEditDto, idFinanciador) {
				return $uibModal.open({
					template: editaCondicion,
					controller: 'CondicionEditTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						condicionEditDto: function () {
							return condicionEditDto;
						},
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