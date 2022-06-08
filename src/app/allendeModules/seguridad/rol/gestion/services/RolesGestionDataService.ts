/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('RolesGestionDataService', RolesGestionDataService);

		RolesGestionDataService.$inject = ['DotService', 'AuthorizationService', 'Logger'];

		function RolesGestionDataService(DotService, AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RolesGestionDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {


				//API ROL
				getAll: getAll,
				getRolById: getRolById,
				getRolByIdConModulosYPermisos : getRolByIdConModulosYPermisos,

				getNuevoRol: getNuevoRol,

				validarGuardar : validarGuardar,
				guardar: guardar,

				validarEliminar : validarEliminar,
				eliminar : eliminar,

				


			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* ------------------------------------------- API /Rol ------------------------------------------------- */


			function getAll() {
				var _url = 'Rol/ObtenerTodos';
				return DotService.Get(_url);
			}

			function getRolById(pIdRol) {
				var _url = 'Rol/ObtenerPorId/' + pIdRol;
				return DotService.Get(_url);
			}

			function getRolByIdConModulosYPermisos(pIdRol) {
				var _url = 'Rol/ObtenerPorIdConModulosYPermisos/' + pIdRol;
				return DotService.Get(_url);
			}

			function getNuevoRol() {
				var _url = 'Rol/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function validarGuardar(pRol) {
				var _url = 'Rol/ValidarGuardar';
				return DotService.Post(_url, pRol);
			}

			function guardar(pRol) {
				var _url = 'Rol/Guardar';
				return DotService.Post(_url, pRol);
			}

			function validarEliminar(pIdRol) {
				var _url = 'Rol/ValidarEliminar/' + pIdRol;
				return DotService.Get(_url);
			}

			function eliminar(pIdRol) {
				var _url = 'Rol/Eliminar/' + pIdRol;
				return DotService.Get(_url);
			}
			

		}
	};

	return module;
})();
