
import buscadorRecursoView = require('../templates/buscador-recurso.tpl.html');

export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('MantenimientoAgendaLogicService', MantenimientoAgendaLogicService);

		// Inyección de dependencia
		MantenimientoAgendaLogicService.$inject = [ '$uibModal'];

		// Definición del servicio
		function MantenimientoAgendaLogicService($uibModal) {

			// API o Interface
			const service = {
				openBuscadorRecurso: openBuscadorRecurso,
				openConsultaRecesos: openConsultaRecesos,
				openConsultaRecursosEnServicios: openConsultaRecursosEnServicios

			};

			return service;

			function openBuscadorRecurso(idServicio, idSucursal) {

				return $uibModal.open({
					template: buscadorRecursoView,
					controller: 'BuscadorRecursoController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						IdSucursal: function () {
							return idSucursal;
						},
						IdServicio: function () {
							return idServicio;
						}

					}
				}).result;
			}


			function openConsultaRecesos(servicio, recurso, _fechaDesde, _fechaHasta) {
				return $uibModal.open({
					component: 'saConsultaRecesos',
					size: 'lg',
					resolve: {
						Servicio: function () {
							return servicio;
						},
						Recurso: function () {
							return recurso;
						},
						FechaDesde: function () {
							return _fechaDesde;
						},
						FechaHasta: function () {
							return _fechaHasta
						}

					}
				}).result;
			}

			function openConsultaRecursosEnServicios() {
				return $uibModal.open({
					component: 'saConsultaRecursosEnServicios',
					size: 'lg',
				}).result;
			}
		}
	};

	return module;
})();