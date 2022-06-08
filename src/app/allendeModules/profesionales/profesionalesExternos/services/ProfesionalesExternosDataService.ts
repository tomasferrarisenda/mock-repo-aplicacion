/**
 * @author 			drobledo
 * @description 	DataService para Profesionales Externos
 */

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ProfesionalesExternosDataService', ProfesionalesExternosDataService);

		ProfesionalesExternosDataService.$inject = ['DotService'];
		
		function ProfesionalesExternosDataService (DotService) {

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				eliminarProfesional: eliminarProfesional,
				obtenerNuevoFiltro: obtenerNuevoFiltro,
				obtenerListadoProfesionales: obtenerListadoProfesionales,
				guardar: guardar,
				obtenerPorId: obtenerPorId,
				obtenerNuevo: obtenerNuevo
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function eliminarProfesional(id) {
				var _url = 'Solicitantes/ProfesionalExterno/Eliminar/' + id;
				return DotService.Get(_url);
			}

			function obtenerNuevoFiltro() {
				var _url = 'Solicitantes/ProfesionalExterno/ObtenerNuevoFiltro';
				return DotService.Get(_url);
			}

			function obtenerListadoProfesionales(filtro) {
				var _url = 'Solicitantes/ProfesionalExterno/ObtenerPorFiltro';
				return DotService.Post(_url, filtro);
			}

			function guardar(profesional) {
				var _url = 'Solicitantes/ProfesionalExterno/Guardar';
				return DotService.Post(_url, profesional);
			}

			function obtenerPorId(id) {
				var _url = 'Solicitantes/ProfesionalExterno/ObtenerPorId/' + id;
				return DotService.Get(_url);
			}

			function obtenerNuevo (idContrato) {
				var _url = 'Solicitantes/ProfesionalExterno/ObtenerNuevo';
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();