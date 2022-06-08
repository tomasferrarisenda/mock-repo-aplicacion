/**
 * @author 			emansilla
 * @description 	description
 */
import internadoListTemplate = require('../views/internado-list.html');
import internadoListCensoTemplate = require('../templates/internado-list-censo.tpl.html');
import internadoLIstCamasTemplate = require('../templates/internado-list-camas.tpl.html');
import internadoListProrrogasTemplate = require('../templates/internado-list-prorrogas.tpl.html');
import internadoListUpaTemplate = require('../templates/internado-list-upa.tpl.html');
import internadoListPartosTemplate = require('../views/internado-list-partos.html');
import internadoEditTempalte = require('../views/internado-edit.html');
import internadoLevantarAltaTemplate = require('../views/internado-levantar-alta.html');
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			/* INTERNADO */
			$urlRouterProvider.when('/Internacion/Internado', '/Internacion/Internado/List/All/Censo');
			$urlRouterProvider.when('/Internacion/Internado/List', '/Internacion/Internado/List/All/Censo');
			$urlRouterProvider.when('/Internacion/Internado/List/All', '/Internacion/Internado/List/All/Censo');

			$stateProvider.state({
				name : 'internado',
				url : '/Internado',
				parent : 'internacion',
				template : '<ui-view/>',
				data : {
					module : 'INTERNADO',
					path : 'Internacion/Internado'
				}
			});
			
			$stateProvider.state({
				name : 'internado.list',
				url : '/List',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});

			$stateProvider.state({
				name : 'internado.list.all',
				url: '/All',
				template: internadoListTemplate,
				controller: 'InternadoListController',
				controllerAs: 'vm',
				data : {
					idPermiso : 67
				}
			});

				$stateProvider.state({
					name : 'internado.list.all.censo',
					url: '/Censo',
					template: internadoListCensoTemplate,
					data: {
						title : 'Lista de internados (Censo)'
					}
				});

				$stateProvider.state({
					name : 'internado.list.all.camas',
					url: '/Camas',
					template: internadoLIstCamasTemplate,
					data: {
						title : 'Lista de internados (Camas)'
					}
				});

				$stateProvider.state({
					name : 'internado.list.all.prorrogas',
					url: '/Prorrogas',
					template: internadoListProrrogasTemplate,
					data: {
						title : 'Lista de internados (Prorrogas)'
					}
				});

				$stateProvider.state({
					name : 'internado.list.all.upa',
					url: '/Upa',
					template: internadoListUpaTemplate,
					data: {
						title : 'Lista de internados (UPA)'
					}
				});

			$stateProvider.state({
				name : 'internado.list.partos',
				url: '/Partos',
				template: internadoListPartosTemplate,
				controller: 'InternadoListPartosController',
				controllerAs: 'vm',
				data: {
					title : 'Lista de internados para partos',
					idPermiso : 68
				}
			});

			$stateProvider.state({
				name : 'internado.editSelector',
				url: '/EditSelector',
				params : {
					idInternacion : 0
				},
				template: 'redireccionando ...',
				controller: 'InternadoEditInterceptorController'
			});


			InternadoById.$inject = ['AdmisionDataService', '$stateParams'];
			function InternadoById(AdmisionDataService, $stateParams) {
				if (!$stateParams.idInternacion) return; 
				return AdmisionDataService.getOneInternacion($stateParams.idInternacion);
			}

			TiposAfiliados.$inject = ['SupportDataService'];
			function TiposAfiliados(SupportDataService: ISupportDataService) {
				return SupportDataService.getAllTipoAfiliado();
			}

			EstadosAdmision.$inject = ['InternacionCommonDataService'];
			function EstadosAdmision(InternacionCommonDataService) {
				return InternacionCommonDataService.getAllEstadoAdmision();
			}

			TiposPacienteFacturacion.$inject = ['InternacionCommonDataService'];
			function TiposPacienteFacturacion(InternacionCommonDataService) {
				return InternacionCommonDataService.getAllTipoPacienteFacturacion();
			}

			TiposPorcentajes.$inject = ['SupportDataService'];
			function TiposPorcentajes(SupportDataService: ISupportDataService) {
				return SupportDataService.getAllTiposPorcentaje();
			}

			$stateProvider.state({
				name : 'internado.edit',
				url : '/Edit',
				template: internadoEditTempalte,
				controller: 'InternadoEditController',
				controllerAs: 'vm',
				params : {
					idInternacion : 0
				},
				data : {
					title : 'Editar Internación Nº '
				},
				resolve : {
					Internado : InternadoById,
					TiposAfiliados : TiposAfiliados,
					EstadosAdmision : EstadosAdmision,
					TiposPacienteFacturacion : TiposPacienteFacturacion,
					TiposPorcentajes : TiposPorcentajes
				}
			});

			$stateProvider.state({
				name : 'internado.edit.admitido',
				url: '/Admitido',
				data : {
					deAlta : false,
					idPermiso : 71
				}
			});

			$stateProvider.state({
				name : 'internado.edit.alta',
				url: '/Alta',
				data : {
					deAlta : true,
					idPermiso : 70
				}
			});

			$stateProvider.state({
				name : 'internado.view',
				url: '/View/All',
				template: internadoEditTempalte,
				controller: 'InternadoViewController',
				controllerAs: 'vm',
				params : {
					idInternacion : 0
				},
				data : {
					title: 'Ver Internación Nº ',
					icon : ''
				},
				resolve : {
					Internado : InternadoById,
					TiposAfiliados : TiposAfiliados,
					EstadosAdmision : EstadosAdmision,
					TiposPacienteFacturacion : TiposPacienteFacturacion,
					TiposPorcentajes : TiposPorcentajes
				}
			});

			$stateProvider.state({
				name : 'internado.levantarAlta',
				url: '/LevantarAlta',
				template: internadoLevantarAltaTemplate,
				controller: 'InternadoLevantarAltaController',
				controllerAs: 'vm',
				data : {
					title: 'Levantar Alta',
					icon : '',
					idPermiso : 138
				}
			});
		}
	};

	return module;

})();