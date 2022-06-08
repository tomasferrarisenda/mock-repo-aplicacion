/**
 * @author 			ppautasso
 * @description 	description
 */

export interface IRecursosDataService {
	
		getAll(): any;
		getAllTipos(): any;
		obtenerTodosDeUnServicio(pIdServicio: number): any;
		obtenerRecursoXServicioId(pIdServicio: number): any;
		obtenerPorServicioEnSucursal(pIdRelacion: number): any;
		obtenerPorServicio(pIdServicio: number): any;
		
		validarAsignarAServicio(pIdServicio: number, pIdSucursal: number, pIdRecurso: number, pIdTipoRecurso: number): any
		asignarAServicio(pIdServicio: number, pIdSucursal: number, pIdRecurso: number, pIdTipoRecurso: number): any

		validarDesactivar(pIdRecursoXServicio: number) : any;
		desactivar(pIdRecursoXServicio: number) : any;

		validarActivar(pIdRecursoXServicio: number) : any;
		activar(pIdRecursoXServicio: number) : any;

		validarEliminarXServicio(pIdRecursoXServicio: number) : any;
		eliminarXServicio(pIdRecursoXServicio: number) : any;

		obtenerPorRecepcion(pIdRecepcion: number, pIdSucursal: number, pSoloActivos: boolean);
		obtenerPorRecepcionConTurnos(pIdRecepcion: number, pIdSucursal: number, pFecha: any, pSoloActivos: boolean);
		obtenerPorRecepcionPorUsuario(pIdRecepcion: number, pIdSucursal: number, pSoloActivos: boolean);
		obtenerPorRecepcionConTurnosPorUsuario(pIdRecepcion: number, pIdSucursal: number, pFecha: any, pSoloActivos: boolean);

		prestacionXRecursoXServicio(pIdRecursoXServicio: number) : any;
		especialidadXRecursoXServicio(pIdRecursoXServicio: number) : any;

		obtenerTodosDeUnServicioEnSucursal(pCriterioConIdServicioIdSucursal: object) : any;
		obtenerTodosDeUnServicioEnSucursalConTurnos(pIdServicio: number, pIdSucursal: number, pFecha: any, pSoloActivos: boolean) : any,

		obtenerTodosDeUnServicioEnRecepcion(pIdServicio: number, pIdRecepcion: number) : any;
		obtenerTodosDeUnServicioEnRecepcionConTurnos(pIdServicio: number, pIdRecepcion: number, pFecha: any, pSoloActivos: boolean) : any,

		obtenerTodosDeUnServicioConEspecialidad(pServicioEspecialidad: number) : any
		obtenerTodosDeUnServicioPorSucursalPorEspecialidad(pServicioSucursalEspecialidad : number) : any;

		validarMostrarEnPortalWeb (pIdRecursoDelServicio: number): any;
		mostrarEnPortalWeb(pIdRecursoDelServicio: number): any;
		validarOcultarEnPortalWeb(pIdRecursoDelServicio: number): any;
		ocultarEnPortalWeb(pIdRecursoDelServicio: number): any;

		obtenerTodosDeUnServicioConInfoDeAtencion (pCriterioBusquedaRecursosDelServicio: any): any,
		obtenerTodosDeUnServicioEnSucursalConInfoDeAtencion (pCriterioBusquedaRecursosDelServicio: any): any,
		obtenerTodosDeUnServicioConEspecialidadConInfoDeAtencion (pCriterioBusquedaRecursosDelServicio: any): any,
		obtenerTodosDeUnServicioPorSucursalPorEspecialidadConInfoDeAtencion (pCriterioBusquedaRecursosDelServicio: any): any,

