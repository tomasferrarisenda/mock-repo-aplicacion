/**
 * @author 			pputasso
 * @description 	description
 */

export interface IPrestacionGestionDataService {
	
		//getAll(): any;
		// getServiciosBySucursal(pIdSucursal: number): any;

		getAll(): any,
		getAllConPrefacturables(idTipoSeparadorDeItems:number): any,
		getPrestacionById(pIdPrestacion: number): any,
		getParaBusqueda() : any,
		obtenerNuevoPrestacio(): any,
		obtenerNuevoPrestacionMedicaPrefacturable(): any,

		obtenerPorIds(pListaIds: number[]): any,
		validarNewPrestacion(pPrestacion: object),
		newPrestacion(pPrestacion: object): any,
		validarPrestacion(pIdPrestacion: number): any,
		borrarPrestacion(pIdPrestacion: number): any,

		validarAsignarAServicio(pIdServicio: number, pIdSucursal: number, pIdPrestacion: number) :any,
		asignarAServicio(pIdServicio: number, pIdSucursal: number, pIdPrestacion: number) :any,

		validarAsignarARecurso(IdPrestacionDelServicio: number,IdRecursoDelServicio: number): any,
		asignarARecurso(IdPrestacionDelServicio: number, IdRecursoDelServicio: number): any,
		
		getTodasPrestacionesXServicio(pIdServicio: number) : any,
		
		/* -- API PrestacionDelServicio -------------------------------- */
		
		obtenerPorServicioEnSucursal(pIdSucursal: number, pIdServicio: number) : any,
		getPrestacionXServicioId(pIdServicio: number) : any,				
		validarDesactivarDelServicio(pIdPrestacionEnServicio: number) : any,
		desactivarDelServicio(pIdPrestacionEnServicio: number) : any,
		validarActivarDelServicio(pIdPrestacionEnServicio: number) : any,
		activarDelServicio(pIdPrestacionEnServicio: number) : any,
		validarEliminarDelServicio(pIdPrestacionEnServicio: number) : any,
		eliminarDelServicio(pIdPrestacionEnServicio: number) : any,

		validarMostrarDelServicioEnPortalWeb(pIdPrestacionEnServicio: number) : any,
		mostrarDelServicioEnPortalWeb(pIdPrestacionEnServicio: number) : any,
		validarOcultarDelServicioEnPortalWeb(pIdPrestacionEnServicio: number) : any,
		ocultarDelServicioEnPortalWeb(pIdPrestacionEnServicio: number) : any,
		
		/* -- API PrestacionDelRecurso --------------------------------- */
		obtenerPorRecursoServicioSucursal(pIdTipoRecurso: number, pIdRecurso: number, pIdServicio: number, pIdSucursal: number) : any,
		obtenerPrestacionXRecurso(pIdRecursoXServicio: number) : any,
		obtenerPrestacionesPorRecursoDelServicio(pIdRecurso, pIdTipoRecurso, pIdSucursal, pIdServicio): any,
		ObtenerPrestacionesDelServicioSucursalActivos(pIdServicio : number, pIdSucursal : number) : any,
		ObtenerPorIdDeUnServicioYSucursalActivos(pIdPrestacion : number, pIdServicio : number, pIdSucursal : number) : any,
		
		validarDesactivarDelRecurso(pIdPrestacionDelRecurso: number) : any,
		desactivarDelRecurso(pIdPrestacionDelRecurso: number) : any,
		validarActivarDelRecurso(pIdPrestacionDelRecurso: number) : any,
		activarDelRecurso(pIdPrestacionDelRecurso: number) : any,
		
		validarEliminarDelRecurso(pIdPrestacionDelRecurso: number) : any,
		eliminarDelRecurso(pIdPrestacionDelRecurso: number) : any

		validarMostrarDelRecursoEnPortalWeb(pIdPrestacionDelRecurso: number) : any,
		mostrarDelRecursoEnPortalWeb(pIdPrestacionDelRecurso: number) : any,
		validarOcultarDelRecursoEnPortalWeb(pIdPrestacionDelRecurso: number) : any,
		ocultarDelRecursoEnPortalWeb(pIdPrestacionDelRecurso: number) : any,

		obtenerTiposPrestaciones() : any,
		exportarListaToXls() : any,

		ObtenerFiltro() : any,
	ObtenerPorFiltroParaLista(filtro): any,
	
	quitarEspecialidadPrestacionDelRecurso(idEspecialidadPrestacion): any,
	asignarEspecialidadPrestacionDelRecurso(idPrestacion,idEspecialidad): any,


