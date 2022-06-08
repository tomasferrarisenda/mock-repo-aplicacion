/**
 * @author 			ppautasso
 * @description 	description
 */

import { servicioDto } from '../models/servicioDTO';

export interface IServiciosGestionDataService {

	getAll(): any;
	getServiciosBySucursal(pIdSucursal: number): any;
	ObtenerTodosParaAsignar(): any;
	getServicioById(pIdServicio: number): any;
	validarNewServicio(pServicio: object): any;
	newServicio(pServicio: object): any;
	validarDeleteServicio(pIdServicio: number): any;
	deleteServicio(pIdServicio: number): any;
	ValidarAsignarASucursal(pIdServicio: number, pIdSucursal: number): any;
	AsignarServicioASucursal(pIdServicio: number, pIdSucursal: number): any;
	obtenerPorRecurso(pRecurso: object): any;
	obtenerPorRecursoRelacionSucursalServicio(pRecurso: object): any;
	validarEliminarServicioEnSucursal (pIdServicioEnSucursal: number): any;
	eliminarServicioEnSucursal (pIdServicioEnSucursal: number): any;

	obtenerPorRecepcion (pIdRecepcion: number): any;
	obtenerPorRecepcionPorUsuario (pIdRecepcion: number): any;
	
	validarActivarServicioEnSucursal (pIdServicioEnSucursal: number): any;
	activarServicioEnSucursal(pIdServicioEnSucursal: number): any;
	validarDesactivarServicioEnSucursal(pIdServicioEnSucursal: number): any;
	desactivarServicioEnSucursal(pIdServicioEnSucursal: number): any;
	
