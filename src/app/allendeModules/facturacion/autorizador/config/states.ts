/**
 * @author 			ppautasso
 * @description 	description
 */
import listarAutorizaciones = require ('../views/AutorizacionesList.html');
import editarAutorizaciones =  require ('../views/AutorizacionEdit.html');
import listarExcepcionesList =  require ('../views/ExcepcionesAutorizacionList.html');
import listarExcepcionesView = require ('../views/ExcepcionAutorizacionView.html');

export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {
			//$urlRouterProvider.when('/Autorizador/List', '/Autorizador/List/Autorizaciones');

			$urlRouterProvider.when('/Facturacion/Autorizador/Autorizaciones', '/Facturacion/Autorizador/Autorizaciones/List');
			$urlRouterProvider.when('/Facturacion/Autorizador/Excepciones', '/Facturacion/Autorizador/Excepciones/List');


			$stateProvider.state({
				name: 'facturacion.autorizador',
				url: '/Autorizador',
				//parent : 'facturacion',
				template: '<ui-view/>',
				data: {
					module: 'AUTORIZADOR'
				}
			});


			$stateProvider.state({
				name: 'facturacion.autorizador.autorizaciones',
				url: '/Autorizaciones',
				template: '<ui-view/>'
			});


			$stateProvider.state('facturacion.autorizador.autorizaciones.list', {
				url: '/List',
				template:listarAutorizaciones,
				controller: 'AutorizacionesListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 88,
					title: 'Lista de todas las autorizaciones',
					icon: 'LIST'
				}
			});


			$stateProvider.state('facturacion.autorizador.autorizaciones.editar', {
				url: '/Edit',
				template:editarAutorizaciones,
				controller: 'AutorizacionEditController',
				controllerAs: 'vm',
				data: {
					idPermiso: 88,
					title: 'Editar Autorizaciones',
					icon: 'EDIT'
				}
			});

			$stateProvider.state({
				name: 'facturacion.autorizador.excepciones',
				url: '/Excepciones',
				template: '<ui-view/>'
			});
		
			$stateProvider.state('facturacion.autorizador.excepciones.list', {
				url: '/List',
				template:listarExcepcionesList,
				controller: 'ExcepcionesAutorizacionListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 89,
					title: 'Lista de todas las excepciones',
					icon: 'LIST'
				}
			});

			$stateProvider.state('facturacion.autorizador.excepciones.editar', {
				url: '/Edit',
				template:listarExcepcionesView,
				controller: 'ExcepcionAutorizacionViewController',
				controllerAs: 'vm',
				data: {
					idPermiso: 156,
					title: 'Editar Excepciones',
					icon: 'EDIT'
				}
			});
		}
	};

	return module;
})();