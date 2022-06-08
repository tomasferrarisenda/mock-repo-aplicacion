/**
 * @author 			ppautasso
 * @description 	description
 */

export interface IEspecialidadMedicaDataService {		
		getAll(): any,		
		getPrestacionById(pIdEspecialidad: number): any,

		validarAsignarAServicio(pIdEspecialidad: number, pIdSucursal: number, pIdPrestacion: number): any,
		asignarAServicio(pIdEspecialidad: number, pIdSucursal: number, pIdPrestacion: number): any,
		getEspecialidadXServicioId(pIdEspecialidad: number): any,
		obtenerPorServicioEnSucursal(pSucursal: number, pIdServicio: number): any,
		obtenerPorServicioEnSucursalSelector(pSucursalServicio: number): any,
		validarAsignarARecurso(idEspecialidadEnServicio: number, idRecursoEnServicio: number): any,
		asignarARecurso(idEspecialidadEnServicio: number, idRecursoEnServicio: number): any,

		/* -- API EspecialidadDelServicio ------------------------------ */

		validarDesactivarDelServicio(pIdEspecialidadDelServicio: number): any,
		desactivarDelServicio(pIdEspecialidadDelServicio: number): any,
		validarActivarDelServicio(pIdEspecialidadDelServicio: number): any,
		activarDelServicio(pIdEspecialidadDelServicio: number): any,
		validarEliminarDelServicio(pIdEspecialidadDelServicio: number): any,
		eliminarDelServicio(pIdEspecialidadDelServicio: number): any,
		
		validarMostrarDelServicioEnPortalWeb(pIdEspecialidadDelServicio: number): any,
		mostrarDelServicioEnPortalWeb(pIdEspecialidadDelServicio: number): any,
		validarOcultarDelServicioEnPortalWeb(pIdEspecialidadDelServicio: number): any,
		ocultarDelServicioEnPortalWeb(pIdEspecialidadDelServicio: number): any,


		/* --- API EspecialidadDelRecurso- ------------------------------ */

		obtenerEspecialidadXRecurso(pIdRecursoXServicio: number): any,
		obtenerEspecialidadXRecursDelServicioSucursal(pIdRecurso: number, pIdTipoRecurso: number, pIdSucursal: number, pIdServicio: number): any;
		validarDesactivarDelRecurso(pIdEspecialidadDelRecurso: number): any,
		desactivarDelRecurso(pIdEspecialidadDelRecurso: number) : any,
		validarActivarDelRecurso(pIdEspecialidadDelRecurso: number): any,
		activarDelRecurso(pIdEspecialidadDelRecurso: number) : any,
		validarEliminarDelRecurso(pIdEspecialidadDelRecurso: number) : any,
		eliminarDelRecurso(pIdEspecialidadDelRecurso: number) : any,

		validarMostrarDelRecursoEnPortalWeb(pIdEspecialidadDelRecurso: number) : any,
		mostrarDelRecursoEnPortalWeb(pIdEspecialidadDelRecurso: number) : any,
		validarOcultarDelRecursoEnPortalWeb(pIdEspecialidadDelRecurso: number) : any,
		ocultarDelRecursoEnPortalWeb(pIdEspecialidadDelRecurso: number) : any,

		obtenerTodasDeUnServicio(pServicio: number) : any,
	obtenerTodasDeUnServicioEnSucursal(pIdServicioSucursal: number): any
	
	obtenerEspecialidadesDelRecurso(idRecursoDelServicio): any;
}


