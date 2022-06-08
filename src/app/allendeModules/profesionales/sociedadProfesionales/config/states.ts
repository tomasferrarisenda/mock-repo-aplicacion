/**
 * @author 			Jorge Basiluk
 * @description 	SociedadProfesionales
 */
import sociedadProfesionalesEdit = require('../views/sociedadProfesionalesEdit.html');
import sociedadProfesionalesListado = require('../views/listadoSociedadProfesionales.html');
import tabGeneralSociedadEditTemplate = require ('../views/tabs/general.html');
import tabDistribucionesSociedadEditTemplate = require ('../views/tabs/distribuciones.html');
import tabDomicilioSociedadEditTemplate = require ('../views/tabs/domicilio.html');
import tabTelefonoSociedadEditTemplate = require ('../views/tabs/telefono.html');
import tabDocumentoSociedadEditController = require ('../views/tabs/documentoSociedadEdit.html');


export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Profesionales/SociedadProfesionales', '/Profesionales/SociedadProfesionales/List');

			$stateProvider.state({
				name: 'profesionales.sociedadProfesionales',
				url:'/SociedadProfesionales',
				template: '<ui-view/>'
			});

			$stateProvider.state('profesionales.sociedadProfesionales.list', {
				url: '/List',
				template: sociedadProfesionalesListado,
				controller: 'SociedadProfesionalesListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 228
				}
			});

			$stateProvider.state('profesionales.sociedadProfesionales.edit', {
				url: '/Edit',
				template:sociedadProfesionalesEdit,
				controller: 'SociedadProfesionalesEditController',
				controllerAs: 'vm',
				data: {
					idPermiso: 228
				},
				params: {
					sociedadEdit : null,
					esNuevo : null
				}
			});

			$stateProvider.state(
				{
					name : 'profesionales.sociedadProfesionales.edit.general',
					url : '/General',
					template: tabGeneralSociedadEditTemplate,
					controller: 'GeneralSociedadEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.sociedadProfesionales.edit.distribuciones',
					url : '/Distribuciones',
					template: tabDistribucionesSociedadEditTemplate,
					controller: 'DistribucionesSociedadEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.sociedadProfesionales.edit.domicilio',
					url : '/Domicilio',
					template: tabDomicilioSociedadEditTemplate,
					controller: 'DomicilioSociedadEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.sociedadProfesionales.edit.telefono',
					url : '/Telefono',
					template: tabTelefonoSociedadEditTemplate,
					controller: 'TelefonoSociedadEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.sociedadProfesionales.edit.documentos',
					url : '/Documentos',
					template: tabDocumentoSociedadEditController,
					controller: 'DocumentoSociedadEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});
        }
	};

	return module;
})();