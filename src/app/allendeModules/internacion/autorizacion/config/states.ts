/**
 * @author 			emansilla
 * @description 	description
 */
import autorizacionNewTemplate = require('../views/autorizacion-new.html');
import autorizacionEditTemplate = require('../views/autorizacion-edit.html');
import autorizacionViewTemplate = require('../views/autorizacion-view.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			/* AUTORIZACION */

			// $urlRouterProvider.when('', '');
			
			$stateProvider.state({
				name : 'autorizacion',
				url : '/Autorizacion',
				parent : 'internacion',
				template : '<ui-view><sa-loading></sa-loading></ui-view>',
				data : {
					module : 'INTERNACION',
					path : 'Internacion/Internado'
				}
			});

			$stateProvider.state({
				name : 'autorizacion.new',
				url : '/Add',
				template : autorizacionNewTemplate,
				controller: 'AutorizacionInternadoNewController',
				controllerAs: 'vm',
				params : {
					idInternacion : 0
				},
				data : {
					title : 'Nueva autorización - Internado N° ',
					idPermiso : 140,
					editable : true,
					new : true
				},
				resolve : {
					Autorizacion : NewAutorizacion,
					EstadosAdmision : EstadosAdmision,
					Internacion : InternadoById
				}
			});

			InternadoById.$inject = ['AdmisionDataService', '$stateParams'];
			function InternadoById(AdmisionDataService, $stateParams) {
				if (!$stateParams.idInternacion) return; 
				return AdmisionDataService.getOneInternacion($stateParams.idInternacion);
			}

			NewAutorizacion.$inject = ['IntervencionDataService', '$stateParams'];
			function NewAutorizacion(IntervencionDataService, $stateParams) {
				if (!$stateParams.idInternacion) return;

				return IntervencionDataService.New($stateParams.idInternacion);
			}

			AutorizacionById.$inject = ['IntervencionDataService', '$stateParams'];
			function AutorizacionById(IntervencionDataService, $stateParams) {
				if (!$stateParams.idIntervencion) return;

				return IntervencionDataService.GetOne($stateParams.idIntervencion);
			}

			EstadosAdmision.$inject = ['InternacionCommonDataService'];
			function EstadosAdmision (InternacionCommonDataService) {
				return InternacionCommonDataService.getAllEstadoAdmision();
			}

			$stateProvider.state({
				name : 'autorizacion.editSelect',
				url : '/EditSelect',
				template : 'resolviendo ...',
				params : {
					idInternacion : 0,
					idIntervencion : 0
				},
				data : {
					idPermiso : 144
				},
				controller: 'AutorizacionInternadoEditInterceptorController'
			});

			$stateProvider.state({
				name : 'autorizacion.edit',
				url : '/Edit',
				template : autorizacionEditTemplate,
				controller : 'AutorizacionInternadoEditController',
				controllerAs : 'vm',
				params : {
					idInternacion : 0,
					idIntervencion : 0
				},
				data : {
					title : 'Editar autorización - Internado N° ',
					idPermiso : 144
				},
				resolve : {
					Autorizacion : AutorizacionById,
					EstadosAdmision : EstadosAdmision,
					Internacion : InternadoById
				}
			});

			$stateProvider.state({
				name : 'autorizacion.edit.gestion',
				url : '/Gestion',
				data : {
					autorizado : false,
					idPermiso : 141
				}
			});

			$stateProvider.state({
				name : 'autorizacion.edit.autorizado',
				url : '/Autorizado',
				data : {
					autorizado : true,
					idPermiso : 142
				}
			});

			$stateProvider.state({
				name : 'autorizacion.view',
				url : '/View',
				template: autorizacionViewTemplate,
				controller: 'AutorizacionInternadoViewController',
				controllerAs: 'vm',
				params : {
					idInternacion : 0,
					idIntervencion : 0
				},
				data : {
					title : 'Ver autorización - Internado N° ',
					idPermiso : 143
				},
				resolve : {
					Autorizacion : AutorizacionById,
					EstadosAdmision : EstadosAdmision,
					Internacion : InternadoById
				}
			});
		}
	};

	return module;

})();