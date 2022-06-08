/**
 * @author 			drobledo
 * @description 	LogicService para Profesionales Externos
 */
import editarProfesional = require('../templates/profesionalesExternos-edit.tpl.html');

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('ProfesionalesExternosLogicService', ProfesionalesExternosLogicService);

		ProfesionalesExternosLogicService.$inject = ['Logger', '$uibModal', '$q', 'ProfesionalesExternosDataService'];

		function ProfesionalesExternosLogicService($log, $uibModal, $q, ProfesionalesExternosDataService) {
			$log = $log.getInstance('ProfesionalesExternosLogicService');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				editProfesional: editProfesional,
				obtenerProfesionalDto: obtenerProfesionalDto,
				agregarNuevoProfesionalExterno: agregarNuevoProfesionalExterno
			};

			return service;

			function editProfesional(idProfesional) {
				return $uibModal.open({
					template: editarProfesional,
					controller: 'ProfesionalesExternosEditController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						IdProfesionalEditar: function () {
							return idProfesional ? idProfesional : 0;
						},
					}
				}).result;
			}

			function obtenerProfesionalDto(idProfesionalEditar) {
				var def = $q.defer();
				if (idProfesionalEditar) {
					ProfesionalesExternosDataService.obtenerPorId(idProfesionalEditar)
						.then(function (cuentaDto) {
							def.resolve(cuentaDto);
						});
				}
				else {
					ProfesionalesExternosDataService.obtenerNuevo()
						.then(function (cuentaDto) {
							def.resolve(cuentaDto);
						});
				}
				return def.promise;
			}

			function agregarNuevoProfesionalExterno() {
				return $uibModal.open({
					template: editarProfesional,
					controller: 'ProfesionalesExternosEditController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						IdProfesionalEditar: 0
					}
				}).result;
			}
		}
	};
	return module;
})();