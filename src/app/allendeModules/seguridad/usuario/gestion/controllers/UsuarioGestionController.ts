/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };
	module.init = function(module) {
		module.controller('UsuarioGestionController', UsuarioGestionController);
		// Inyeccion de dependencia
		UsuarioGestionController.$inject = ['$scope', '$filter', 'orderByFilter', 'Logger', '$q', '$state',
			'ModalService',
			'UsuarioGestionDataService',
			'UsuarioGestionLogicService', 'UsuarioGestionAuthService',
			'User'

		];
		// Constructor del Controller
		function UsuarioGestionController($scope, $filter, orderByFilter, $log, $q, $state,
			ModalService,
			UsuarioGestionDataService,
			UsuarioGestionLogicService, UsuarioGestionAuthService,
			User
		) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('UsuarioGestionController');
			//$log.debug('ON.-');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			var vm = this;
			vm.title = {
				page: $state.current.data.title
			};
			// vm.sucursal = User.Sucursal;
			vm.order = {};

			vm.estadoUsuario = [{
				activo: true,
				estado: "ACTIVO"
			},
			{
				activo: false,
				estado: "DESACTIVO"
			}
			];
			//vm.listOrderBy = HABITACION_ORDER;
			vm.formControl = {
				esAll: false,
				loading: false,
				stateLoading: false,
				reloadPage: activate
			};
			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.filter = {
				legajo: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			vm.data = {
				usuarios: {}
			};

			vm.data.tipoUsuario = [
			{
				id: 0,
				Nombre: 'Interno'
			},
			{
				id: 1,
				Nombre: 'Externo'
			}
			];

			vm.usuario = {
				new: nuevoUsuario,
				edit: editUsuario,
				view: verUsuario,
				asignar: asignarRol,
				delete: borrarUsuario,
				verUsuariosACargo: verUsuariosACargo
			};

			vm.validar = {
				puedeCrear: validarPuedeCrear,
				puedeEditar: validarPuedeEditar,
				puedeEliminar: validarPuedeEliminar,
				puedeVer: validarPuedeVer,
				puedeAsignar: validarPuedeAsignar
			};
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function nuevoUsuario() {
				if (UsuarioGestionAuthService.puedeCrear(User)) {
					// UsuarioGestionLogicService.newUsuario(User)
					// 	.then(newUsuarioOk, newUsuarioError);

					$state.go('usuario.gestion.nuevousuario', {
						idUsuario: ''
					});
				}
				
			}

			function editUsuario(pUsuario) {

				$log.debug('editUsuario OK.-');

				if (UsuarioGestionAuthService.puedeEditar(User)) {
					$state.go('usuario.gestion.editusuario', {
						idUsuario: pUsuario.Id
					});
				}

				// function editUsuarioOk(pResult) {
				// 	activate();
				// }

				// function editUsuarioError(pError) {
				// 	$log.error('editUsuario OK.-', pError);
				// }
			}

			function verUsuario(pUsuario) {
				if (UsuarioGestionAuthService.puedeVer(User)) {
					UsuarioGestionLogicService.openUsuario(pUsuario.Id)
						.then(openUsuarioOk, openUsuarioError);
				}

				function openUsuarioOk(pResult) { }

				function openUsuarioError(pError) {
					$log.error('editUsuario OK.-', pError);
				}

			}

			function asignarRol(pUsuario) {
				if (UsuarioGestionAuthService.puedeAsignarRol(User)) {
					UsuarioGestionAuthService.selectAsignar(User)
						.then(function(pState) {
							//$log.debug('Estado ELEGIDO: ', pState);
							$state.go(pState.State, {
								idUsuario: pUsuario.Id
							});
						});
				}

			}

			function borrarUsuario(pUsuario) {
				if (UsuarioGestionAuthService.puedeEliminar(User)) {
					UsuarioGestionLogicService.deleteUsuario(pUsuario)
						.then(deleteUsuario, deleteUsuarioError);
				}

				function deleteUsuario(pResult) {
					activate();
				}

				function deleteUsuarioError(pError) {
					$log.error('deleteUsuarioError .-', pError);
				}

			}

			function verUsuariosACargo(usuario) {
				$log.debug('verUsuariosACargo',usuario);
				// abrimos el componente de jerarquia de usuarios
				UsuarioGestionLogicService.verUsuariosACargo(usuario);
			}

			/* VALIDACIONES */

			function validarPuedeCrear() {
				return UsuarioGestionAuthService.puedeCrear(User);
			}

			function validarPuedeEditar() {
				return UsuarioGestionAuthService.puedeEditar(User);
			}

			function validarPuedeEliminar() {
				return UsuarioGestionAuthService.puedeEliminar(User);
			}

			function validarPuedeVer() {
				return UsuarioGestionAuthService.puedeVer(User);
			}

			function validarPuedeAsignar() {
				return UsuarioGestionAuthService.puedeAsignarRol(User);
			}


			/* PAGINACIÓN */
			function cleanFilters() {
				vm.filter.legajo = '';
				vm.filter.nombre = '';
				vm.filter.nombreUsuario = '';
				vm.filter.tipo = '';
				vm.filter.estadoUsuario = '';
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.legajo === null)
					vm.filter.legajo = '';
				if (vm.filter.nombre === null)
					vm.filter.nombre = '';
				if (vm.filter.nombreUsuario === null)
					vm.filter.nombreUsuario = '';
				if (vm.filter.tipo === null)
					vm.filter.tipo = '';
				if (vm.filter.estadoUsuario === null)
					vm.filter.estadoUsuario = '';


				vm.order = {
					id: 1,
					value: 'Legajo',
					descripcion: 'Legajo (Asc)',
					reverse: false
				};
			}

			function getPage() {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.usuarios = orderByFilter(vm.data.usuarios, vm.order.value, vm.order.reverse);
				vm.filter.usuarios = $filter('filter')
					(vm.data.usuarios, {
						Legajo: vm.filter.legajo,
						Nombre: vm.filter.nombre,
						UserName: vm.filter.nombreUsuario,
						Tipo: vm.filter.tipo,
						Activo: vm.filter.estadoUsuario
					});
				vm.paginacion.totalItems = vm.filter.usuarios.length;
				vm.filter.usuarios = vm.filter.usuarios.slice(begin, end);
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();


			function activate() {


				vm.formControl.loading = true;

				var _usuarios = UsuarioGestionDataService.obtenerTodos();

				$q.all([
						_usuarios

					])
					.then(activateOk, activateError);

				function activateOk(pResults) {
					vm.data.usuarios = pResults[0];

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 6;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;
					vm.filter.clean();
					$log.debug('Inicializar OK.-', pResults);
				}

				function activateError(pError) {
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;

					//$uibModalInstance.dismiss(pError);
					//$log.error('Inicializar ERROR.-', pError);
				}
			}
		}
	};
	return module;
})();