export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		// TODO: Separar conceptos. Service muy largo
		module.factory('EspecialidadMedicaDataService', EspecialidadMedicaDataService);

		EspecialidadMedicaDataService.$inject = ['DotService', 'Logger'];

		function EspecialidadMedicaDataService(DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EspecialidadMedicaDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				//API PRESTACIONDELRECURSO
				getAll: getAll,
				getPrestacionById: getPrestacionById,

				validarAsignarAServicio: validarAsignarAServicio,
				asignarAServicio: asignarAServicio,

				obtenerPorServicioEnSucursalSelector: obtenerPorServicioEnSucursalSelector,

				getEspecialidadXServicioId: getEspecialidadXServicioId,
				obtenerPorServicioEnSucursal: obtenerPorServicioEnSucursal,

				validarAsignarARecurso: validarAsignarARecurso,
				asignarARecurso: asignarARecurso,

				//API EspecialidadDelServicio
				validarDesactivarDelServicio: validarDesactivarDelServicio,
				desactivarDelServicio: desactivarDelServicio,

				validarActivarDelServicio: validarActivarDelServicio,
				activarDelServicio: activarDelServicio,

				validarEliminarDelServicio: validarEliminarDelServicio,
				eliminarDelServicio: eliminarDelServicio,

				validarMostrarDelServicioEnPortalWeb: validarMostrarDelServicioEnPortalWeb,
				mostrarDelServicioEnPortalWeb: mostrarDelServicioEnPortalWeb,

				validarOcultarDelServicioEnPortalWeb: validarOcultarDelServicioEnPortalWeb,
				ocultarDelServicioEnPortalWeb: ocultarDelServicioEnPortalWeb,


				//API ESPECIALIDADDELRECURSO
				//activar/desactivar una prestacion del recurso
				obtenerEspecialidadXRecurso: obtenerEspecialidadXRecurso,
				obtenerEspecialidadXRecursDelServicioSucursal: obtenerEspecialidadXRecursDelServicioSucursal,

				validarDesactivarDelRecurso: validarDesactivarDelRecurso,
				desactivarDelRecurso: desactivarDelRecurso,

				validarActivarDelRecurso: validarActivarDelRecurso,
				activarDelRecurso: activarDelRecurso,

				//eliminar prestacion del recurso
				validarEliminarDelRecurso: validarEliminarDelRecurso,
				eliminarDelRecurso: eliminarDelRecurso,

				validarMostrarDelRecursoEnPortalWeb: validarMostrarDelRecursoEnPortalWeb,
				mostrarDelRecursoEnPortalWeb : mostrarDelRecursoEnPortalWeb,
				validarOcultarDelRecursoEnPortalWeb: validarOcultarDelRecursoEnPortalWeb,
				ocultarDelRecursoEnPortalWeb: ocultarDelRecursoEnPortalWeb,

				obtenerTodasDeUnServicio : obtenerTodasDeUnServicio,
				obtenerTodasDeUnServicioEnSucursal : obtenerTodasDeUnServicioEnSucursal,
	
				obtenerEspecialidadesDelRecurso: obtenerEspecialidadesDelRecurso
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* ------------------------------------------- API Especialidad ----------------------------------------- */


			function getAll() {
				var _url = 'Especialidad/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getPrestacionById(pIdEspecialidad) {
				var _url = 'Especialidad/ObtenerPorId/' + pIdEspecialidad;
				return DotService.Get(_url, { isCachable: true });
			}

			function validarAsignarAServicio(pIdEspecialidad, pIdSucursal, pIdPrestacion) {
				var _url = 'Especialidad/ValidarAsignarAServicio/' + pIdEspecialidad + '/' + pIdSucursal + '/' + pIdPrestacion;
				return DotService.Get(_url);
			}


			function asignarAServicio(pIdEspecialidad, pIdSucursal, pIdPrestacion) {
				var _url = 'Especialidad/AsignarAServicio/' + pIdEspecialidad + '/' + pIdSucursal + '/' + pIdPrestacion;
				return DotService.Get(_url);
			}

			function getEspecialidadXServicioId(pIdEspecialidad) {
				var _url = 'EspecialidadDelServicio/ObtenerPorServicioEnSucursal/' + pIdEspecialidad;
				return DotService.Get(_url);
			}

			function obtenerPorServicioEnSucursal(pSucursal, pIdServicio) {
				var _url = 'EspecialidadDelServicio/ObtenerPorServicioEnSucursal/' + pSucursal + "/" + pIdServicio;
				return DotService.Get(_url);
			}

			function obtenerPorServicioEnSucursalSelector(pSucursalServicio) {
				var _url = 'EspecialidadDelServicio/ObtenerPorServicioEnSucursal/' + pSucursalServicio.IdSucursal + "/" + pSucursalServicio.IdServicio;
				return DotService.Get(_url);
			}

			function validarAsignarARecurso(idEspecialidadEnServicio, idRecursoEnServicio) {
				var _url = 'Especialidad/ValidarAsignarARecurso/' + idEspecialidadEnServicio + '/' + idRecursoEnServicio;
				return DotService.Get(_url);
			}

			//        [Route("AsignarARecurso/{idEspecialidadEnServicio}/{idRecursoEnServicio}")]
			function asignarARecurso(idEspecialidadEnServicio, idRecursoEnServicio) {
				var _url = 'Especialidad/AsignarARecurso/' + idEspecialidadEnServicio + '/' + idRecursoEnServicio;
				return DotService.Get(_url);
			}

			/* ------------------------------------------- API EspecialidadDelServicio ------------------------------ */


			function validarDesactivarDelServicio(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/ValidarDesactivar/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function desactivarDelServicio(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/Desactivar/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function validarActivarDelServicio(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/ValidarActivar/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function activarDelServicio(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/Activar/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function validarEliminarDelServicio(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/ValidarEliminar/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function eliminarDelServicio(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/Eliminar/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function validarMostrarDelServicioEnPortalWeb(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/ValidarMostrarEnPortalWeb/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function mostrarDelServicioEnPortalWeb(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/MostrarEnPortalWeb/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function validarOcultarDelServicioEnPortalWeb(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/ValidarOcultarEnPortalWeb/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}

			function ocultarDelServicioEnPortalWeb(pIdEspecialidadDelServicio) {
				var _url = 'EspecialidadDelServicio/OcultarEnPortalWeb/' + pIdEspecialidadDelServicio;
				return DotService.Get(_url);
			}


			/* ------------------------------------------- API EspecialidadDelRecurso- ------------------------------ */

			function obtenerEspecialidadXRecurso(pIdRecursoXServicio) {
				var _url = 'EspecialidadDelRecurso/ObtenerPorRecursoDelServicio/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			function obtenerEspecialidadXRecursDelServicioSucursal(pIdRecurso, pIdTipoRecurso, pIdSucursal, pIdServicio) {
				var _url = 'EspecialidadDelRecurso/ObtenerPorRecursoDelServicio/' + pIdRecurso + '/' + pIdTipoRecurso + '/' + pIdSucursal + '/' + pIdServicio;
				return DotService.Get(_url);
			}

			function validarDesactivarDelRecurso(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/ValidarDesactivar/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}

			function desactivarDelRecurso(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/Desactivar/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}

			function validarActivarDelRecurso(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/ValidarActivar/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}

			function activarDelRecurso(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/Activar/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}

			function validarEliminarDelRecurso(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/ValidarEliminar/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}

			function eliminarDelRecurso(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/Eliminar/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}


			function validarMostrarDelRecursoEnPortalWeb(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/ValidarMostrarEnPortalWeb/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}

			function mostrarDelRecursoEnPortalWeb(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/MostrarEnPortalWeb/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}

			function validarOcultarDelRecursoEnPortalWeb(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/ValidarOcultarEnPortalWeb/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}

			function ocultarDelRecursoEnPortalWeb(pIdEspecialidadDelRecurso) {
				var _url = 'EspecialidadDelRecurso/OcultarEnPortalWeb/' + pIdEspecialidadDelRecurso;
				return DotService.Get(_url);
			}


			function obtenerTodasDeUnServicio(pServicio) {
				var _url = 'Especialidad/ObtenerTodasDeUnServicio/' + pServicio.Id;
				return DotService.Get(_url);
			}

			function obtenerTodasDeUnServicioEnSucursal(pIdServicioSucursal) {
				var _url = 'Especialidad/ObtenerTodasDeUnServicioEnSucursal/' + pIdServicioSucursal.IdServicio + '/' + pIdServicioSucursal.IdSucursal;
				return DotService.Get(_url);
			}

			function obtenerEspecialidadesDelRecurso(idRecursoDelServicio) {
				var _url = 'EspecialidadDelRecurso/ObtenerEspecialidadesDelRecurso/' + idRecursoDelServicio;;
				return DotService.Get(_url);
			}

		}
	};

	return module;

})();