/**
 * @author 			ppautasso
 * @description 	description
 */

import organizacionListTemplate = require('../views/organizacion-gestion-list.html');
import organizacionEdit = require('../views/organizacion-edit.html');
import tabGeneralOrganizacionEditTemplate = require('../views/tabs/general.html')
import tabDomicilioOrganizacionEditTemplate = require('../views/tabs/domicilio.html')
import tabTelefonoOrganizacionEditTemplate = require('../views/tabs/telefono.html')

export default(function() {
    'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Financiadores/Organizacion', '/Financiadores/Organizacion/List');

			$stateProvider.state({
				name : 'financiadores.organizacion',
				url : '/Organizacion',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});

			$stateProvider.state({
				name : 'financiadores.organizacion.list',
				url : '/List',
				template: organizacionListTemplate,
				controller: 'OrganizacionGestionListController',
				controllerAs: 'vm'
			});

			$stateProvider.state('financiadores.organizacion.edit', {
				url : '/Edit',
				template: organizacionEdit,
				controller: 'OrganizacionEditController',
				controllerAs: 'vm',
				params: {
					Organizacion : null
				}
			});

				$stateProvider.state(
				{
					name : 'financiadores.organizacion.edit.general',
					url : '/General',
					template: tabGeneralOrganizacionEditTemplate,
					controller: 'GeneralOrganizacionEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 207,
					}
				});

				$stateProvider.state(
				{
					name : 'financiadores.organizacion.edit.domicilio',
					url : '/Domicilio',
					template: tabDomicilioOrganizacionEditTemplate,
					controller: 'DomicilioOrganizacionEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 207,
					}
				});

				$stateProvider.state(
				{
					name : 'financiadores.organizacion.edit.telefono',
					url : '/Telefono',
					template: tabTelefonoOrganizacionEditTemplate,
					controller: 'TelefonoOrganizacionEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 207,
					}
				});

		}
	};

	return module;
})();