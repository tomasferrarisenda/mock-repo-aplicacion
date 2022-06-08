/**
 * @author 			Jorge Basiluk
 * @description 	Profesionales
 */
import profesionalesListado = require('../views/listadoProfesionales.html');
import profesionalesEdit = require('../views/profesionalEdit.html');
import tabGeneralProfesionalEditTemplate = require ('../views/tabs/general.html');
import tabDistribucionesProfesionalEditTemplate = require ('../views/tabs/distribuciones.html');
import tabDomicilioProfesionalEditTemplate = require ('../views/tabs/domicilio.html');
import tabTelefonoProfesionalEditTemplate = require ('../views/tabs/telefono.html');
import tabNacionalidadProfesionalEditTemplate = require ('../views/tabs/nacionalidad.html');
import tabSegurosProfesionalEditTemplate = require ('../views/tabs/seguros.html');
import tabDocumentoProfesionalEditTemplate = require ('../views/tabs/documentoProfesional.html');
import tabProfesionalDefectoEditTemplate = require ('../views/tabs/profesionalDefecto.html');

export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Profesionales/Profesionales', '/Profesionales/Profesionales/List');
			// $urlRouterProvider.when('/Profesionales/Profesionales/Edit', '/Profesionales/Profesionales/Edit/General');

			$stateProvider.state({
				name: 'profesionales.profesionales',
				url:'/Profesionales',
				template: '<ui-view/>'
			});

			$stateProvider.state('profesionales.profesionales.list', {
				url: '/List',
				template: profesionalesListado,
				controller: 'ProfesionalesListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 228
				}
			});

			$stateProvider.state('profesionales.profesionales.edit', {
				url: '/Edit',
				template:profesionalesEdit,
				controller: 'ProfesionalEditController',
				controllerAs: 'vm',
				data: {
					idPermiso: 228
				},
				params: {
					profesionalEdit : null,
					esNuevo : null
				}
			});

				$stateProvider.state(
				{
					name : 'profesionales.profesionales.edit.general',
					url : '/General',
					template: tabGeneralProfesionalEditTemplate,
					controller: 'GeneralProfesionalEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.profesionales.edit.distribuciones',
					url : '/Distribuciones',
					template: tabDistribucionesProfesionalEditTemplate,
					controller: 'DistribucionesProfesionalEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.profesionales.edit.domicilio',
					url : '/Domicilio',
					template: tabDomicilioProfesionalEditTemplate,
					controller: 'DomicilioProfesionalEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.profesionales.edit.nacionalidad',
					url : '/Nacionalidad',
					template: tabNacionalidadProfesionalEditTemplate,
					controller: 'NacionalidadProfesionalEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.profesionales.edit.telefono',
					url : '/Telefono',
					template: tabTelefonoProfesionalEditTemplate,
					controller: 'TelefonoProfesionalEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.profesionales.edit.seguros',
					url : '/Seguro',
					template: tabSegurosProfesionalEditTemplate,
					controller: 'SegurosProfesionalEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
					{
						name : 'profesionales.profesionales.edit.documentos',
						url : '/Documentos',
						template: tabDocumentoProfesionalEditTemplate,
						controller: 'DocumentoProfesionalEditController',
						controllerAs: 'vm',
						data : {
							idPermiso: 228,
						}
					});

				$stateProvider.state(
					{
						name : 'profesionales.profesionales.edit.facturar',
						url : '/Facturar',
						template: tabProfesionalDefectoEditTemplate,
						controller: 'ProfesionalDefectoEditController',
						controllerAs: 'vm',
						data : {
							idPermiso: 228,
						}
					});	
        }
	};

	return module;
})();