// export interface IAutorizadorDataService {
	
// 	getAll(): any;
// 	getAllTipos(): any;
// 	obtenerTodosDeUnServicio(pIdServicio: number): any;
// 	obtenerRecursoXServicioId(pIdServicio: number): any;
// 	obtenerPorServicioEnSucursal(pIdRelacion: number): any;
// 	obtenerPorServicio(pIdServicio: number): any;
	
// 	validarAsignarAServicio(pIdServicio: number, pIdSucursal: number, pIdRecurso: number, pIdTipoRecurso: number): any
// 	asignarAServicio(pIdServicio: number, pIdSucursal: number, pIdRecurso: number, pIdTipoRecurso: number): any

// 	validarDesactivar(pIdRecursoXServicio: number) : any;
// 	desactivar(pIdRecursoXServicio: number) : any;

// 	validarActivar(pIdRecursoXServicio: number) : any;
// 	activar(pIdRecursoXServicio: number) : any;

// 	validarEliminarXServicio(pIdRecursoXServicio: number) : any;
// 	eliminarXServicio(pIdRecursoXServicio: number) : any;

// 	obtenerPorRecepcion(pIdRecepcion: number, pIdSucursal: number, pSoloActivos: boolean);
// 	obtenerPorRecepcionConTurnos(pIdRecepcion: number, pIdSucursal: number, pFecha: any, pSoloActivos: boolean);
	

// 	getAllEstadoAutorizacion(): any;
// 	getAllTipoDocumento(): any;
// 	getAllEstadoCodigoRespuestaAutorizacion(): any;
// 	getAllTipoMensajeAutorizador(): any;
// 	getAllAutorizacionesByFiltro (fechaDesde: Date, fechaHasta: Date, idSucursal: number, idOrganizacion: number, idMutual: number, 
// 		idPaciente: number, idProfesional: number, idServicio: number, idEstadoAutorizacion: number, idEstadoCodigoRespuesta: number, idTipoMensaje: number, 
// 		nroSolicitud: number, practica: number, nroPaciente: number, currentPage: number, pageSize: number): any;

// 	// function updateAutorizacion (pAutorizacion) {
// 	// 	var _url = 'Autorizacion/Update';
// 	// 	return DotService.Post(_url, pAutorizacion);
// 	// }

// 	getAutorizacionById (id: number): any;	
// 	getAutorizacionPorIdParaView (id: number): any;
// 	getItems (idAutorizacion: number): any;
// 	getAllMutual(): any;
// 	getMutualByCodigo(codigo: number): any;
// 	getAllOrganizacion(): any;
// 	getOrganizacionByCodigo(codigo: number): any;
// 	getAllPaciente(): any;
// 	getPacienteByDocumento(documento: number): any;
// 	getAllServicio(): any;
// 	getAllSucursal(): any;
// 	getAllSucursalSinTodas(): any;
// 	getAllExcepcionesByFiltro (idTipoExcepcion: number, idMutual: number, idPracticaMedica: number): any;
// 	guardarExcepcion (pExcepcion: number): any;
// 	getExcepcionById (id: number): any;
// 	validarGuardar (pExcepcion: object): any;
// 	newExcepcion(): any;
// 	deleteExcepcion(pIdExcepcion: number): any;
// 	getAllPracticaMedica(): any;
// 	getPracticaByCodigo(codigo: number): any;
// 	getAllTipoExcepciones(): any;
// 	getAllTipoExcepcionesEntidad(): any;
// 	newAutorizacion(): any;
// 	newItemAutorizacion(): any;
// 	guardarAutorizacion(pAutorizacion: object): any;
// 	reenviarAutorizacion (pIdAutorizacion: number): any;
// 	reenviarAutorizaciones (pIdsAutorizaciones: string): any;
// 	consultarAutorizacion (pIdAutorizacion: number): any;
// 	anularAutorizacion (pIdAutorizacion: number);
// 	validarGuardarAutorizacion (pAutorizacion: object): any;
// 	getAllCIE10(): any;
// 	getCIE10ByCodigo(codigo: number): any;
// 	getAllPlanes(): any;
// 	getAllMutualConAutorizador(): any;
// 	getAllOrganizacionConAutorizador(): any;
// 	getOrdenPractica(pIdAutoriacion: number): any;
// 	getOrdenPracticaPaciente(pIdAutoriacion: number): any;
// 	getOrdenPracticaPorTurno(pIdTurno: number): any;
// }

