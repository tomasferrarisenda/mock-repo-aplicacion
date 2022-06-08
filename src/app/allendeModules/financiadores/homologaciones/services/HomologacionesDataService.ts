export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('HomologacionesDataService', HomologacionesDataService);

		HomologacionesDataService.$inject = ['DotService', '$log']
		
		function HomologacionesDataService (DotService, $log) {

			//$log.debug('HomologacionesDataService: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			var homologacion = null;
			var tipoHomologacion = null;

			var sucursalFiltroBusqueda = null;
			var servicioFiltroBusqueda = null;
			var tipoHomologacionFiltroBusqueda = null;
			var tipoDocumentoFiltroBusqueda = null;			
			
			var codigoOrganizacionFiltroBusqueda = null;
			var nombreOrganizacionFiltroBusqueda = null;
			var organizacionFiltroBusqueda = null;
			
			var matriculaProfesionalFiltroBusqueda = null;
			var nombreProfesionalFiltroBusqueda = null;
			var profesionalFiltroBusqueda = null;

			var codigopracticaMedicaFiltroBusqueda = null;
			var nombrepracticaMedicaFiltroBusqueda = null;
			var practicaMedicaFiltroBusqueda = null;
			
			var codigoMutualFiltroBusqueda = null;
			var nombreMutualFiltroBusqueda = null;
			var mutualFiltroBusqueda = null;

			var currentPageFiltroBusqueda = null;

			const service = {
				getAllTipoHomologaciones : getAllTipoHomologaciones,
				getAllOrganizacion : getAllOrganizacion,
				getOrganizacionByCodigo : getOrganizacionByCodigo,
				getAllMutual : getAllMutual,
				getMutualByCodigo : getMutualByCodigo,
				//getAllServicio : getAllServicio,
				//getAllSucursal : getAllSucursal,
				getAllTipoDocumento : getAllTipoDocumento,
				getAllPracticaMedica : getAllPracticaMedica,
				getPracticaByCodigo : getPracticaByCodigo,
				guardarHomologacion : guardarHomologacion,
				validarGuardar : validarGuardar,
				getAllHomologacionesByFiltro : getAllHomologacionesByFiltro,
				getAllPlanes : getAllPlanes,
				newHomologacion : newHomologacion,
				getHomologacionById : getHomologacionById,
				deleteHomologacion : deleteHomologacion
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function getAllHomologacionesByFiltro (idTipoHomologacion, idOrganizacion, idMutual, idSucursal, idServicio, 
				matProfesional, idPracticaMedica, idTipoDocumento, currentPage, pageSize) {
				var _url = 'HomologacionMutual/GetByFiltros/' + idTipoHomologacion + '/'+ idOrganizacion + '/'+ idMutual + '/'+ idSucursal + '/'+ idServicio + '/'+ 
				matProfesional + '/'+ idPracticaMedica + '/'+ idTipoDocumento + '/' + currentPage + '/' + pageSize;
				return DotService.Get(_url);
			}

			function guardarHomologacion (pHomologacion) {
				var _url = 'HomologacionMutual/Guardar';
				return DotService.Post(_url, pHomologacion);
			}

			function getHomologacionById (id) {
				var _url = 'HomologacionMutual/ObtenerPorId/' + id;
				return DotService.Get(_url);	
			}

			function validarGuardar (pHomologacion) {							
				var _url = 'HomologacionMutual/ValidarGuardar';
				return DotService.Post(_url, pHomologacion)
			}

			function newHomologacion () {
				var _url = 'HomologacionMutual/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function deleteHomologacion (pIdHomologacion) {							
				var _url = 'HomologacionMutual/Eliminar/' + pIdHomologacion;
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

			function getAllPlanes () {
				var _url = 'PlanMutual/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getAllTipoDocumento () {
				var _url = 'TipoDocumento/GetAllParaCombo';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllPracticaMedica () {
				var _url = 'legacy/PracticaMedica/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getPracticaByCodigo (codigo) {				
				var _url = 'legacy/PracticaMedica/GetByCodigo/' + codigo;
				return DotService.Get(_url);
			}

			function getAllTipoHomologaciones () {
				var _url = 'TipoHomologacion/GetAllParaCombo';
				return DotService.Get(_url, { isCachable: true });
			}

		};
	};

	return module;
})();