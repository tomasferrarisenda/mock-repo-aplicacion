/**
 * @author 			XX
 * @description 	ContratosInternos
 */
import contratosInternosListado = require('../views/listadoContratosInternos.html');
import editContratosInternos = require('../views/editContratosInternos.html');
import ajusteTab = require('../views/tabs/ajuste.html');
import cuentasTab = require('../views/tabs/cuentas.html');
import generalTab = require('../views/tabs/general.html');
import pagosTab = require('../views/tabs/pagos.html');
import retencionTab = require('../views/tabs/retencion.html');
import participacionTab = require('../views/tabs/participacion.html');
import documentoTab = require('../views/tabs/documentoContratoEdit.html');
import facturaDirectoTab = require('../views/tabs/facturaDirecto.html');

export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Profesionales/ContratosInternos', '/Profesionales/ContratosInternos/List');

			$stateProvider.state({
				name: 'profesionales.contratosInternos',
				url:'/ContratosInternos',
				template: '<ui-view/>'
			});

			$stateProvider.state('profesionales.contratosInternos.list', {
				url: '/List',
				template: contratosInternosListado,
				controller: 'ContratosInternosListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 229
				}
			});

			$stateProvider.state('profesionales.contratosInternos.edit', {
				url: '/Edit',
				template: editContratosInternos,
				controller: 'EditContratosInternosController',
				controllerAs: 'vm',
				data: {
					idPermiso: 229
				},
				params: {
					contratoEdit : null,
					matricula : null,
					idTipoContratable : null,
					esNuevo : null,
					desde : null,
					hasta : null
				}
			});

				$stateProvider.state(
				{
					name : 'profesionales.contratosInternos.edit.general',
					url : '/General',
					template: generalTab,
					controller: 'GeneralController',
					controllerAs: 'vm',
					data : {
						idPermiso: 229,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.contratosInternos.edit.ajuste',
					url : '/ConceptosAjute',
					template:ajusteTab,
					controller: 'AjusteController',
					controllerAs: 'vm',
					data : {
						idPermiso: 229,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.contratosInternos.edit.pagos',
					url : '/Pagos',
					template: pagosTab,
					controller: 'PagosController',
					controllerAs: 'vm',
					data : {
						idPermiso: 229,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.contratosInternos.edit.retencion',
					url : '/Retenciones',
					template: retencionTab,
					controller: 'RetencionController',
					controllerAs: 'vm',
					data : {
						idPermiso: 229,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.contratosInternos.edit.cuentas',
					url : '/CuentasPorDefecto',
					template: cuentasTab,
					controller: 'CuentasController',
					controllerAs: 'vm',
					data : {
						idPermiso: 229,
					}
				});

				$stateProvider.state(
				{
					name : 'profesionales.contratosInternos.edit.participacion',
					url : '/Participacion',
					template: participacionTab,
					controller: 'ParticipacionController',
					controllerAs: 'vm',
					data : {
						idPermiso: 229,
					}
				});

				$stateProvider.state( 
					{
						name : 'profesionales.contratosInternos.edit.facturaDirecto',
						url : '/FacturacionDirecta',
						template: facturaDirectoTab,
						controller: 'FacturaDirectoController',
						controllerAs: 'vm',
						data : {
							idPermiso: 229,
						}
					});
				$stateProvider.state( 
					{
						name : 'profesionales.contratosInternos.edit.documentos',
						url : '/Documentos',
						template: documentoTab,
						controller: 'DocumentoContratoEditController',
						controllerAs: 'vm',
						data : {
							idPermiso: 229,
						}
					});
        }
	};

	return module;
})();