	validarMostrarEnPortalWeb (pIdServicioEnSucursal: number): any;
	mostrarEnPortalWeb(pIdServicioEnSucursal: number): any;
	validarOcultarEnPortalWeb(pIdServicioEnSucursal: number): any;
	ocultarEnPortalWeb(pIdServicioEnSucursal: number): any;
	ObtenerNuevoFiltroBusqueda(): any;
	ObtenerPorFiltro(filtroDto: servicioDto): angular.IPromise<GridViewDto<servicioDto>>;
	exportarListaToXls(): any;
	definirJefeServicio(pIdServicio, pIdSucursal, pIdProfesional): any;
}

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('ServiciosGestionDataService', ServiciosGestionDataService);

		ServiciosGestionDataService.$inject = ['DotService', 'Logger'];

		function ServiciosGestionDataService(DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServiciosGestionDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				getAll: getAll,
				getServiciosBySucursal: getServiciosBySucursal,
				ObtenerTodosParaAsignar: ObtenerTodosParaAsignar,
				getServicioById: getServicioById,
				validarNewServicio: validarNewServicio,
				newServicio: newServicio,
				validarDeleteServicio: validarDeleteServicio,
				deleteServicio: deleteServicio,
				ValidarAsignarASucursal: ValidarAsignarASucursal,
				AsignarServicioASucursal: AsignarServicioASucursal,

				obtenerPorRecurso: obtenerPorRecurso,
				obtenerPorRecursoRelacionSucursalServicio: obtenerPorRecursoRelacionSucursalServicio,

				validarEliminarServicioEnSucursal : validarEliminarServicioEnSucursal,
				eliminarServicioEnSucursal : eliminarServicioEnSucursal,

				obtenerPorRecepcion: obtenerPorRecepcion,
				obtenerPorRecepcionPorUsuario : obtenerPorRecepcionPorUsuario,

				//api Activar/Desactivar Servicios en Sucursales
				validarActivarServicioEnSucursal : validarActivarServicioEnSucursal,
				activarServicioEnSucursal : activarServicioEnSucursal,
				validarDesactivarServicioEnSucursal : validarDesactivarServicioEnSucursal,
				desactivarServicioEnSucursal : desactivarServicioEnSucursal,
				
				//api Mostrar/Ocultar En Portal Web los servicios en Sucursales
				validarMostrarEnPortalWeb: validarMostrarEnPortalWeb,
				mostrarEnPortalWeb: mostrarEnPortalWeb,
				validarOcultarEnPortalWeb: validarOcultarEnPortalWeb,
				ocultarEnPortalWeb: ocultarEnPortalWeb,

				exportarListaToXls : exportarListaToXls,
				ObtenerNuevoFiltroBusqueda : ObtenerNuevoFiltroBusqueda,
				ObtenerPorFiltro: ObtenerPorFiltro,
				definirJefeServicio: definirJefeServicio
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getAll(soloActivos?, soloVisiblesTurnos?) {
				var _url = 'Servicio/ObtenerTodos/' + soloActivos + '/' + soloVisiblesTurnos;
				return DotService.Get(_url);
			}

			function getServicioById(pIdServicio) {
				var _url = 'Servicio/ObtenerPorId/' + pIdServicio;
				return DotService.Get(_url);
			}

			function getServiciosBySucursal(pIdSucursal) {
				var _url = 'ServicioEnSucursal/ObtenerPorSucursal/' + pIdSucursal;
				return DotService.Get(_url);
			}

			function ObtenerTodosParaAsignar() {
				var _url = 'Servicio/ObtenerTodosParaAsignar/';
				return DotService.Get(_url);
			}

			function validarNewServicio(pServicio) {
				var _url = 'Servicio/ValidarGuardar';
				return DotService.Post(_url, pServicio);
			}

			function newServicio(pServicio) {
				var _url = 'Servicio/Guardar';
				return DotService.Post(_url, pServicio);
			}

			function validarDeleteServicio(pIdServicio) {
				var _url = 'Servicio/ValidarEliminar/' + pIdServicio;
				return DotService.Get(_url);
			}

			function deleteServicio(pIdServicio) {
				var _url = 'Servicio/Eliminar/' + pIdServicio;
				return DotService.Get(_url);
			}

			function ValidarAsignarASucursal(pIdServicio, pIdSucursal) {
				var _url = 'Servicio/ValidarAsignarASucursal/' + pIdServicio + "/" + pIdSucursal;
				return DotService.Get(_url);
			}

			function AsignarServicioASucursal(pIdServicio, pIdSucursal) {
				var _url = 'Servicio/AsignarASucursal/' + pIdServicio + "/" + pIdSucursal;
				return DotService.Get(_url);
			}

			function obtenerPorRecurso(pRecurso) {
				var _url = 'Servicio/ObtenerPorRecurso/' + pRecurso.Id + "/" + pRecurso.IdTipo;
				return DotService.Get(_url);
			}

			function obtenerPorRecursoRelacionSucursalServicio(pRecurso) {
				var _url = 'ServicioEnSucursal/ObtenerPorRecurso/' + pRecurso.Id + "/" + pRecurso.IdTipo;
				return DotService.Get(_url);
			}

			function validarEliminarServicioEnSucursal(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/ValidarEliminar/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function eliminarServicioEnSucursal(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/Eliminar/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function obtenerPorRecepcion(idRecepcion) {
				var _url = 'Servicio/ObtenerPorRecepcion/' + idRecepcion;
				return DotService.Get(_url);
			}

			function obtenerPorRecepcionPorUsuario(idRecepcion) {
				var _url = 'Servicio/ObtenerPorRecepcionPorUsuario/' + idRecepcion;
				return DotService.Get(_url);
			}
			
			//validar desactivar servicios en sucursal
			
			function validarActivarServicioEnSucursal(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/ValidarActivar/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function activarServicioEnSucursal(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/Activar/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function validarDesactivarServicioEnSucursal(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/ValidarDesactivar/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function desactivarServicioEnSucursal(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/Desactivar/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function definirJefeServicio(pIdServicio, pIdSucursal, pIdProfesional) {
				var _url = 'ServicioEnSucursal/DefinirJefeServicio/' + pIdServicio + "/" + pIdSucursal + "/" + pIdProfesional;
				return DotService.Get(_url);
			}

			// Mostrar y Ocultar en Portal Web
			
			function validarMostrarEnPortalWeb(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/ValidarMostrarEnPortalWeb/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function mostrarEnPortalWeb(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/MostrarEnPortalWeb/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function validarOcultarEnPortalWeb(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/ValidarOcultarEnPortalWeb/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}

			function ocultarEnPortalWeb(pIdServicioEnSucursal) {
				var _url = 'ServicioEnSucursal/OcultarEnPortalWeb/' + pIdServicioEnSucursal;
				return DotService.Get(_url);
			}
		
			function exportarListaToXls() {
				var _url = 'Servicio/ExportListToExcel';
				return DotService.DownloadFile(_url, 'Servicios.xlsx');
			}

			function ObtenerNuevoFiltroBusqueda() {
				var _url = 'Servicio/ObtenerNuevoFiltroBusqueda/';
				return DotService.Get(_url);
			}
			
			function ObtenerPorFiltro(servicioDto) {
				var _url = 'Servicio/ObtenerPorFiltro';
				return DotService.Post(_url, servicioDto);
			}
			

		}
	};

	return module;

})();