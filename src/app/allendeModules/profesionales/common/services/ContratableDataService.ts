/**
 * @author:			Pedro Ferrer (El campeón)
 * @description:	Contratables
 * @type:			Service
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ContratableDataService', ContratableDataService);

		ContratableDataService.$inject = ['DotService'];
		
		function ContratableDataService (DotService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			const service = {
				ObtenerTodos : ObtenerTodos,
				CrearFiltroBusqueda : CrearFiltroBusqueda,
				ObtenerPorFiltro : ObtenerPorFiltro,
				ObtenerCuentaPorCodigo : ObtenerCuentaPorCodigo,
				ObtenerNuevo : ObtenerNuevo,
				ObtenerPorTipoEId : ObtenerPorTipoEId,
				CuentaObtenerTodos : CuentaObtenerTodos,
				ObtenerCuentasPorFiltro : ObtenerCuentasPorFiltro,
				CuentaObtenerPorId : CuentaObtenerPorId,
				TecnicoObtenerTodos : TecnicoObtenerTodos,
				TecnicoObtenerPorCodigo : TecnicoObtenerPorCodigo,
				ObtenerServicioPorRecurso : ObtenerServicioPorRecurso,
				ObtenerProfesionalesPorServicio : ObtenerProfesionalesPorServicio,
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function ObtenerTodos() {
				var _url = 'Facturacion/ContratosInternos/TipoEntidadContratoInterno/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function CrearFiltroBusqueda() {
				var _url = 'Facturacion/ContratosInternos/Contratable/CrearFiltroBusqueda';
				return DotService.Get(_url);
			}

			function ObtenerPorFiltro (filtroContratables) {
				var _url = 'Facturacion/ContratosInternos/Contratable/ObtenerPorFiltro';
				return DotService.Post(_url, filtroContratables);
			}

			function ObtenerNuevo() {
				var _url = 'Facturacion/ContratosInternos/Contratable/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function ObtenerPorTipoEId(idTipo, idEntidad) {
				var _url = 'Facturacion/ContratosInternos/Contratable/ObtenerPorId/' + idTipo + "/" + idEntidad;
				return DotService.Get(_url);
			}

			function CuentaObtenerTodos() {
				var _url = 'Cuenta/ObtenerTodos';
				return DotService.Get(_url);
			}

			function CuentaObtenerPorId(id) {
				var _url = 'Cuenta/ObtenerPorId/'+id;
				return DotService.Get(_url);
			}

			function ObtenerCuentaPorCodigo (cuenta) {
				var _url = 'Cuenta/ObtenerCuentaPorCodigo/'+cuenta;
				return DotService.Get(_url);
			}

			function ObtenerCuentasPorFiltro(cuenta) {
				var _url = 'Cuenta/ObtenerCuentasPorFiltro/'+cuenta;
				return DotService.Post(_url);
			}

			function TecnicoObtenerTodos(idServicio) {
				var _url = 'TecnicoDelServicio/ObtenerPorIdServicio/'+idServicio;
				return DotService.Get(_url);
			}

			function TecnicoObtenerPorCodigo(idServicio, codigo) {
				var _url = 'TecnicoDelServicio/ObtenerPorCodigoTecnico/'+idServicio+'/'+codigo;
				return DotService.Get(_url);
			}

			// Obtener Por Recurso
			function ObtenerServicioPorRecurso(idRecurso, idTipoRecurso) {
				var _url = 'Servicio/ObtenerPorRecurso/'+idRecurso + '/'+idTipoRecurso;
				return DotService.Get(_url);
			}

			// Para obtener los profesionales de un servicio
			function ObtenerProfesionalesPorServicio(idServicio) {
				var _url = 'Profesional/ObtenerPorServicio/'+idServicio; // Ver Ruta Error!
				return DotService.Get(_url);
			}

		}
	};

	return module;
})();