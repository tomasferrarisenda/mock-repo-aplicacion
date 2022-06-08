/**
 * @author 			emansilla
 * @description 	description
 */
import listTemplate = require('../views/preadmision-list.html');
import newTemplate = require('../views/preadmision-new.html');
import editTemplate = require('../views/preadmision-edit.html');
import { IPacienteDataService } from '../../../persona/paciente/services';
import { IProfesionalesDataService } from '../../../profesionales';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider) {
			
			$urlRouterProvider.when('/Internacion/Preadmision', '/Internacion/Preadmision/List/All/0/0');
			$urlRouterProvider.when('/Internacion/Preadmision/List', '/Internacion/Preadmision/List/All/0/0');

			$stateProvider.state({
				name : 'preadmision',
				url : '/Internacion/Preadmision',
				parent : 'signed',
				template : '<ui-view><sa-loading></sa-loading></ui-view>',
				data : {
					module : 'PREADMISIÓN',
					path : 'Internacion/Preadmision'
				}
			});

			/* LISTADOS */

			$stateProvider.state({
				name : 'preadmision.list',
				url : '/List',
				template : '<ui-view/>',
				data : {
					title : 'Lista de solicitudes',
					icon : 'LIST',
					idPermiso : 2
				}
			});

			SolicitudesPreadmision.$inject = ['PreadmisionDataService', '$stateParams', 'DateUtils', '$filter'];
			function SolicitudesPreadmision(PreadmisionDataService, $stateParams, DateUtils: IDateUtils, $filter) {
				let obj: any = {};

				if ($stateParams.fechaDesde && $stateParams.fechaDesde !== '0' && $stateParams.fechaHasta && $stateParams.fechaHasta !== '0') {
					obj = {
						fechaDesde: $stateParams.fechaDesde,
						fechaHasta: $stateParams.fechaHasta
					};
				} else {
					obj.fechaDesde = $filter('date')(DateUtils.removeDays(new Date(), 45), 'MM-dd-yyyy');
					obj.fechaHasta = $filter('date')(DateUtils.addDays(new Date(),1), 'MM-dd-yyyy');
					
					$stateParams.fechaDesde = obj.fechaDesde;
					$stateParams.fechaHasta = obj.fechaHasta;
				}
				return PreadmisionDataService.getAllPreadmisionByFechaCreacionLazy(obj);
				// return PreadmisionDataService.getAllPreadmisionLazy();
			}

			SolicitudPreadmision.$inject = ['PreadmisionDataService', '$stateParams'];
			function SolicitudPreadmision (PreadmisionDataService, $stateParams) {
				if (!$stateParams.idSolicitud) return;

				return PreadmisionDataService.getOneSolicitudPreadmision($stateParams.idSolicitud);
			}

			SolicitudPreadmisionNew.$inject = ['PreadmisionDataService'];
			function SolicitudPreadmisionNew (PreadmisionDataService) {
				return PreadmisionDataService.new();
			}

			SolicitudesPreadmisionByMedicoAndPaciente.$inject = ['PreadmisionDataService', '$stateParams'];
			function SolicitudesPreadmisionByMedicoAndPaciente (PreadmisionDataService, $stateParams) {
				if (!$stateParams.matricula || !$stateParams.clavePaciente) return;

				return PreadmisionDataService.getAllPreadmisionByMedicoAndPacienteLazy(
															$stateParams.matricula,
															$stateParams.clavePaciente);
			}

			EstadosSolicitud.$inject = ['PreadmisionDataService'];
			function EstadosSolicitud(PreadmisionDataService) {
				return PreadmisionDataService.getAllEstadosSolicitud();
			}

			PrioridadesSolicitud.$inject = ['InternacionCommonDataService'];
			function PrioridadesSolicitud (InternacionCommonDataService) {
				return InternacionCommonDataService.getAllPrioridadesSolicitud();
			}

			DificultadesGestion.$inject = ['InternacionCommonDataService'];
			function DificultadesGestion(InternacionCommonDataService) {
				return InternacionCommonDataService.getAllDificultadesGestion();
			}

			OrigenesSolicitud.$inject = ['PreadmisionDataService'];
			function OrigenesSolicitud (PreadmisionDataService) {
				return PreadmisionDataService.getAllOrigenesSolicitud();
			}

			Paciente.$inject = ['PacienteDataService', '$stateParams'];
			function Paciente (PacienteDataService: IPacienteDataService, $stateParams) {
				if (!$stateParams.clavePaciente) return '';
				
				return PacienteDataService.getOnePacienteByClave($stateParams.clavePaciente);
			}

			TiposInternacion.$inject = ['InternacionCommonDataService'];
			function TiposInternacion(InternacionCommonDataService) {
				return InternacionCommonDataService.getAllTiposInternacion();
			}

			Medico.$inject = ['ProfesionalesDataService', '$stateParams'];
			function Medico(ProfesionalesDataService: IProfesionalesDataService, $stateParams) {
				if (!$stateParams.matricula) return '';
				return ProfesionalesDataService.getOneProfesionalByMatricula($stateParams.matricula);
			}

			EstadosPaciente.$inject = ['InternacionCommonDataService'];
			function EstadosPaciente(InternacionCommonDataService) {
				return InternacionCommonDataService.getAllEstadosPaciente();
			}

			EstadosAdmision.$inject = ['InternacionCommonDataService'];
			function EstadosAdmision (InternacionCommonDataService) {
				return InternacionCommonDataService.getAllEstadoAdmision();
			}

			$stateProvider.state({
				name : 'preadmision.list.all',
				url : '/All/{fechaDesde}/{fechaHasta}',
				template: listTemplate,
				params: {
					fechaDesde: '0',
					fechaHasta: '0'
				},
				controller: 'PreadmisionListController',
				controllerAs: 'vm',
				data : {
					externo : false,
					idPermiso : 44
				},
				resolve : {
					Solicitudes : SolicitudesPreadmision,
					EstadosSolicitud : EstadosSolicitud,
					PrioridadesSolicitud : PrioridadesSolicitud,
					DificultadesGestion : DificultadesGestion,
					OrigenesSolicitud : OrigenesSolicitud,
					Paciente : Paciente
				}
			});

			$stateProvider.state({
				name : 'preadmision.list.externo',
				url : '/Externo/{matricula}/{clavePaciente}',
				template: listTemplate,
				controller: 'PreadmisionListController',
				controllerAs: 'vm',
				data : {
					externo : true,
					menuIf : false,
					headerIf : false,
					idPermiso : 44
				},
				resolve : {
					Solicitudes : SolicitudesPreadmisionByMedicoAndPaciente,
					EstadosSolicitud : EstadosSolicitud,
					PrioridadesSolicitud : PrioridadesSolicitud,
					DificultadesGestion : DificultadesGestion,
					OrigenesSolicitud : OrigenesSolicitud,
					Paciente : Paciente
				}
			});
			
			$stateProvider.state({
				name : 'preadmisionListParams',
				url : '/Internacion/Preadmision/List/Params/{userName}/{accessToken}/{matricula}/{clavePaciente}',
				template: 'redireccionando...',
				controller: 'PreadmisionInterceptorController',
				data : {
					userRequired : false
				}
			});

			/* NUEVOS */
			
			$stateProvider.state({
				name : 'preadmision.new',
				url : '/New',
				template: newTemplate,
				controller: 'PreadmisionNewController',
				controllerAs: 'vm',
				data : {
					urgent : false,
					idPermiso : 1
				},
				params : {
					clavePaciente : '',
					matricula : '',
					externo : false
				},
				resolve : {
					PrioridadesSolicitud : PrioridadesSolicitud,
					EstadosPaciente : EstadosPaciente,
					TiposInternacion : TiposInternacion,
					SolicitudPreadmisionNew : SolicitudPreadmisionNew,
					Medico : Medico,
					Paciente : Paciente
				}
			});
			
				$stateProvider.state({
					name : 'preadmision.new.normal',
					url : '/Normal',
					data : {
						title : 'Nueva Solicitud - Programada',
						idPermiso : 40
					}
				});

				$stateProvider.state({
					name : 'preadmision.new.urgent',
					url : '/Urgent',
					data : {
						urgent : true
					}
				});

					$stateProvider.state({
						name : 'preadmision.new.urgent.guardia',
						url : '/Guardia',
						data : {
							title : 'Nueva Solicitud Urgente - Guardia',
							idPermiso : 41
						}
					});

					$stateProvider.state({
						name : 'preadmision.new.urgent.consultorioexterno',
						url : '/ConsultorioExterno',
						data : {
							title : 'Nueva Solicitud Urgente - Consultorio Externo',
							idPermiso : 43
						}
					});

					$stateProvider.state({
						name : 'preadmision.new.urgent.art',
						url : '/Art',
						data : {
							title : 'Nueva Solicitud Urgente - ART',
							idPermiso : 42
						}
					});

			/* EDICIÓN */

			$stateProvider.state({
				name : 'preadmision.edit',
				template: editTemplate,
				url : '/Edit',
				controller: 'PreadmisionEditController',
				controllerAs: 'vm',
				params : {
					idSolicitud : 0,
					externo : false
				},
				data : {
					title : 'Editar solicitud N°',
					icon : 'EDIT',
					esEditCreado : false,
					esEditEnProcesoIntervencion : false,
					esEditEnProcesoProtesis : false,
					esEditEnProcesoHuesos : false,
					esEditPendiente : false,
					esEditAprobado : false,
					idPermiso : 32
				},
				resolve : {
					PrioridadesSolicitud : PrioridadesSolicitud,
					EstadosPaciente : EstadosPaciente,
					EstadosAdmision : EstadosAdmision,
					DificultadesGestion : DificultadesGestion,
					TiposInternacion : TiposInternacion,
					SolicitudPreadmision : SolicitudPreadmision
				}
			});
			
			$stateProvider.state({
				name : 'preadmision.edit.creado',
				url : '/DoCreate',
				data : {
					esEditCreado : true,
					idPermiso : 3
				}
			});

				$stateProvider.state({
					name : 'preadmision.edit.creado.do',
					url : '/DoCreate/Do',
					data : {
						idPermiso : 47
					}
				});

			$stateProvider.state({
				name : 'preadmision.edit.proceso',
				url : '/DoInProcess',
				data : {
					idPermiso : 5
				}
			});

				$stateProvider.state({
					name : 'preadmision.edit.proceso.intervencion',
					url : '/Intervencion',
					data : {
						esEditEnProcesoIntervencion : true,
						idPermiso : 48
					}
				});

				$stateProvider.state({
					name : 'preadmision.edit.proceso.protesis',
					url : '/Protesis',
					data : {
						esEditEnProcesoProtesis : true,
						idPermiso : 49
					}
				});

				$stateProvider.state({
					name : 'preadmision.edit.proceso.huesos',
					url : '/Huesos',
					data : {
						esEditEnProcesoHuesos : false,
						idPermiso : 50
					}
				});

			$stateProvider.state({
				name : 'preadmision.edit.pendiente',
				url : '/DoPending',
				data : {
					esEditPendiente : true,
					idPermiso : 6
				}
			});

				$stateProvider.state({
					name : 'preadmision.edit.pendiente.esterilizacion',
					url : '/Esterilizacion',
					data : {
						idPermiso : 55
					}
				});

				$stateProvider.state({
					name : 'preadmision.edit.pendiente.farmacia',
					url : '/Farmacia',
					data : {
						idPermiso : 56
					}
				});

			$stateProvider.state({
				name : 'preadmision.edit.aprobado',
				url : '/DoApproved',
				data : {
					esEditAprobado : true,
					idPermiso : 58
				}
			});

		}
	};

	return module;

})();