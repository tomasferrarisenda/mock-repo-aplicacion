/**
 * @author:			Aldo Minoldo
 * @description:	Servicio de datos de organizacion
 * @type:			Service
 **/

 export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('OrganizacionGestionDataService', OrganizacionGestionDataService);

		OrganizacionGestionDataService.$inject = ['DotService','AuthorizationService', 'Logger']
		
		function OrganizacionGestionDataService (DotService, AuthorizationService, $log) {

			$log = $log.getInstance('OrganizacionGestionDataService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var id;

			var codigoBusqueda = null;
			var razonSocialBusqueda = null;
			var currentPage = null;

			const service = {
				ObtenerPorFiltro : ObtenerPorFiltro,
				getOrganizacionById : getOrganizacionById,
				GetOne : GetOne,
				Guardar : Guardar,
				newOrganizacion: newOrganizacion,
				obtenerNewOrganizacion : obtenerNewOrganizacion,
				getAllOrganizacion : getAllOrganizacion,
				Add : Add,
				Update : Update,
				New : New,
				deleteOrganizacion : deleteOrganizacion,
				ObtenerPorIdConMutuales : ObtenerPorIdConMutuales,
				generarFiltroOrganizacion : generarFiltroOrganizacion,
				exportarListaToXls : exportarListaToXls
			};

			return service;

			

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			//comando Get = obtener, Post = enviar, Put = poner


			function generarFiltroOrganizacion() {
				var _url = 'Organizacion/CrearFiltroOrganizacion';
				return DotService.Get(_url);
			}
			
			function ObtenerPorFiltro (pFiltros) {
				var _url = 'Organizacion/ObtenerPorFiltro';
				return DotService.Post(_url, pFiltros);
			}			

			function getOrganizacionById () {
				var _url = 'Organizacion/';
				return DotService.Get(_url);
			}
			
			function Guardar(pOrganizacion){
				var _url = 'Organizacion/Guardar';
				return DotService.Post(_url, pOrganizacion);
			}

			function newOrganizacion(pOrganizacion){
				var _url = 'Organizacion/Guardar';
				return DotService.Post(_url, pOrganizacion);
			}


			function GetOne (pId) {
				var _url = 'Organizacion/ObtenerPorId/' + pId;
				return DotService.Get(_url);
			}


			//Agrego nuevo para q a los datos los maneje el BackEnd//	
			function obtenerNewOrganizacion(){
				var _url = 'Organizacion/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function  getAllOrganizacion () {
				var _url = 'Organizacion/ObtenerTodosParaVista';
				return DotService.Get(_url);
			}
		

			function ObtenerPorIdConMutuales (pId) {
				var _url = 'Organizacion/ObtenerPorIdConMutuales/' + pId;
				return DotService.Get(_url);
			}


			function Add (pData) {
				var _url = 'Organizacion/';
				return DotService.Post(_url, pData);
			}

			function Update (pData) {
				var _url = 'Organizacion/';
				return DotService.Put(_url, pData);
			}
			
			function New () {
				var _url = 'Organizacion/New';
				return DotService.Get(_url);
			}

			function deleteOrganizacion (pOrganizacion) {
				var _url = 'Organizacion/Eliminar/' + pOrganizacion;
				return DotService.Get(_url);
			}

			function exportarListaToXls(codigo, nombre, currentPage, pageSize) {
				var _url = 'Organizacion/ExportListToExcel/'+codigo+'/'+nombre+'/'+currentPage+'/'+pageSize;
				return DotService.DownloadFile(_url, 'Organizaciones.xlsx');
			}

		}
	};

	return module;
})();