export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('AutorizadorDataService', AutorizadorDataService);

		AutorizadorDataService.$inject = ['DotService', '$log']
		
		function AutorizadorDataService (DotService, $log) {

			//$log.debug('AutorizadorDataService: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			var idAutorizacion = 0;
			var autorizacion = '';
			var autorizacionView = null;

			var excepcion = '';
			var ordenPractica = '';

			var sucursalFiltroBusqueda = null;
			var servicioFiltroBusqueda = null;
			var estadoAutorizacionFiltroBusqueda = null;
			var estadoCodigoRespuestaFiltroBusqueda = null;
			var tipoMensajeFiltroBusqueda = null;
			var codigoOrganizacionFiltroBusqueda = null;
			var nombreOrganizacionFiltroBusqueda = null;
			var idPacienteFiltroBusqueda = null;
			var matriculaProfesionalFiltroBusqueda = null;
			var nombreProfesionalFiltroBusqueda = null;
			var organizacionFiltroBusqueda = null;
			var profesionalFiltroBusqueda = null;
			var nroSolicitudFiltroBusqueda = null;
			
			var codigopracticaMedicaFiltroBusqueda = null;
			var nombrepracticaMedicaFiltroBusqueda = null;
			var practicaMedicaFiltroBusqueda = null;

			var nroPacienteFiltroBusqueda = null;
			
			var cantidadRegistrosFiltroBusqueda = null;
			var currentPageFiltroBusqueda = null;
			var fechaDesdeFiltroBusqueda = new Date();
			var fechaHastaFiltroBusqueda = new Date();

			var codigoMutualFiltroBusqueda = null;
			var nombreMutualFiltroBusqueda = null;
			var mutualFiltroBusqueda = null;
			var tipoExcepcionFiltroBusqueda = null;

			const service = {
				getAllEstadoAutorizacion : getAllEstadoAutorizacion,
				getAllEstadoCodigoRespuestaAutorizacion : getAllEstadoCodigoRespuestaAutorizacion,
				getAllTipoMensajeAutorizador : getAllTipoMensajeAutorizador,
				//getAllSucursal : getAllSucursal,
				//getAllSucursalSinTodas : getAllSucursalSinTodas,
				getAllMutual : getAllMutual,
				getMutualByCodigo : getMutualByCodigo,
				getAllOrganizacion : getAllOrganizacion,
				getOrganizacionByCodigo : getOrganizacionByCodigo,
				//getAllServicio : getAllServicio,
				updateAutorizacion : updateAutorizacion,
				getAutorizacionById : getAutorizacionById,
				getAutorizacionPorIdParaView : getAutorizacionPorIdParaView,
				getAllAutorizacionesByFiltro : getAllAutorizacionesByFiltro,
				getAllPaciente : getAllPaciente,
				getPacienteByDocumento : getPacienteByDocumento,
				getAllTipoExcepciones : getAllTipoExcepciones,
				getAllPracticaMedica : getAllPracticaMedica,
				getPracticaByCodigo : getPracticaByCodigo,
				guardarExcepcion : guardarExcepcion,
				validarGuardar : validarGuardar,
				getAllExcepcionesByFiltro : getAllExcepcionesByFiltro,
				newExcepcion : newExcepcion,
				getExcepcionById : getExcepcionById,
				deleteExcepcion : deleteExcepcion,
				getAllTipoExcepcionesEntidad : getAllTipoExcepcionesEntidad,
				newAutorizacion : newAutorizacion,
				newItemAutorizacion : newItemAutorizacion,
				guardarAutorizacion : guardarAutorizacion,
				reenviarAutorizacion : reenviarAutorizacion,
				reenviarAutorizaciones : reenviarAutorizaciones,
				consultarAutorizacion : consultarAutorizacion,
				anularAutorizacion : anularAutorizacion,
				validarGuardarAutorizacion : validarGuardarAutorizacion,
				getAllPlanes : getAllPlanes,
				getItems : getItems,
				getAllMutualConAutorizador : getAllMutualConAutorizador,
				getAllMutualConAutorizadorNoHijas : getAllMutualConAutorizadorNoHijas,
				getAllOrganizacionConAutorizador : getAllOrganizacionConAutorizador,
				getOrdenPractica : getOrdenPractica,
				getOrdenPracticaPorTurno : getOrdenPracticaPorTurno,
				getOrdenPracticaPaciente : getOrdenPracticaPaciente,
				getOrdenPracticaPorPrefactura : getOrdenPracticaPorPrefactura,
				getAllCIE10 : getAllCIE10,
				getCIE10ByCodigo : getCIE10ByCodigo,
				getAllTipoDocumento : getAllTipoDocumento,
				exportarOrdenPracticaPorPrefactura : exportarOrdenPracticaPorPrefactura
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function getAllEstadoAutorizacion () {
				var _url = 'EstadoAutorizacion/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTipoDocumento () {
				var _url = 'TipoDocumento/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });	
			}

			function getAllEstadoCodigoRespuestaAutorizacion () {
				var _url = 'EstadoCodigoRespuestaAutorizacion/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTipoMensajeAutorizador () {
				var _url = 'TipoMensajeAutorizador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}	

			function getAllAutorizacionesByFiltro (fechaDesde, fechaHasta, idSucursal, idOrganizacion, idMutual, 
				idPaciente, idProfesional, idServicio, idEstadoAutorizacion, idEstadoCodigoRespuesta, idTipoMensaje, 
				nroSolicitud, practica, nroPaciente, currentPage, pageSize) {
				var _url = 'Autorizacion/GetByFiltros/' + fechaDesde + '/' + fechaHasta + '/' + idSucursal + '/' + idOrganizacion + '/' + idMutual + 
					'/' + idPaciente + '/' + idProfesional + '/' + idServicio + '/' +  idEstadoAutorizacion + '/' +  
					idEstadoCodigoRespuesta + '/' +  idTipoMensaje + '/' + nroSolicitud + '/' + practica + '/' + nroPaciente + '/' + currentPage + '/' + pageSize;
				return DotService.Get(_url);
			}

			function updateAutorizacion (pAutorizacion) {
				var _url = 'Autorizacion/Update';
				return DotService.Post(_url, pAutorizacion);
			}

			function getAutorizacionById (id) {
				var _url = 'Autorizacion/ObtenerPorIdParaEdicion/' + id;
				return DotService.Get(_url);
			}
			
			function getAutorizacionPorIdParaView (id) {
				var _url = 'Autorizacion/ObtenerPorIdParaView/' + id;
				return DotService.Get(_url);
			}

			function getItems (idAutorizacion) {
				var _url = 'Autorizacion/GetItems/' + idAutorizacion;
				return DotService.Get(_url);
			}

			function getAllMutual () {
				var _url = 'Mutual/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getMutualByCodigo (codigo) {
				var _url = 'Mutual/GetByCodigo/' + codigo;
				return DotService.Get(_url);
			}

			function getAllOrganizacion () {
				var _url = 'Organizacion/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getOrganizacionByCodigo (codigo) {
				var _url = 'Organizacion/GetByCodigo/' + codigo;
				return DotService.Get(_url);
			}

			function getAllPaciente () {
				var _url = 'legacy/PacienteMedico/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getPacienteByDocumento (documento) {
				var _url = 'legacy/PacienteMedico/GetByDocumento/' + documento;
				return DotService.Get(_url);
			}

			function getAllExcepcionesByFiltro (idTipoExcepcion, idMutual, idPracticaMedica) {
				var _url = 'ExcepcionAutorizacion/GetByFiltros/' + idTipoExcepcion + '/'+ idMutual + '/'+ idPracticaMedica;
				return DotService.Get(_url);
			}

			function guardarExcepcion (pExcepcion) {
				var _url = 'ExcepcionAutorizacion/Guardar';
				return DotService.Post(_url, pExcepcion);
			}

			function getExcepcionById (id) {
				var _url = 'ExcepcionAutorizacion/ObtenerPorId/' + id;
				return DotService.Get(_url);
			}

			function validarGuardar (pExcepcion) {							
				var _url = 'ExcepcionAutorizacion/ValidarGuardar';
				return DotService.Post(_url, pExcepcion)
			}

			function newExcepcion () {
				var _url = 'ExcepcionAutorizacion/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function deleteExcepcion (pIdExcepcion) {							
				var _url = 'ExcepcionAutorizacion/Eliminar/' + pIdExcepcion;
				return DotService.Get(_url);				
			}

			function getAllPracticaMedica () {
				var _url = 'legacy/PracticaMedica/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getPracticaByCodigo (codigo) {				
				var _url = 'legacy/PracticaMedica/GetByCodigo/' + codigo;
				return DotService.Get(_url);
			}

			function getAllTipoExcepciones () {
				var _url = 'TipoExcepcionAutorizacion/GetAllParaCombo';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTipoExcepcionesEntidad () {
				var _url = 'TipoExcepcionAutorizacion/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function newAutorizacion() {
				var _url = 'Autorizacion/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function newItemAutorizacion() {
				var _url = 'Autorizacion/ObtenerNuevoItem';
				return DotService.Get(_url);
			}

			function guardarAutorizacion (pAutorizacion) {
				var _url = 'Autorizacion/Guardar';
				return DotService.Post(_url, pAutorizacion);
			}

			function reenviarAutorizacion (pIdAutorizacion) {
				var _url = 'Autorizacion/ReenviarAutorizacion/' + pIdAutorizacion;
				return DotService.Get(_url);
			}

			function reenviarAutorizaciones (pIdsAutorizaciones) {
				var _url = 'Autorizacion/ReenviarAutorizacionesMasivo/' + pIdsAutorizaciones;
				return DotService.Get(_url);
			}

			function consultarAutorizacion (pIdAutorizacion) {
				var _url = 'Autorizacion/ConsultarAutorizacion/' + pIdAutorizacion;
				return DotService.Get(_url);
			}

			function anularAutorizacion (pIdAutorizacion) {
				var _url = 'Autorizacion/AnularAutorizacion/' + pIdAutorizacion;
				return DotService.Get(_url);
			}

			function validarGuardarAutorizacion (pAutorizacion) {
				var _url = 'Autorizacion/ValidarGuardar';
				return DotService.Post(_url, pAutorizacion)
			}

			function getAllCIE10 () {
				var _url = 'DiagnosticoCie10/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getCIE10ByCodigo (codigo) {
				var _url = 'DiagnosticoCie10/ObtenerPorCodigo/' + codigo;
				return DotService.Get(_url);
			}

			function getAllPlanes () {
				var _url = 'PlanMutual/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getAllMutualConAutorizador () {
				var _url = 'Mutual/GetParaBusquedaConAutorizador';
				return DotService.Get(_url);
			}

			function getAllMutualConAutorizadorNoHijas () {
				var _url = 'Mutual/GetParaBusquedaConAutorizadorNoHijas';
				return DotService.Get(_url);
			}

			function getAllOrganizacionConAutorizador () {
				var _url = 'Organizacion/GetConAutorizador';
				return DotService.Get(_url);
			}

			function getOrdenPractica(pIdAutoriacion) {
				var _url = 'Autorizacion/GetOrdenPractica/' + pIdAutoriacion;
				return DotService.Get(_url);
			}

			function getOrdenPracticaPaciente(pIdAutoriacion) {
				var _url = 'Autorizacion/GetOrdenPracticaPaciente/' + pIdAutoriacion;
				return DotService.Get(_url);
			}

			function getOrdenPracticaPorTurno(pIdTurno) {
				var _url = 'Autorizacion/GetOrdenPracticaPorTurno/' + pIdTurno;
				return DotService.Get(_url);
			}

			function getOrdenPracticaPorPrefactura(pIdPrefactura) {
				var _url = 'Autorizacion/GetOrdenPracticaPorPrefactura/' + pIdPrefactura;
				return DotService.Get(_url);
			}

			function exportarOrdenPracticaPorPrefactura(pIdPrefactura) {
				var _url = 'Autorizacion/ExportarOrdenPracticaPorPrefacturaPdf/'+pIdPrefactura;
				return DotService.DownloadFile(_url, 'OrdenPractica.pdf');
			}
		};
	};

	return module;
})();