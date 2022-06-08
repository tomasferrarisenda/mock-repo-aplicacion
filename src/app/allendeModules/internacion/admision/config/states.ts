/**
 * @author 			emansilla
 * @description 	description
 */
import admisionListTemplate = require('../views/admision-list.html');
import admisionNewTemplate = require('../views/admision-new.html');
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Internacion/Admision', '/Internacion/Admision/List');

			$stateProvider.state({
				name : 'admision',
				url : '/Admision',
				parent : 'internacion',
				template : '<ui-view id="internacion"><sa-loading></sa-loading></ui-view>',
				data : {
					module : 'ADMISIÓN',
					path : 'Internacion/Admision'
				}
			});
			
			$stateProvider.state({
				name : 'admision.list',
				url : '/List',
				template : admisionListTemplate,
				controller: 'AdmisionListController',
				controllerAs: 'vm',
				params : {
					page : "0",
					numeroDocumento : null,
					idSolicitud : null,
					nombrePaciente : null,
					idSucursal : null
				},
				data : {
					title : 'Lista de solicitudes aprobadas',
					icon : 'LIST',
					idPermiso : 11
				},
				resolve : {
					Solicitudes : SolicitudesAprobadas
				}
			});

			SolicitudesAprobadas.$inject = ['AdmisionDataService', '$stateParams'];
			function SolicitudesAprobadas(AdmisionDataService, $stateParams) {
				return AdmisionDataService.getAllInternaciones(
						$stateParams.page,
						$stateParams.idSolicitud,
						$stateParams.numeroDocumento,
						$stateParams.nombrePaciente,
						$stateParams.idSucursal);
			}

			SolicitudAprobadas.$inject = ['PreadmisionDataService', '$stateParams', '$q'];
			function SolicitudAprobadas(PreadmisionDataService, $stateParams, $q) {
				if (!$stateParams.idSolicitud) return $q.reject();
				
				return PreadmisionDataService.getOneSolicitudPreadmision($stateParams.idSolicitud);
			}

			TiposPorcentajes.$inject = ['SupportDataService'];
			function TiposPorcentajes(SupportDataService: ISupportDataService) {
				return SupportDataService.getAllTiposPorcentaje();
			}

			TiposPacienteFacturacion.$inject = ['InternacionCommonDataService'];
			function TiposPacienteFacturacion(InternacionCommonDataService) {
				return InternacionCommonDataService.getAllTipoPacienteFacturacion();
			}
			
			$stateProvider.state({
				name : 'admision.new',
				url : '/New',
				template : admisionNewTemplate,
				controller: 'AdmisionNewController',
				controllerAs: 'vm',
				params : {
					idSolicitud : ''
				},
				data : {
					title : 'Nueva Internación Nº ',
					icon : 'NEW',
					idPermiso : 10
				},
				resolve : {
					Solicitud : SolicitudAprobadas,
					TiposPacienteFacturacion : TiposPacienteFacturacion,
					TiposPorcentajes : TiposPorcentajes
				}
			});

		}
	};

	return module;

})();