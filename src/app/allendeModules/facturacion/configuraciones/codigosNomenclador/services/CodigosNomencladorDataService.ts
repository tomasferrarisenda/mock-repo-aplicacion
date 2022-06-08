export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('CodigosNomencladorDataService', CodigosNomencladorDataService);

		CodigosNomencladorDataService.$inject = ['DotService'];

		function CodigosNomencladorDataService(DotService) {

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				getAllNomencladores: getAllNomencladores,
				getAllTiposComponentes: getAllTiposComponentes,
				getAllTiposCodigoNomenclador: getAllTiposCodigoNomenclador,
				getAllCodigosUnidadesNomenclador: getAllCodigosUnidadesNomenclador,
				getAllFrecuenciasCodigosDeNomenclador: getAllFrecuenciasCodigosDeNomenclador,
				getAllComplejidadesAdac: getAllComplejidadesAdac,
				eliminarCodigoNomenclador: eliminarCodigoNomenclador,
				guardarCodigoNomenclador: guardarCodigoNomenclador,
				obtenerCodigoNomencladorPorId: obtenerCodigoNomencladorPorId,
				obtenerNuevoCodigoNomenclador: obtenerNuevoCodigoNomenclador,
				exportarListaCodigosToXls: exportarListaCodigosToXls,
				guardarCodigoNomencladorPorFiltro: guardarCodigoNomencladorPorFiltro,
				obtenerNuevoFiltroCodigoNomenclador: obtenerNuevoFiltroCodigoNomenclador,
				getAllUnidadesArancelarias: getAllUnidadesArancelarias,
				getAllCapitulosNomenclador: getAllCapitulosNomenclador,
				getAllComplejidadesCodigoNomenclador: getAllComplejidadesCodigoNomenclador,
				obtenerCodigosNomenclador: obtenerCodigosNomenclador,
				obtenerCodigoNomencladorPorCodigo: obtenerCodigoNomencladorPorCodigo
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function getAllNomencladores() {
				var _url = 'Nomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTiposComponentes() {
				var _url = 'TipoComponente/ObtenerTodosCompleto';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTiposCodigoNomenclador() {
				var _url = 'TipoCodigoNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllCodigosUnidadesNomenclador() {
				var _url = 'CodigoUnidadNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllFrecuenciasCodigosDeNomenclador() {
				var _url = 'FrecuenciaCodigoDeNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllComplejidadesAdac() {
				var _url = 'ComplejidadAdac/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function guardarCodigoNomencladorPorFiltro(dto) {
				var _url = 'CodigoDeNomenclador/ObtenerParaBusqueda';
				return DotService.Post(_url, dto);
			}

			function exportarListaCodigosToXls(nombre, codigo, codigoNbu, idNomenclador, currentPage, pageSize) {
				var _url = 'CodigoDeNomenclador/ExportCodigosNomencladorToExcel/' + nombre + '/' + codigo + '/' + codigoNbu + '/' + idNomenclador + '/' + currentPage + '/' + pageSize;
				return DotService.DownloadFile(_url, 'CodigosNomenclador.xlsx');
			}

			function eliminarCodigoNomenclador(id) {
				var _url = 'CodigoDeNomenclador/Eliminar/' + id;
				return DotService.Get(_url);
			}

			function guardarCodigoNomenclador(dto) {
				var _url = 'CodigoDeNomenclador/Guardar';
				return DotService.Post(_url, dto);
			}

			function obtenerCodigoNomencladorPorId(id) {
				var _url = 'CodigoDeNomenclador/ObtenerPorId/' + id;
				return DotService.Get(_url);
			}

			function obtenerNuevoCodigoNomenclador() {
				var _url = 'CodigoDeNomenclador/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function obtenerNuevoFiltroCodigoNomenclador() {
				var _url = 'CodigoDeNomenclador/ObtenerNuevoFiltro';
				return DotService.Get(_url);
			}

			function getAllUnidadesArancelarias() {
				var _url = 'UnidadArancelaria/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllCapitulosNomenclador() {
				var _url = 'CapituloNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllComplejidadesCodigoNomenclador() {
				var _url = 'ComplejidadCodigoNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerCodigosNomenclador() {
				var _url = 'legacy/PracticaMedica/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function obtenerCodigoNomencladorPorCodigo(codigo) {
				var _url = 'legacy/PracticaMedica/GetByCodigo/' + codigo;
				return DotService.Get(_url);
			}

		}
	};

	return module;
})();