		obtenerTodosDeUnservicioEnSucursalConPrestacion(pIdServicio: number, pIdSucursal: number, pIdPrestacion: number, soloActivos?: boolean);

	}

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('RecursosDataService', RecursosDataService);

		RecursosDataService.$inject = ['DotService', 'Logger'];

		function RecursosDataService(DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RecursosDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				getAll: getAll,
				getAllTipos: getAllTipos,
				obtenerTodosDeUnServicio: obtenerTodosDeUnServicio,
				
				obtenerRecursoXServicioId: obtenerRecursoXServicioId,
				obtenerPorServicioEnSucursal: obtenerPorServicioEnSucursal,
				validarAsignarAServicio: validarAsignarAServicio,
				asignarAServicio: asignarAServicio,
				
				obtenerPorRecepcion: obtenerPorRecepcion,
				obtenerPorRecepcionConTurnos: obtenerPorRecepcionConTurnos,
				obtenerPorRecepcionPorUsuario : obtenerPorRecepcionPorUsuario,
				obtenerPorRecepcionConTurnosPorUsuario : obtenerPorRecepcionConTurnosPorUsuario,

				obtenerPorServicio: obtenerPorServicio,

				// Activar y Desactivar
				validarDesactivar: validarDesactivar,
				desactivar: desactivar,
				validarActivar: validarActivar,
				activar: activar,

				//validar y eliminar Recurso por servicio 
				validarEliminarXServicio: validarEliminarXServicio,
				eliminarXServicio: eliminarXServicio,


				//obtener prestaciones X recurso X servicio
				prestacionXRecursoXServicio: prestacionXRecursoXServicio,

				//obtener especialidades medicas X recurso X servicio
				//
				especialidadXRecursoXServicio: especialidadXRecursoXServicio,

				obtenerTodosDeUnServicioEnSucursal: obtenerTodosDeUnServicioEnSucursal,
				obtenerTodosDeUnServicioEnSucursalConTurnos: obtenerTodosDeUnServicioEnSucursalConTurnos,

				obtenerTodosDeUnServicioEnRecepcion: obtenerTodosDeUnServicioEnRecepcion,
				obtenerTodosDeUnServicioEnRecepcionConTurnos: obtenerTodosDeUnServicioEnRecepcionConTurnos,
				
				obtenerTodosDeUnServicioConEspecialidad : obtenerTodosDeUnServicioConEspecialidad,
				obtenerTodosDeUnServicioPorSucursalPorEspecialidad : obtenerTodosDeUnServicioPorSucursalPorEspecialidad,

				//api Mostrar/Ocultar En Portal Web los servicios en Sucursales
				validarMostrarEnPortalWeb: validarMostrarEnPortalWeb,
				mostrarEnPortalWeb: mostrarEnPortalWeb,
				validarOcultarEnPortalWeb: validarOcultarEnPortalWeb,
				ocultarEnPortalWeb: ocultarEnPortalWeb,

				obtenerTodosDeUnServicioConInfoDeAtencion: obtenerTodosDeUnServicioConInfoDeAtencion,
				obtenerTodosDeUnServicioEnSucursalConInfoDeAtencion: obtenerTodosDeUnServicioEnSucursalConInfoDeAtencion,
				obtenerTodosDeUnServicioConEspecialidadConInfoDeAtencion: obtenerTodosDeUnServicioConEspecialidadConInfoDeAtencion,
				obtenerTodosDeUnServicioPorSucursalPorEspecialidadConInfoDeAtencion: obtenerTodosDeUnServicioPorSucursalPorEspecialidadConInfoDeAtencion,

				obtenerTodosDeUnservicioEnSucursalConPrestacion: obtenerTodosDeUnservicioEnSucursalConPrestacion


			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */



			function getAll() {
				var _url = 'Recurso/ObtenerTodos';
				return DotService.Get(_url);
			}

			function getAllTipos() {
				var _url = 'TipoRecurso/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerTodosDeUnServicio(pIdServicio) {
				var _url = 'Recurso/ObtenerTodosDeUnServicio/' + pIdServicio;
				return DotService.Get(_url);
			}


			function obtenerRecursoXServicioId(pIdServicio) {
				var _url = 'RecursoDelServicio/ObtenerPorServicio/' + pIdServicio;
				return DotService.Get(_url);
			}

			function obtenerPorServicioEnSucursal(pIdRelacion) {
				var _url = 'RecursoDelServicio/ObtenerPorServicioEnSucursal/' + pIdRelacion.IdSucursal + "/" + 
				pIdRelacion.IdServicio;
				return DotService.Get(_url);
			}

			function obtenerPorServicio(pIdServicio) {
				var _url = 'RecursoDelServicio/ObtenerPorServicio/' + pIdServicio;
				return DotService.Get(_url);
			}

			function validarAsignarAServicio(pIdServicio, pIdSucursal, pIdRecurso, pIdTipoRecurso) {
				var _url = 'Recurso/ValidarAsignarAServicio/' + pIdServicio + '/' + pIdSucursal + '/' + pIdRecurso + '/' + pIdTipoRecurso;
				return DotService.Get(_url);
			}

			function obtenerPorRecepcion(pIdRecepcion, pIdSucursal, pSoloActivos) {
				var _url = 'Recurso/ObtenerPorRecepcion/' + pIdRecepcion + '/' + pIdSucursal + '/' + pSoloActivos;
				return DotService.Get(_url);
			}

			function obtenerPorRecepcionConTurnos(pIdRecepcion, pIdSucursal, pFecha, pSoloActivos) {				
				var _url = 'Recurso/ObtenerPorRecepcionConTurnos/' + pIdRecepcion + '/' + pIdSucursal + '/' + pFecha + '/' + pSoloActivos;
				return DotService.Get(_url);
			}

			function obtenerPorRecepcionPorUsuario(pIdRecepcion, pIdSucursal, pSoloActivos) {
				var _url = 'Recurso/ObtenerPorRecepcionPorUsuario/' + pIdRecepcion + '/' + pIdSucursal + '/' + pSoloActivos;
				return DotService.Get(_url);
			}

			function obtenerPorRecepcionConTurnosPorUsuario(pIdRecepcion, pIdSucursal, pFecha, pSoloActivos) {				
				var _url = 'Recurso/ObtenerPorRecepcionConTurnosPorUsuario/' + pIdRecepcion + '/' + pIdSucursal + '/' + pFecha + '/' + pSoloActivos;
				return DotService.Get(_url);
			}
			

			function asignarAServicio(pIdServicio, pIdSucursal, pIdRecurso, pIdTipoRecurso) {
				var _url = 'Recurso/AsignarAServicio/' + pIdServicio + '/' + pIdSucursal + '/' + pIdRecurso + '/' + pIdTipoRecurso;
				return DotService.Get(_url);
			}

			function validarDesactivar(pIdRecursoXServicio) {
				var _url = 'RecursoDelServicio/ValidarDesactivar/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			function desactivar(pIdRecursoXServicio) {
				var _url = 'RecursoDelServicio/Desactivar/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			function validarActivar(pIdRecursoXServicio) {
				var _url = 'RecursoDelServicio/ValidarActivar/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			function activar(pIdRecursoXServicio) {
				var _url = 'RecursoDelServicio/Activar/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			function validarEliminarXServicio(pIdRecursoXServicio) {
				var _url = 'RecursoDelServicio/ValidarEliminar/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			function eliminarXServicio(pIdRecursoXServicio) {
				var _url = 'RecursoDelServicio/Eliminar/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}


			function prestacionXRecursoXServicio(pIdRecursoXServicio) {
				var _url = 'PrestacionDelRecurso/ObtenerPorRecursoDelServicio/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			function especialidadXRecursoXServicio(pIdRecursoXServicio) {
				var _url = 'EspecialidadDelRecurso/ObtenerPorRecursoDelServicio/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			function obtenerTodosDeUnServicioEnSucursal(pCriterioConIdServicioIdSucursal) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioEnSucursal/' + pCriterioConIdServicioIdSucursal.IdServicio + '/' + pCriterioConIdServicioIdSucursal.IdSucursal;
				return DotService.Get(_url);
			}

			function obtenerTodosDeUnServicioEnSucursalConTurnos(pIdServicio, pIdSucursal, pFecha, pSoloActivos) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioEnSucursalConTurnos/' + pIdServicio + '/' + pIdSucursal + '/' + pFecha +'/' + pSoloActivos;
				return DotService.Get(_url);
			}

			function obtenerTodosDeUnServicioEnRecepcion(pIdServicio, pIdRecepcion) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioEnRecepcion/' + pIdServicio + '/' + pIdRecepcion;
				return DotService.Get(_url);
			}

			function obtenerTodosDeUnServicioEnRecepcionConTurnos(pIdServicio, pIdRecepcion, pFecha, pSoloActivos) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioEnRecepcionConTurnos/' + pIdServicio + '/' + pIdRecepcion + '/' + pFecha +'/' + pSoloActivos;
				return DotService.Get(_url);
			}
			

			function obtenerTodosDeUnServicioConEspecialidad(pServicioEspecialidad) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioConEspecialidad/' + pServicioEspecialidad.IdServicio + '/' + pServicioEspecialidad.IdEspecialidad;
				return DotService.Get(_url);
			}

			function obtenerTodosDeUnServicioPorSucursalPorEspecialidad(pServicioSucursalEspecialidad) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioPorSucursalPorEspecialidad/' + pServicioSucursalEspecialidad.IdServicio + '/' + pServicioSucursalEspecialidad.IdSucursal + '/' + pServicioSucursalEspecialidad.IdEspecialidad;
				return DotService.Get(_url);
			}

			// Mostrar y Ocultar en Portal Web
			
			function validarMostrarEnPortalWeb(pIdRecursoDelServicio) {
				var _url = 'RecursoDelServicio/ValidarMostrarEnPortalWeb/' + pIdRecursoDelServicio;
				return DotService.Get(_url);
			}

			function mostrarEnPortalWeb(pIdRecursoDelServicio) {
				var _url = 'RecursoDelServicio/MostrarEnPortalWeb/' + pIdRecursoDelServicio;
				return DotService.Get(_url);
			}

			function validarOcultarEnPortalWeb(pIdRecursoDelServicio) {
				var _url = 'RecursoDelServicio/ValidarOcultarEnPortalWeb/' + pIdRecursoDelServicio;
				return DotService.Get(_url);
			}

			function ocultarEnPortalWeb(pIdRecursoDelServicio) {
				var _url = 'RecursoDelServicio/OcultarEnPortalWeb/' + pIdRecursoDelServicio;
				return DotService.Get(_url);
			}

			//obtener recursos con info de atencion
			function obtenerTodosDeUnServicioConInfoDeAtencion(pCriterioBusquedaRecursosDelServicio) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioConInfoDeAtencion';
				return DotService.Post(_url, pCriterioBusquedaRecursosDelServicio);
			}


			function obtenerTodosDeUnServicioEnSucursalConInfoDeAtencion(pCriterioBusquedaRecursosDelServicio) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioEnSucursalConInfoDeAtencion';
				return DotService.Post(_url, pCriterioBusquedaRecursosDelServicio);
			}

			function obtenerTodosDeUnServicioConEspecialidadConInfoDeAtencion(pCriterioBusquedaRecursosDelServicio) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioConEspecialidadConInfoDeAtencion';
				return DotService.Post(_url, pCriterioBusquedaRecursosDelServicio);
			}

			function obtenerTodosDeUnServicioPorSucursalPorEspecialidadConInfoDeAtencion(pCriterioBusquedaRecursosDelServicio) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioPorSucursalPorEspecialidadConInfoDeAtencion';
				return DotService.Post(_url, pCriterioBusquedaRecursosDelServicio);
			}

			function obtenerTodosDeUnservicioEnSucursalConPrestacion(pIdServicio, pIdSucursal, pIdPrestacion, soloActivos?) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioEnSucursalConPrestacion/' + pIdServicio + '/' + pIdSucursal + '/' + pIdPrestacion + '/' + soloActivos;
				return DotService.Get(_url);
			}

		}
	};

	return module;

})();