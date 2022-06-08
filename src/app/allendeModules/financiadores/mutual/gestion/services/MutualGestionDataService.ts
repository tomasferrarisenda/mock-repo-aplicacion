/**
 * @author:			Aldo Minoldo
 * @description:	Servicio de datos de Mutual
 * @type:			Service
 **/
// 
// 
// 
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('MutualGestionDataService', MutualGestionDataService);

		MutualGestionDataService.$inject = ['DotService', 'DtoService','AuthorizationService', 'Logger'];
		
		function MutualGestionDataService (DotService, DtoService, AuthorizationService, $log) {

			$log = $log.getInstance('MutualGestionDataService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var id;

			var codigoMutualBusqueda = null;
			var nombreMutualBusqueda = null;
			var nombreCortoBusqueda = null;
			var tipoAfiliadoBusqueda = null;
			var tipoMutualBusqueda = null;
			var soloActivosBusqueda = null;
			var currentPage = null;

			const service = {
				GetAll : GetAll,
				GetAllPorFiltro : GetAllPorFiltro,
				getMutualById : getMutualById,
				GetOne : GetOne,
				newMutual: newMutual,
				obtenerNewMutual: obtenerNewMutual,
				guardarMutual : guardarMutual,
				Add : Add,
				Update : Update,
				New : New,
				deleteMutual : deleteMutual,
				ObtenerPorIdConMutuales : ObtenerPorIdConMutuales,
				generarFiltroMutual : generarFiltroMutual,
				ObtenerPorFiltro : ObtenerPorFiltro,
				ObtenerPorIdEditar : ObtenerPorIdEditar,
				exportarListaToXls : exportarListaToXls,
				GetNuevoDocumentoAsociadoDto : GetNuevoDocumentoAsociadoDto,
				ObtenerListaFacturacionDtoParaEdicion : ObtenerListaFacturacionDtoParaEdicion,
				ObtenerNuevoItemEdit : ObtenerNuevoItemEdit,
				ObtenerNuevaListaDtoParaEdicion : ObtenerNuevaListaDtoParaEdicion,
				GuardarListaFacturacionMutual : GuardarListaFacturacionMutual,
				ImportarExcel : ImportarExcel,
				ExportarExcel : ExportarExcel,
				EliminarListaFacturacion : EliminarListaFacturacion,
				ObtenerNuevoListasFacturacionMutualListDto : ObtenerNuevoListasFacturacionMutualListDto
			};

			return service;

			//"Agregar Delete arriba const service"

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			//comando Get = obtener, Post = enviar, Put = poner

			function GetAll () {
				var _url = 'Mutual/ObtenerTodos';
				return DotService.Get(_url);
			}

			//[Route("ObtenerPorFiltro/{razanSocial}/{codigo}")]
			function GetAllPorFiltro (id) {
				var _url = 'Mutual/ObtenerPorIdParaVista/' + id;
				return DotService.Get(_url);
			}

			function getMutualById (id) {
				var _url = 'Mutual/ObtenerPorIdParaVista/' + id;
				return DotService.Get(_url);
			}
			
			function newMutual(pMutual){
				var _url = 'Mutual/Guardar';
				return DotService.Post(_url, pMutual);
			}

			function guardarMutual(pMutual){
				var _url = 'Mutual/Guardar';
				return DotService.Post(_url, pMutual);
			}

			function obtenerNewMutual(){
				var _url = 'Mutual/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function GetOne (pId) {
				var _url = 'Mutual/ObtenerPorIdParaVista/' + pId;
				return DotService.Get(_url);
			}

			function ObtenerPorIdEditar (pId) {
				var _url = 'Mutual/ObtenerPorId/' + pId;
				return DotService.Get(_url);
			}

			function ObtenerPorIdConMutuales (id) {
				var _url = 'Mutual/ObtenerPorIdParaVista/' + id;
				return DotService.Get(_url);
			}

			function Add (pData) {
				var _url = 'Mutual/';
				return DotService.Post(_url, pData);
			}

			function Update (pData) {
				var _url = 'Mutual/';
				return DotService.Put(_url, pData);
			}
			
			function New () {
				var _url = 'Mutual/New';
				return DotService.Get(_url);
			}
			
			//Poner el Get, Post, etc que tengo en Backend
			function deleteMutual (pIdMutual) {
				var _url = 'Mutual/Eliminar/' + pIdMutual;
				return DotService.Get(_url);
			}

			function generarFiltroMutual() {
				var _url = 'Mutual/CrearFiltroMutual';
				return DotService.Get(_url);
			}
			
			function ObtenerPorFiltro (pFiltros) {
				var _url = 'Mutual/ObtenerPorFiltro';
				return DotService.Post(_url, pFiltros);
			}		

			function exportarListaToXls(codigo, nombre, idTipoAfiliado, idTipoMutual, currentPage, pageSize) {
				var _url = 'Mutual/ExportListToExcel/'+codigo+'/'+nombre+'/'+idTipoAfiliado+'/'+idTipoMutual+'/'+currentPage+'/'+pageSize;
				return DotService.DownloadFile(_url, 'Financiadores.xlsx');
			}

			function GetNuevoDocumentoAsociadoDto() {
				var _url = 'DocumentoAsociado/ObtenerNuevo';
				return DtoService.Get(_url);
			}

			function ObtenerListaFacturacionDtoParaEdicion(idlista) {
				var _url = 'ListasFacturacionMutual/ObtenerListaFacturacionDtoParaEdicion/'+idlista;
				return DtoService.Get(_url);
			}

			
			function ObtenerNuevaListaDtoParaEdicion() {
				var _url = 'ListasFacturacionMutual/ObtenerNuevaListaDtoParaEdicion';
				return DtoService.Get(_url);
			}

			function ObtenerNuevoItemEdit() {
				var _url = 'ListasFacturacionMutual/ObtenerNuevoItemEdit';
				return DtoService.Get(_url);
			}

			function GuardarListaFacturacionMutual(listaFacturacionMutualEditDto) {
				var _url = 'ListasFacturacionMutual/Guardar';
				return DtoService.Post(_url, listaFacturacionMutualEditDto);
			}

			function ImportarExcel(listaDto) {
				var _url = 'ListasFacturacionMutual/ImportarExcel';
				return DtoService.Get(_url, listaDto);
			}

			function ExportarExcel(id) {
				var _url = 'ListasFacturacionMutual/ExportarExcel/'+id;
				//return DtoService.Get(_url);
				return DtoService.DownloadFile(_url, 'ListaFacturacionMutual.xlsx');
			}

			function EliminarListaFacturacion(IdLista) {
				var _url = 'ListasFacturacionMutual/Eliminar/'+ IdLista;
				return DtoService.Get(_url);
			}

			function ObtenerNuevoListasFacturacionMutualListDto() {
				var _url = 'ListasFacturacionMutual/ObtenerNuevoListasFacturacionMutualListDto';
				return DtoService.Get(_url);
			}
		}
	};

	return module;

})();