/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('UsuarioGestionDataService', UsuarioGestionDataService);

		UsuarioGestionDataService.$inject = ['DotService', 'AuthorizationService', 'Logger'];

		function UsuarioGestionDataService(DotService, AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UsuarioGestionDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				obtenerTodos: obtenerTodos,
				getUsuarioById: getUsuarioById,
				getUsuarioByIdParaEditar: getUsuarioByIdParaEditar,
				getUsuarioByIdParaVista: getUsuarioByIdParaVista,
				obtenerNuevo: obtenerNuevo,
				guardar: guardar,
				eliminar: eliminar,
				//activar: activar,
				//desactivar: desactivar,
				obtenerParaEditar: obtenerParaEditar,
				obtenerExcepcionPorId: obtenerExcepcionPorId,
				obtenerTodosTipoExcepcionAcceso: obtenerTodosTipoExcepcionAcceso,
				obtenerTodosTipoEntidadExcepcionAcceso: obtenerTodosTipoEntidadExcepcionAcceso,
				obtenerTodosEntidadExcepcionPorTipo: obtenerTodosEntidadExcepcionPorTipo,
				obtenerEntidadExcepcionPorId: obtenerEntidadExcepcionPorId,
				obtenerNuevoExcepcion: obtenerNuevoExcepcion,
				newExcepcionUsuario: newExcepcionUsuario,
				obtenerNuevoEntidadExcepcion : obtenerNuevoEntidadExcepcion,
				eliminarExcepcionUsuario: eliminarExcepcionUsuario,
				guardarExcepcionDelUsuario : guardarExcepcionDelUsuario,
				editarUsuario: editarUsuario,
				obtenerUsuariosPorRol: obtenerUsuariosPorRol,
				obtenerUsuariosPorNombre: obtenerUsuariosPorNombre,
				ObtenerUsuarioConColaboradoresParaLotesPorFiltro: ObtenerUsuarioConColaboradoresParaLotesPorFiltro,

				//change Empresa por usuario
				cambiarEmpresaUsuario : cambiarEmpresaUsuario,
				obtenerParaMostrarJerarquiaDeUsuarios: obtenerParaMostrarJerarquiaDeUsuarios,
				ObtenerUsuarioConColaboradores
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */



			function obtenerTodos() {
				var _url = 'Usuario/ObtenerTodos';
				return DotService.Get(_url);
			}

			function getUsuarioById(pIdUsuario) {
				var _url = 'Usuario/ObtenerPorId/' + pIdUsuario;
				return DotService.Get(_url);
			}

			function getUsuarioByIdParaEditar(pIdUsuario) {
				var _url = 'Usuario/ObtenerParaEditarPorId/' + pIdUsuario;
				return DotService.Get(_url);
			}

			function getUsuarioByIdParaVista(pIdUsuario) {
				var _url = 'Usuario/ObtenerPorIdParaVista/' + pIdUsuario;
				return DotService.Get(_url);
			}
			
			function obtenerNuevo() {
				var _url = 'Usuario/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function guardar(pUsuario) {
				var _url = 'Usuario/Guardar';
				return DotService.Post(_url, pUsuario);
			}

			function eliminar(pIdUsuario) {
				var _url = 'Usuario/Eliminar/' + pIdUsuario;
				return DotService.Get(_url);
			}

			// function desactivar(pIdUsuario) {
			// 	var _url = 'Usuario/Desactivar/' + pIdUsuario;
			// 	return DotService.Get(_url);
			// }

			// function activar(pIdUsuario) {
			// 	var _url = 'Usuario/Activar/' + pIdUsuario;
			// 	return DotService.Get(_url);
			// }

			function obtenerParaEditar(pIdUsuario) {
				var _url = 'Usuario/ObtenerParaEditarPorId/' + pIdUsuario;
				return DotService.Get(_url);
			}

			function obtenerExcepcionPorId(pIdUsuario) {
				var _url = 'Usuario/ObtenerUsuarioExcepcionPorId/' + pIdUsuario;
				return DotService.Get(_url);
			}

			function obtenerTodosTipoExcepcionAcceso() {
				var _url = 'TipoExcepcionAcceso/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerTodosTipoEntidadExcepcionAcceso() {
				var _url = 'TipoEntidadExcepcionAcceso/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerTodosEntidadExcepcionPorTipo(pIdTipo) {
				var _url = 'EntidadExcepcionAcceso/ObtenerTodosPorTipo/' + pIdTipo;
				return DotService.Get(_url);
			}

			function obtenerEntidadExcepcionPorId(pIdTipo, pIdEntidad) {
				var _url = 'EntidadExcepcionAcceso/ObtenerPorId/' + pIdTipo + '/' + pIdEntidad;
				return DotService.Get(_url);
			}

			function obtenerNuevoExcepcion() {
				var _url = 'Usuario/ObtenerNuevoExcepcion';
				return DotService.Get(_url);
			}

			function newExcepcionUsuario(pExcepcionUsuario) {
				var _url = 'Usuario/GuardarUsuarioExcepcion';
				return DotService.Post(_url, pExcepcionUsuario);
			}

			function obtenerNuevoEntidadExcepcion() {
				var _url = 'Usuario/ObtenerNuevoEntidadExcepcion';
				return DotService.Get(_url);
			}

			function eliminarExcepcionUsuario(pIdExcepcionUsuario) {
				var _url = 'Usuario/EliminarExcepcionUsuario/' + pIdExcepcionUsuario;
				return DotService.Get(_url);
			}

			function guardarExcepcionDelUsuario(pExcepcionUsuario) {
				var _url = 'Usuario/GuardarExcepcionDelUsuario';
				return DotService.Post(_url, pExcepcionUsuario);
			}

			function editarUsuario(pUsuario) {
				var _url = 'Usuario/Editar';
				return DotService.Post(_url, pUsuario);
			}

			function obtenerUsuariosPorRol(idRol) {
				var _url = 'Usuario/ObtenerPorRol/' + idRol;
				return DotService.Get(_url);
			}

			function cambiarEmpresaUsuario(pIdEmpresa) {
				var _url = 'Usuario/CambiarEmpresaUsuarioActual/' + pIdEmpresa;
				return DotService.Get(_url);
			}

			function obtenerParaMostrarJerarquiaDeUsuarios(pIdUsuario) {
				var _url = 'Usuario/ObtenerParaMostrarJerarquiaDeUsuarios/' + pIdUsuario;
				return DotService.Get(_url);
			}

			function ObtenerUsuarioConColaboradores(pIdUsuario) {
				var _url = 'Usuario/ObtenerUsuarioConColaboradores/' + pIdUsuario;
				return DotService.Get(_url);
			}
			function obtenerUsuariosPorNombre(nombre) {
				var _url = 'Usuario/ObtenerPorNombre/' + nombre;
				return DotService.Get(_url);
			}
			function ObtenerUsuarioConColaboradoresParaLotesPorFiltro(nombre) {
				var _url = 'Usuario/ObtenerUsuarioConColaboradoresParaLotesPorFiltro/' + nombre;
				return DotService.Get(_url);
			}

		}
	};

	return module;
})();
