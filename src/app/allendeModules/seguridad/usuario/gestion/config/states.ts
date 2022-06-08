/**
 * @author 			ppautasso
 * @description 	description
 */

import usuarioGestionListView = require('../views/usuario-gestion-list.html');
import usuarioGestionAsignarRolView = require('../views/usuario-gestion-asignar-rol.html');
import usuarioAsignarExcepcionView = require('../views/usuario-asignar-excepcion.html');

import usuarioNuevoTemplate = require('../views/usuario-new.html');
import usuarioEditTemplate = require('../views/usuario-edit.html');


export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Seguridad/Usuario/Gestion', '/Seguridad/Usuario/Gestion/List');

			$stateProvider.state({
				name: 'usuario.gestion',
				url : '/Gestion',
				template: '<ui-view><sa-loading></sa-loading></ui-view>',
			});


			$stateProvider.state({
				name: 'usuario.gestion.list',
				url : '/List',
				template: usuarioGestionListView,
				controller: 'UsuarioGestionController',
				controllerAs: 'vm',
				data : {
					idPermiso: 126,
					title: 'Lista de todos los usuarios',
					icon: 'LIST'
				}
			});

			$stateProvider.state({
				name: 'usuario.gestion.nuevousuario',
				url : '/Nuevo',
				template: usuarioNuevoTemplate,
				controller: 'UsuarioNewController',
				controllerAs: 'vm',
				params : {
					idUsuario : ''
				},
				data : {
					idPermiso: 129,
					title: 'Nuevo Usuario',
					icon: 'ADD'
				}
			});

			$stateProvider.state({
				name: 'usuario.gestion.editusuario',
				url : '/Editar',
				template: usuarioEditTemplate,
				controller: 'UsuarioEditController',
				controllerAs: 'vm',
				params : {
					idUsuario : ''
				},
				data : {
					idPermiso: 130,
					title: 'Editar Usuario',
					icon: 'EDIT'
				}
			});

			$stateProvider.state({
				name: 'usuario.gestion.asignarRol',
				url : '/Asignar/Rol',
				template: usuarioGestionAsignarRolView,
				controller: 'UsuarioAsignarRolController',
				controllerAs: 'vm',
				params : {
					idUsuario : ''
				},
				data : {
					title: 'Asignar Rol A Usuario',
					icon: 'UP2'
				},
				resolve : {
					Usuario : UsuarioById
				}
			});

			$stateProvider.state({
				name: 'usuario.gestion.asignarExcep',
				url : '/Asignar/Excepcion',
				template: usuarioAsignarExcepcionView,
				controller: 'UsuarioAsignarExcepcionController',
				controllerAs: 'vm',
				params : {
					idUsuario : ''
				},
				data : {
					title: 'Asignar Excepcion A Usuario',
					icon: 'UP2'
				},
				resolve : {
					Usuario : UsuarioById
				}
			});



			UsuarioById.$inject = ['UsuarioGestionDataService', '$stateParams'];
			function UsuarioById (UsuarioGestionDataService, $stateParams) {
				return UsuarioGestionDataService.obtenerParaEditar($stateParams.idUsuario);
			}
		
		}
	};

	return module;

})();