import searchContratablesTemplate = require('../templates/searchContratables.tpl.html');
import searchProfesionalTemplate = require('../templates/searchCuentaProfesional.tpl.html');
import searchMatriculaProfesionalTemplate = require('../templates/searchMatriculaProfesional.tpl.html');
import searchTecnicoTemplate = require('../templates/searchTecnico.tpl.html');
import searchProfesionalAtencionTemplate = require('../templates/searchProfesionalAtencion.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ContratableLogicService', ContratableLogicService);

		ContratableLogicService.$inject = ['$log', '$uibModal', 'ModalService'];

		function ContratableLogicService ($log, $uibModal, ModalService) {
			
			const service = {
				searchContratable : searchContratable,
				searchProfesional : searchProfesional,
				searchMatriculaProfesional : searchMatriculaProfesional,
				searchTecnico : searchTecnico,
				searchProfesionalAtencion : searchProfesionalAtencion
			};
			return service;

			function searchContratable () {
				return $uibModal.open({
					template: searchContratablesTemplate,
					controller: 'SearchContratablesController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg'
				}).result;
			}
			
			function searchProfesional() {
				return $uibModal.open({
					template: searchProfesionalTemplate,
					controller: 'SearchCuentaProfesionalController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg'
				}).result;
			}

			function searchMatriculaProfesional() {
				return $uibModal.open({
					template: searchMatriculaProfesionalTemplate,
					controller: 'SearchMatriculaProfesionalController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg'
				}).result;
			}

			function searchTecnico (idServicio) {
				return $uibModal.open({
					template: searchTecnicoTemplate,
					controller: 'SearchTecnicoController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idServicio: function () {
							return idServicio;
						}
					}
				}).result;
			}

			function searchProfesionalAtencion(idServicio) {
				return $uibModal.open({
					template: searchProfesionalAtencionTemplate,
					controller: 'SearchProfesionalAtencionController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'md',
					resolve: {
						idServicio: function () {
							return idServicio;
						}
					}
				}).result;
			}
        }
	};

	return module;

})();