/**
 * @author 			emansilla
 * @description 	description
 */
import mutualListTemplate = require('../gestion/views/mutual-list.html');
import mutualEditTemplate = require('../gestion/views/mutual-edit.html');
import tabGeneralMutualEditTemplate = require ('../gestion/views/tabs/general.html');
import tabPlanMutualEditTemplate = require ('../gestion/views/tabs/plan.html');
import tabDomicilioMutualEditTemplate = require ('../gestion/views/tabs/domicilio.html');
import tabTelefonoMutualEditTemplate = require ('../gestion/views/tabs/telefono.html');
import tabDocumentoMutualEditTemplate = require ('../gestion/views/tabs/documentoMutualEdit.html');
import tabReglasNroAfiliadoMutualEditTemplate = require ('../gestion/views/tabs/reglasNroAfiliado.html');
import tabListaFacturacionEditTemplate = require ('../gestion/views/tabs/listaFacturacionMutualEdit.html');
import editarListaFacturacion = require ('../gestion/views/listadoFacturacion/listaEditFacturacionMutual.html');

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

 	module.init = function (module) {

 		module.config(states);

 		states.$inject = ['$stateProvider', '$urlRouterProvider'];

 		function states ($stateProvider, $urlRouterProvider)
 		{
 			$urlRouterProvider.when('/Financiadores/Mutual', '/Financiadores/Mutual/List');

 			$stateProvider.state({
 				name : 'financiadores.mutual',
 				url : '/Mutual',
 				template : '<ui-view><sa-loading></sa-loading></ui-view>',
			});

 			$stateProvider.state({
 				name : 'financiadores.mutual.list',
				 url : '/List',
				 template: mutualListTemplate,
 				controller: 'MutualGestionListController',
 				controllerAs: 'vm'
			});

			$stateProvider.state('financiadores.mutual.edit', {
				url : '/Edit',
				template: mutualEditTemplate,
				controller: 'MutualEditController',
				controllerAs: 'vm',
				params: {
					mutualEdit : null,
					vieneDeListado : false,
					tabAIr : null
				}
			});

				$stateProvider.state(
				{
					name : 'financiadores.mutual.edit.general',
					url : '/General',
					template: tabGeneralMutualEditTemplate,
					controller: 'GeneralMutualEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 206,
					}
				});

				$stateProvider.state(
				{
					name : 'financiadores.mutual.edit.plan',
					url : '/Plan',
					template: tabPlanMutualEditTemplate,
					controller: 'PlanMutualEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 206,
					}
				});

				$stateProvider.state(
				{
					name : 'financiadores.mutual.edit.domicilio',
					url : '/Domicilio',
					template: tabDomicilioMutualEditTemplate,
					controller: 'DomicilioMutualEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 206,
					}
				});

				$stateProvider.state(
				{
					name : 'financiadores.mutual.edit.telefono',
					url : '/Telefono',
					template: tabTelefonoMutualEditTemplate,
					controller: 'TelefonoMutualEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 206,
					}
				});

				$stateProvider.state(
				{
					name : 'financiadores.mutual.edit.documento',
					url : '/Documento',
					template: tabDocumentoMutualEditTemplate,
					controller: 'DocumentoMutualEditController',
					controllerAs: 'vm',
					data : {
						idPermiso: 206,
					}
				});

				$stateProvider.state(
					{
						name : 'financiadores.mutual.edit.reglas',
						url : '/Reglas',
						template: tabReglasNroAfiliadoMutualEditTemplate,
						controller: 'ReglasNroAfiliadoMutualEditController',
						controllerAs: 'vm',
						data : {
							idPermiso: 206,
						}
					});

				$stateProvider.state(
				{
					name : 'financiadores.mutual.edit.listaFacturacion',
					url : '/ListaFacturacion',
					template: tabListaFacturacionEditTemplate,
					controller: 'ListaFacturacionEditController',
					controllerAs: 'vm',
					params : {
						mutualEdit : null
					},
					data : {
						idPermiso: 206,
					}
				});

			$stateProvider.state(
			{
				name : 'financiadores.mutual.listaFacturacion',
				url : '/ListaFacturacion/Edit',
				template: editarListaFacturacion,
				controller: 'ListaEditFacturacionMutualController',
				controllerAs: 'vm',
				params : {
					mutualEdit : null,
					idListaEdit : null
				},
				data : {
					idPermiso: 206,
				}
			});
 		}
 	};
 	return module;
})();