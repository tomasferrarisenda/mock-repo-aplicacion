/**
 * @author 			Pedro Ferrer
 * @description 	Convenios
 */

import listarConvenios = require('../views/convenioList.html');
import editarConvenio = require('../views/convenioEdit.html');
import tabEditarNormativa = require('../views/tabs/normativaEdit.html');
import tabListarClausula = require('../views/tabs/clausulaList.html');
import tabListarUnidadArancelaria = require('../views/tabs/unidadArancelariaList.html');
import tabListarListaPrecio = require('../views/tabs/listaPrecioList.html');
import tabEditarADAC = require('../views/tabs/ADACEdit.html');
import tabEditarDocumento = require('../views/tabs/documentoEdit.html');
import editarClausula = require('../views/listClausulaPrecio/clausulaEdit.html');
import editarListaPrecio = require('../views/listClausulaPrecio/listaPrecioEdit.html');
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Financiadores/Convenios', '/Financiadores/Convenios/List');
			$urlRouterProvider.when('/Financiadores/Convenios/Edit', '/Financiadores/Convenios/Edit/Normativa');

			$stateProvider.state({
				name: 'financiadores.convenios',
				url:'/Convenios',
				template: '<ui-view/>'
			});

			$stateProvider.state('financiadores.convenios.list', {
				url: '/List',
				template:listarConvenios,
				controller: 'ConvenioListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 154,
					title: 'Lista de Convenios',
					icon: 'LIST'
				}
			});

			$stateProvider.state('financiadores.convenios.edit', {
				url: '/Edit',
				template:editarConvenio,
				controller: 'ConvenioEditController',
				controllerAs: 'vm',
				//data: {
					//idPermiso: 155
				//},
				params: {
					convenioEdit : null,
					esNuevo : null,
					vigenciaDesde : null,
					vigenciaHasta : null,
					tabAIr : null
				}
			});

				$stateProvider.state(
				{
					name : 'financiadores.convenios.edit.normativa',
					url : '/Normativa',
					template: tabEditarNormativa,
					controller: 'NormativaEditController',
					controllerAs: 'vm',
					params : {
						esNuevo : true
					}//,
					// data : {
					// 	idPermiso: 155,
					// }
				});

				$stateProvider.state(
				{
					name : 'financiadores.convenios.edit.clausula',
					url : '/Clausula',
					template:tabListarClausula,
					controller: 'ClausulaListController',
					controllerAs: 'vm',
					params : {
						esNuevo : true
					}//,
					// data : {
					// 	idPermiso: 155,
					// }
				});

				$stateProvider.state(
				{
					name : 'financiadores.convenios.edit.unidadArancelaria',
					url : '/UnidadArancelaria',
					template: tabListarUnidadArancelaria,
					controller: 'UnidadArancelariaListController',
					controllerAs: 'vm',
					params : {
						esNuevo : true
					}//,
					// data : {
					// 	idPermiso: 155,
					// }
				});

				$stateProvider.state(
				{
					name : 'financiadores.convenios.edit.listaPrecio',
					url : '/ListaPrecio',
					template: tabListarListaPrecio,
					controller: 'ListaPrecioListController',
					controllerAs: 'vm',
					params : {
						esNuevo : true
					}//,
					// data : {
					// 	idPermiso: 155,
					// }
				});

				$stateProvider.state(
				{
					name : 'financiadores.convenios.edit.ADAC',
					url : '/ADAC',
					template: tabEditarADAC,
					controller: 'ADACEditController',
					controllerAs: 'vm',
					params : {
						esNuevo : true
					}//,
					// data : {
					// 	idPermiso: 155,
					// }
				});

				$stateProvider.state(
				{
					name : 'financiadores.convenios.edit.Documentos',
					url : '/Documentos',
					template: tabEditarDocumento,
					controller: 'DocumentoEditController',
					controllerAs: 'vm',
					params : {
						esNuevo : true
					}//,
					// data : {
					// 	idPermiso: 155,
					// }
				});

			$stateProvider.state(
			{
				name : 'financiadores.convenios.clausulaEdit',
				url : '/Clausula/Edit',
				template: editarClausula,
				controller: 'ClausulaEditController',
				controllerAs: 'vm',
				params : {
					convenioEdit : null,
					idClausulaEdit : null,
					vigenciaDesde : null,
					vigenciaHasta : null,
					estadoConvenio : null
				}//,
				// data : {
				// 	idPermiso: 155,
				// }
			});

			$stateProvider.state(
			{
				name : 'financiadores.convenios.listaPrecioEdit',
				url : '/ListaPrecio/Edit',
				template: editarListaPrecio,
				controller: 'ListaPrecioEditController',
				controllerAs: 'vm',
				params : {
					convenioEdit : null,
					idListaEdit : null,
					vigenciaDesde : null,
					vigenciaHasta : null,
					estadoConvenio : null
				}//,
				// data : {
				// 	idPermiso: 155,
				// }
			});
		}
	};

	return module;
})();