/**
 * @author:			Jorge Basiluk
 * @description:	SociedadProfesionales
 * @type:			Service
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('SociedadProfesionalesDataService', SociedadProfesionalesDataService);

		SociedadProfesionalesDataService.$inject = ['DotService'];
		
		function SociedadProfesionalesDataService (DotService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var matriculaBusqueda = null;
			var nombreBusqueda = null;
			var currentPage = null;

			const service = {
				ObtenerNuevaSociedadDto : ObtenerNuevaSociedadDto,
				ObtenerSociedadesPorFiltros : ObtenerSociedadesPorFiltros,
				ObtenerSociedadParaEdicion : ObtenerSociedadParaEdicion,
				ObtenerFiltroBusquedaSociedadesDto : ObtenerFiltroBusquedaSociedadesDto,
				guardarSociedad : guardarSociedad,
				EliminarSociedad : EliminarSociedad,
				ObtenerTodosServicios : ObtenerTodosServicios,
				GetNuevoDocumentoAsociadoDto : GetNuevoDocumentoAsociadoDto,
				exportarListaToXls : exportarListaToXls
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function ObtenerNuevaSociedadDto () {
				var _url = 'SociedadDeProfesionales/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function ObtenerSociedadesPorFiltros (filtroDto) {
				var _url = 'SociedadDeProfesionales/ObtenerPorFiltro';
				return DotService.Post(_url, filtroDto);
			}

			function ObtenerSociedadParaEdicion (id){ 
				var _url = 'SociedadDeProfesionales/ObtenerPorId/' + id;
				return DotService.Get(_url);
			}

			function ObtenerFiltroBusquedaSociedadesDto () {
				var _url = 'SociedadDeProfesionales/ObtenerFiltroBusqueda';
				return DotService.Get(_url);
			}

			function guardarSociedad(sociedadDto) {
				var _url = 'SociedadDeProfesionales/Guardar';
				return DotService.Post(_url, sociedadDto);
			}

			function EliminarSociedad(id){
				var _url = 'SociedadDeProfesionales/Eliminar/'+ id;
				return DotService.Get(_url);
			}

			function ObtenerTodosServicios(){
				var _url = 'Servicio/ObtenerTodos/false/false';
				return DotService.Get(_url);
			}

			function GetNuevoDocumentoAsociadoDto() {
				var _url = 'DocumentoAsociado/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function exportarListaToXls(matricula, nombre, currentPage, pageSize) {
				var _url = 'SociedadDeProfesionales/ExportListToExcel/'+matricula+'/'+nombre+'/'+currentPage+'/'+pageSize;
				return DotService.DownloadFile(_url, 'SociedadesProfesionales.xlsx');
			}		
		}
	};

	return module;
})();