		/*Obtener desde Back*/
	}

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		// TODO: Servicio muy largo. Separar conceptos. @ppautasso
		module.factory('PrestacionGestionDataService', PrestacionGestionDataService);

		PrestacionGestionDataService.$inject = ['DotService', 'Logger'];

		function PrestacionGestionDataService(DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrestacionGestionDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				// API PRESTACIONMEDICA
				getAll: getAll,
				getAllConPrefacturables: getAllConPrefacturables,
				getPrestacionById: getPrestacionById,
				obtenerNuevoPrestacion: obtenerNuevoPrestacion,
				obtenerNuevoPrestacionMedicaPrefacturable: obtenerNuevoPrestacionMedicaPrefacturable,
				obtenerPorIds: obtenerPorIds,
				validarNewPrestacion: validarNewPrestacion,
				newPrestacion: newPrestacion,
				validarPrestacion: validarPrestacion,
				borrarPrestacion: borrarPrestacion,
				validarAsignarARecurso : validarAsignarARecurso,
				asignarARecurso: asignarARecurso,
				validarAsignarAServicio: validarAsignarAServicio,
				asignarAServicio: asignarAServicio,
				getParaBusqueda : getParaBusqueda,
				exportarListaToXls : exportarListaToXls,
				obtenerPorGrupoDePrestaciones: obtenerPorGrupoDePrestaciones,

				//Api PRESTACIONDELSERVICIO
				getPrestacionXServicioId: getPrestacionXServicioId,
				getTodasPrestacionesXServicio: getTodasPrestacionesXServicio,
				obtenerPorServicioEnSucursal: obtenerPorServicioEnSucursal,
				validarDesactivarDelServicio: validarDesactivarDelServicio,
				desactivarDelServicio: desactivarDelServicio,
				validarActivarDelServicio: validarActivarDelServicio,
				activarDelServicio : activarDelServicio,
				validarEliminarDelServicio: validarEliminarDelServicio,
				eliminarDelServicio : eliminarDelServicio,

				validarMostrarDelServicioEnPortalWeb: validarMostrarDelServicioEnPortalWeb,
				mostrarDelServicioEnPortalWeb: mostrarDelServicioEnPortalWeb,
				validarOcultarDelServicioEnPortalWeb: validarOcultarDelServicioEnPortalWeb,
				ocultarDelServicioEnPortalWeb: ocultarDelServicioEnPortalWeb,
				
				//API PRESTACIONDELRECURSO
				obtenerPorRecursoServicioSucursal: obtenerPorRecursoServicioSucursal,
				obtenerPrestacionesPorRecursoDelServicio: obtenerPrestacionesPorRecursoDelServicio,
				obtenerPrestacionXRecurso: obtenerPrestacionXRecurso,
				obtenerTiposPrestaciones : obtenerTiposPrestaciones,

				validarDesactivarDelRecurso: validarDesactivarDelRecurso,
				desactivarDelRecurso: desactivarDelRecurso,

				validarActivarDelRecurso: validarActivarDelRecurso,
				activarDelRecurso : activarDelRecurso,
				ObtenerPrestacionesDelServicioSucursalActivos : ObtenerPrestacionesDelServicioSucursalActivos,
				ObtenerPorIdDeUnServicioYSucursalActivos : ObtenerPorIdDeUnServicioYSucursalActivos,

				//eliminar prestacion del recurso
				validarEliminarDelRecurso: validarEliminarDelRecurso,
				eliminarDelRecurso : eliminarDelRecurso,

				validarMostrarDelRecursoEnPortalWeb: validarMostrarDelRecursoEnPortalWeb,
				mostrarDelRecursoEnPortalWeb: mostrarDelRecursoEnPortalWeb,
				validarOcultarDelRecursoEnPortalWeb: validarOcultarDelRecursoEnPortalWeb,
				ocultarDelRecursoEnPortalWeb: ocultarDelRecursoEnPortalWeb,

				// Filtro
				ObtenerFiltro : ObtenerFiltro,
				ObtenerPorFiltroParaLista: ObtenerPorFiltroParaLista,
				
				quitarEspecialidadPrestacionDelRecurso: quitarEspecialidadPrestacionDelRecurso,
				asignarEspecialidadPrestacionDelRecurso: asignarEspecialidadPrestacionDelRecurso
			};

			return service;

			/* ------------------------------------------- API PrestacionMedica ------------------------------------- */

			function getAll() {
				var _url = 'PrestacionMedica/ObtenerTodos';
				return DotService.Get(_url);
			}

			function getAllConPrefacturables(idTipoSeparadorDeItems) {
				var _url = 'PrestacionMedica/ObtenerTodosConPrefacturables/' + idTipoSeparadorDeItems;
				return DotService.Get(_url);
			}

			function getPrestacionById(pIdPrestacion) {
				var _url = 'PrestacionMedica/ObtenerPorId/' + pIdPrestacion;
				return DotService.Get(_url);
			}

			function getParaBusqueda() {
				var _url = 'PrestacionMedica/GetParaBusqueda';
				return DotService.Get(_url);
			}
			
			function obtenerNuevoPrestacion() {
				var _url = 'PrestacionMedica/ObtenerNuevo/';
				return DotService.Get(_url);
			}

			function obtenerNuevoPrestacionMedicaPrefacturable() {
				var _url = 'PrestacionMedica/ObtenerNuevoPrestacionMedicaPrefacturable/';
				return DotService.Get(_url);
			}

			function obtenerPorIds(pListaIds) {
				// pListaIds: lista de Ids concatenada, separador=coma
				// Ejemplo: '1,4,7,8,9'

				var idsConcatenados = pListaIds.join();
				var _url = 'PrestacionMedica/ObtenerPorIds/' + idsConcatenados;
				return DotService.Get(_url);
			}

			function validarNewPrestacion(pPrestacion) {
				var _url = 'PrestacionMedica/ValidarGuardar';
				return DotService.Post(_url, pPrestacion);
			}

			function newPrestacion(pPrestacion) {
				var _url = 'PrestacionMedica/Guardar';
				return DotService.Post(_url, pPrestacion);
			}

			function validarPrestacion(pIdPrestacion) {
				var _url = 'PrestacionMedica/ValidarEliminar/' + pIdPrestacion;
				return DotService.Get(_url);
			}

			function borrarPrestacion(pIdPrestacion) {
				var _url = 'PrestacionMedica/Eliminar/' + pIdPrestacion;
				return DotService.Get(_url);
			}

			function validarAsignarAServicio(pIdServicio, pIdSucursal, pIdPrestacion) {
				var _url = 'PrestacionMedica/ValidarAsignarAServicio/' + pIdServicio + '/' + pIdSucursal + '/' + pIdPrestacion;
				return DotService.Get(_url);
			}

			function asignarAServicio(pIdServicio, pIdSucursal, pIdPrestacion) {
				var _url = 'PrestacionMedica/AsignarAServicio/' + pIdServicio + '/' + pIdSucursal + '/' + pIdPrestacion;
				return DotService.Get(_url);
			}

			// [Route("ValidarAsignarARecurso/{idPrestacionDelServicio}/{idRecursoDelServicio}")]
			function validarAsignarARecurso(IdPrestacionDelServicio,IdRecursoDelServicio) {
				var _url = 'PrestacionMedica/ValidarAsignarARecurso/' + IdPrestacionDelServicio + '/' + IdRecursoDelServicio;
				return DotService.Get(_url);
			}

			// [Route("AsignarARecurso/{idPrestacionDelServicio}/{idRecursoDelServicio}")]
			function asignarARecurso(IdPrestacionDelServicio,IdRecursoDelServicio) {
				var _url = 'PrestacionMedica/AsignarARecurso/' + IdPrestacionDelServicio + '/' + IdRecursoDelServicio;
				return DotService.Get(_url);
			}

			function getTodasPrestacionesXServicio(pIdServicio) {
				var _url = 'PrestacionMedica/ObtenerPrestacionesDelServicio/' + pIdServicio;
				return DotService.Get(_url);
			}

			function exportarListaToXls() {
				var _url = 'PrestacionMedica/ExportListToExcel';
				return DotService.DownloadFile(_url, 'Prestaciones.xlsx');
			}

			function obtenerPorGrupoDePrestaciones(pRelacion){
				var _url = 'PrestacionMedica/ObtenerPorGruposDePrestaciones/' + pRelacion.listaIdsGrupos;
				return DotService.Get(_url);
			}

			/* ------------------------------------------- API PrestacionDelServicio -------------------------------- */
			

			function getPrestacionXServicioId(pIdServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/ObtenerPorServicioEnSucursal/' + pIdServicio;
				return DotService.Get(_url);
			}

			function obtenerPorServicioEnSucursal(pIdSucursal, pIdServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/ObtenerPorServicioEnSucursal/' + pIdSucursal + "/" + pIdServicio;
				return DotService.Get(_url);
			}

			function validarDesactivarDelServicio(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/ValidarDesactivar/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			function desactivarDelServicio(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/Desactivar/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			function validarActivarDelServicio(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/ValidarActivar/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			function activarDelServicio(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/Activar/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			function validarEliminarDelServicio(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/ValidarEliminar/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			function eliminarDelServicio(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/Eliminar/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			// Mostrar y Ocultar en Portal Web
			
			function validarMostrarDelServicioEnPortalWeb(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/ValidarMostrarEnPortalWeb/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			function mostrarDelServicioEnPortalWeb(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/MostrarEnPortalWeb/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			function validarOcultarDelServicioEnPortalWeb(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/ValidarOcultarEnPortalWeb/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			function ocultarDelServicioEnPortalWeb(pIdPrestacionEnServicio) {
				var _url = 'PrestacionDelServicioEnSucursal/OcultarEnPortalWeb/' + pIdPrestacionEnServicio;
				return DotService.Get(_url);
			}

			/* ------------------------------------------- API PrestacionDelRecurso --------------------------------- */

			// obtenerPorRecursoServicioSucursal
			function obtenerPorRecursoServicioSucursal(pIdTipoRecurso, pIdRecurso, pIdServicio, pIdSucursal) {
				var _url = 'PrestacionMedica/ObtenerPorRecursoServicioSucursal/' + pIdTipoRecurso + '/' + pIdRecurso + '/' + pIdServicio + '/' + pIdSucursal;
				return DotService.Get(_url);
			}

			//[Route("ObtenerPorRecursoDelServicio/{idRecursoDelServicio}")]
			function obtenerPrestacionXRecurso(pIdRecursoXServicio) {
				var _url = 'PrestacionDelRecurso/ObtenerPorRecursoDelServicio/' + pIdRecursoXServicio;
				return DotService.Get(_url);
			}

			// [Route("ObtenerPorRecursoDelServicio/{idRecurso}/{idTipoRecurso}/{idSucursal}/{idServicio}")]
			function obtenerPrestacionesPorRecursoDelServicio(pIdRecurso, pIdTipoRecurso, pIdSucursal, pIdServicio) {
				var _url = 'PrestacionDelRecurso/ObtenerPorRecursoDelServicio/' + pIdTipoRecurso + '/' + pIdRecurso + '/' + pIdServicio + '/' + pIdSucursal;
				return DotService.Get(_url);
			}

			function ObtenerPrestacionesDelServicioSucursalActivos(pIdServicio, pIdSucursal) {
				var _url = 'PrestacionMedica/ObtenerPrestacionesDelServicioSucursalActivos/' + pIdServicio + '/' + pIdSucursal;
				return DotService.Get(_url);
			}

			function ObtenerPorIdDeUnServicioYSucursalActivos(pIdPrestacion, pIdServicio, pIdSucursal) {
				var _url = 'PrestacionMedica/ObtenerPorIdDeUnServicioYSucursalActivos/'+ pIdPrestacion +'/' + pIdServicio + '/' + pIdSucursal;
				return DotService.Get(_url);
			}

			

			function validarDesactivarDelRecurso(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/ValidarDesactivar/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function desactivarDelRecurso(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/Desactivar/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function validarActivarDelRecurso(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/ValidarActivar/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function activarDelRecurso(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/Activar/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function validarEliminarDelRecurso(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/ValidarEliminar/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function eliminarDelRecurso(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/Eliminar/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}


			// Mostrar y Ocultar en Portal Web

			function validarMostrarDelRecursoEnPortalWeb(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/ValidarMostrarEnPortalWeb/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function mostrarDelRecursoEnPortalWeb(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/MostrarEnPortalWeb/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function validarOcultarDelRecursoEnPortalWeb(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/ValidarOcultarEnPortalWeb/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function ocultarDelRecursoEnPortalWeb(pIdPrestacionDelRecurso) {
				var _url = 'PrestacionDelRecurso/OcultarEnPortalWeb/' + pIdPrestacionDelRecurso;
				return DotService.Get(_url);
			}

			function obtenerTiposPrestaciones() {
				var _url = 'TiposPrestaciones/ObtenerTodos';
				return DotService.Get(_url);
			}

			//Filtros Para Prestacion Gestion

			function ObtenerFiltro () {
				var url = 'PrestacionMedica/ObtenerFiltro';
				return DotService.Get(url)
			}

			function ObtenerPorFiltroParaLista (filtro) {
				var url = 'PrestacionMedica/ObtenerPorFiltroParaLista';
				return DotService.Post(url, filtro)
			}

			function quitarEspecialidadPrestacionDelRecurso(idEspecialidadPrestacion) {
				var url = 'PrestacionDelRecurso/QuitarEspecialidad/' + idEspecialidadPrestacion;
				return DotService.Get(url)
			}

			function asignarEspecialidadPrestacionDelRecurso(idPrestacion,idEspecialidad) {
				var url = 'PrestacionDelRecurso/AsignarEspecialidad/' + idPrestacion + "/" + idEspecialidad;
				return DotService.Get(url)
			}

			//
		}
	};
	return module;
})();