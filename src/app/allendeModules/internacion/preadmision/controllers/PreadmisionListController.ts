/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PreadmisionListController', PreadmisionListController);

		PreadmisionListController.$inject = [
			'$filter', 'Logger', '$q', '$state', '$stateParams', 'DateUtils',
			'ProtesisDataService',
			'PreadmisionDataService', 'ModalService', 'PreadmisionLogicService', 'PreadmisionAuthService',
			// Datos de BE injectados
			'Solicitudes', 'EstadosSolicitud', 'PrioridadesSolicitud', 'DificultadesGestion', 'OrigenesSolicitud',
			'Paciente', 'User'
		];
		
		function PreadmisionListController (
			$filter, $log, $q, $state, $stateParams, DateUtils: IDateUtils,
			ProtesisDataService,
			PreadmisionDataService, ModalService: IModalService, PreadmisionLogicService, PreadmisionAuthService,
			// Datos de BE injectados
			Solicitudes, EstadosSolicitud, PrioridadesSolicitud, DificultadesGestion, OrigenesSolicitud,
			Paciente, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionListController');
			$log.debug('ON.-');
				
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.title = {
				module : $state.current.data.module,
				path : $state.current.data.path,
				page: $state.current.data.title,
				icon : $state.current.data.icon
			};
			
			vm.today = new Date();

			vm.constante = {
				clavePaciente: $stateParams.clavePaciente || '',
				matriculaMedico: User.employeeId || $stateParams.matriculaMedico
			};

			vm.data = {};

			vm.formControl = {
				externo: $state.current.data.externo,
				reloadPage: reloadPage
			};

			vm.filter = {
				fechaDesde: new Date(),
				fechaHasta: new Date(),
				clean : cleanFilters,
				validar : validarFilters
			};
			
			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged : getPage,
				getPage: getPage
			};

			vm.validar = {
				puedeCrear : validarPuedeCrear,
				puedeEditar : validarPuedeEditar,
				puedeAnular : validarPuedeAnular,
				puedeImprimir : validarPuedeImprimir
			};

			vm.print = {
				selectPrint: selectPrint
			};

			vm.solicitud = {
 				new : nuevaSolicitudPreadmision,
 				open : openSolicitudPreadmision,
 				remove : removeSolicitudPreadmision,
 				view: viewSolicitudPreadmision,
 				getProtesis : getProtesisPreadmision
			};

			/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */

			/* FORMULARIO */

			function reloadPage () {
				if (vm.formControl.verFechas) {
					var fechaDesde = $filter('date')(vm.filter.fechaDesde, 'MM-dd-yyyy');
					var fechaHasta = $filter('date')(vm.filter.fechaHasta, 'MM-dd-yyyy');
					$state.go($state.current.name, {
						fechaDesde: fechaDesde || '0',
						fechaHasta: fechaHasta || '0'
					});
				} else {
					$state.reload();
				}
			}

			/* PAGINACIÓN */

			function cleanFilters () {
				vm.filter.numeroSolicitud = '';
				vm.filter.tipoDocumento = '';
				vm.filter.numeroDocumento = '';
				vm.filter.estadoSolicitud = '';
				vm.filter.prioridadSolicitud = '';
				vm.filter.sucursal = '';
				vm.filter.tieneProtesis = '';
				vm.filter.origenSolicitud = '';
				vm.filter.nombrePaciente = '';
				vm.filter.fechaProbableInternacion = '';
				vm.paginacion.currentPage = 1;
				getPage();
				cargarDatosPaciente(Paciente);
			}

			function validarFilters () {
				if (vm.filter.numeroSolicitud  == null) 
					vm.filter.numeroSolicitud = '';
				if (vm.filter.numeroDocumento == null)
					vm.filter.numeroDocumento = '';
				if (vm.filter.estadoSolicitud == null) 
					vm.filter.estadoSolicitud = '';
				if (vm.filter.prioridadSolicitud == null) 
					vm.filter.prioridadSolicitud = '';
				if (vm.filter.sucursal == null) 
					vm.filter.sucursal = '';
				if (vm.filter.tipoDocumento  == null) 
					vm.filter.tipoDocumento = '';
				if (vm.filter.tieneProtesis  == null) 
					vm.filter.tieneProtesis = '';
				if (vm.filter.origenSolicitud  == null) 
					vm.filter.origenSolicitud = '';
				if (vm.filter.nombrePaciente  == null) 
					vm.filter.nombrePaciente = '';
				if (vm.filter.fechaProbableInternacion  == null) 
					vm.filter.fechaProbableInternacion = '';
			}

			function getPage () {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.filter.solicitudes = $filter('filter')
					(vm.data.solicitudes,{
						id_internacion : vm.filter.numeroSolicitud,
						fecha_admision_probable : vm.filter.fechaProbableInternacion,
						nombre_completo_paciente : vm.filter.nombrePaciente,
						numero_documento : vm.filter.numeroDocumento,
						id_tipo_documento : vm.filter.tipoDocumento.id_tipo_documento,
						nombre_estado_preadmision: vm.filter.estadoSolicitud.nombre_estado_preadmision,
						nombre_origen_solicitud: vm.filter.origenSolicitud.nombre_origen_solicitud,
						nombre_prioridad_solicitud: vm.filter.prioridadSolicitud.nombre_prioridad_solicitud,
						tiene_protesis: vm.filter.tieneProtesis,
						id_sucursal : vm.filter.sucursal.id_sucursal
					});
				vm.paginacion.totalItems = vm.filter.solicitudes.length;
				vm.filter.solicitudes = vm.filter.solicitudes.slice(begin, end);
				//$log.debug('GetPage OK.-');
			}

			/* IMPRESION */

			function selectPrint (pIdSolicitud) {
				PreadmisionAuthService.selectPrint(User)
				.then(function (pPrintSelected) {
					PreadmisionDataService.idSolicitud = pIdSolicitud;
					PreadmisionDataService.matriculaMedico = vm.constante.matriculaMedico;
 					PreadmisionDataService.clavePaciente = vm.constante.clavePaciente;
 					PreadmisionDataService.externo = vm.formControl.externo;
 					$log.debug('pPrintSelected', pPrintSelected);

 					PreadmisionLogicService.print(User, pPrintSelected)
 					.then(function () {},
 						function (pError) {
 							if (pError.message)
 								ModalService.info(pError.message);
 						});
				});
			}

			/* SOLICITUD */

			function nuevaSolicitudPreadmision () {
				if (validarPuedeCrear()) {
						PreadmisionDataService.matriculaMedico = vm.constante.matriculaMedico;
						PreadmisionDataService.clavePaciente = vm.constante.clavePaciente;
						PreadmisionDataService.externo = vm.formControl.externo;
						PreadmisionAuthService.openNewSelector(User)
						.then(function (pState) {
							$log.debug('Estado ELEGIDO: ', pState);
							$log.debug('Estado Actual con data: ', $stateParams);
							$state.go(pState.State, { 
								externo : $state.current.data.externo,
								clavePaciente : $stateParams.clavePaciente,
								matricula : $stateParams.matricula });
				});}
			}

			function openSolicitudPreadmision (pSolicitud) {
				// PreadmisionDataService.idSolicitud = pSolicitud.id_internacion;

				if (validarPuedeEditar(pSolicitud)) {
					PreadmisionAuthService.openEditSelectorLazy(User, pSolicitud)
					.then(openSolicitudPreadmisionOk, openSolicitudPreadmisionError);
				}

				function openSolicitudPreadmisionOk (pAction) {
					$log.debug('ACCION ELEGIDA: ', pAction);
					$state.go(pAction.State, {
												idSolicitud:pSolicitud.id_internacion,
												externo : $state.current.data.externo
											});
				}

				function openSolicitudPreadmisionError (pError) {
					// PreadmisionDataService.idSolicitud = 0;
				}
			}

			function viewSolicitudPreadmision (pSolicitud) {
				PreadmisionDataService.idSolicitud = pSolicitud.id_internacion;
				PreadmisionLogicService.print(User, '');
			}

			function getProtesisPreadmision (pSolicitud) {
				pSolicitud.loading = true;
				ProtesisDataService.getAllByIntervencion(pSolicitud.id_intervencion_admision)
				.then(getProtesisPreadmisionOk, getProtesisPreadmisionError);

				function getProtesisPreadmisionOk (pProtesis) {
					pSolicitud.loading = false;
					pSolicitud.ProtesisPreadmision = pProtesis;
					pSolicitud.tiene_detalle = true;
				}

				function getProtesisPreadmisionError (pError) {
					pSolicitud.loading = false;
				}
			}

			function removeSolicitudPreadmision (pSolicitud) {
				PreadmisionDataService.idSolicitud = pSolicitud.id_internacion;
				PreadmisionDataService.matriculaMedico = vm.constante.matriculaMedico;
				PreadmisionDataService.clavePaciente = vm.constante.clavePaciente;
				PreadmisionDataService.externo = vm.formControl.externo;

				PreadmisionLogicService.remove(User)
					.then(function (pMessage) {
					ModalService.info(pMessage);
					vm.formControl.reloadPage();
				});
			}

			function cargarSolicitudes (pSolicitudes) {
				vm.data.solicitudes = pSolicitudes;
				cleanFilters();
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				getPage();
			}

			/* PACIENTE */

			function cargarDatosPaciente(pPaciente) {
				if (Paciente) {
					vm.filter.numeroDocumento = pPaciente.numero_documento;
					vm.filter.nombrePaciente = pPaciente.nombre_completo;
					vm.filter.tipoDocumento = pPaciente.TipoDocumento;
				}
			}

			/* VALIDACIONES */

			function validarPuedeCrear () {
				 return PreadmisionAuthService.puedeCrear(User);
			}

			function validarPuedeEditar (pSolicitud) {
				return PreadmisionAuthService.puedeEditarLazy(User, pSolicitud);
			}

			function validarPuedeAnular (pNombreEstadoPreadmision) {
				return PreadmisionAuthService.puedeAnular(User, pNombreEstadoPreadmision);
			}

			function validarPuedeImprimir (pNombreEstadoPreadmision) {
				return PreadmisionAuthService.puedeImprimir(User, pNombreEstadoPreadmision);
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');

				// if ($stateParams.fechaDesde && $stateParams.fechaDesde !== '0' && $stateParams.fechaHasta && $stateParams.fechaHasta !== '0') {
					vm.filter.fechaDesde = new Date($stateParams.fechaDesde);
					vm.filter.fechaHasta = new Date($stateParams.fechaHasta);
				// } else {
				// 	vm.filter.fechaDesde = DateUtils.removeDays(new Date(), 90);
				// 	vm.filter.fechaHasta = new Date();
				// }
 			
				vm.data.estadosSolicitud = EstadosSolicitud;
				vm.data.prioridadesSolicitud = PrioridadesSolicitud;
				vm.data.dificultadesGestion = DificultadesGestion;
				vm.data.origenesSolicitud = OrigenesSolicitud;
				vm.data.user = User;
				vm.data.sucursales = User.sucursales;

				cargarSolicitudes(Solicitudes);
				cargarDatosPaciente(Paciente);

				$log.debug('Inicializar OK.-');
 			}
		}
	};

	return module;

})();