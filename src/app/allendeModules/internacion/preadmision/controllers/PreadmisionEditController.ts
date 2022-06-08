import { IPacienteDataService } from '../../../persona/paciente/services';
import { IPreadmisionStorageService } from '../services';

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PreadmisionEditController', PreadmisionEditController);

		PreadmisionEditController.$inject = [
			'$scope', 'Logger', '$state', '$stateParams', '$timeout',
			'PreadmisionStorageService',
			'PreadmisionDataService', 'PacienteDataService', 'PreadmisionAuthService',
			'ModalService', 'PreadmisionLogicService', 'PacienteLogicService', 'TelefonoLogicService',
			// Injectados por BE
			'PrioridadesSolicitud', 'EstadosPaciente', 'EstadosAdmision', 'DificultadesGestion', 'TiposInternacion', 
			'SolicitudPreadmision',
			'User',
			'ENV'
		];
		
		function PreadmisionEditController (
			$scope, $log, $state, $stateParams, $timeout,
			PreadmisionStorageService: IPreadmisionStorageService,
			PreadmisionDataService, PacienteDataService: IPacienteDataService, PreadmisionAuthService,
			ModalService, PreadmisionLogicService, PacienteLogicService, TelefonoLogicService,
			// Injectados por BE
			PrioridadesSolicitud, EstadosPaciente, EstadosAdmision, DificultadesGestion, TiposInternacion, 
			SolicitudPreadmision,
			User, ENV) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionEditController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.user = User;
			vm.today = new Date();
			vm.tabs = [];
			vm.alertaPaciente = [];
			vm.tabCtrl = {
				active : 1
			};
			vm.title = {
				module : $state.current.data.module,
				page : $state.current.data.title + $stateParams.idSolicitud,
				small : ''
			};

			vm.constante = {
				disabled : true
			};

			// data contiene los datos que se traen desde la base de datos.
			$scope.data = {};

			// formData: contiene los datos que provienen del formulario.
			vm.formData = {
				requiereProtesis : false,
				requiereMedicoCirujano : false,
				esQuirurgico : false,
				detallesIntervencion : [],
				
				// Para IntervencionAdmision
				estadoAdmision : null,
				dificultadGestionAdmision : null,
				diagnosticoAdmision : '',
				observacionesAdmision : '',
				cantidadDias : '',

				fechaCirugiaReal : '',
				fechaAutorizacion : '',
				numeroOrden : '',
				cantidadDiasAutorizados : ''
			};

			// formControl son métodos que manejan el formulario y la página.
			vm.formControl = {
				error : true,
				loading : true,
				externo : PreadmisionDataService.externo || false,
				volver : volver,
				reloadPage: reloadPage,
				save: updateSolicitudPreadmision,
				habilitarCirugia : habilitarCirugia,
				protesisChanged : false,
				
				esEditCreado : false,
				esEditEnProcesoIntervencion : false,
				esEditEnProcesoProtesis : false,
				esEditEnProcesoHuesos : false,
				esEditPendiente : false,
				esEditAprobado : false,

				esAdmisionAutorizada : esAdmisionAutorizada,

				// Tabs
				nextTab : nextTab,
				previousTab : previousTab
			};

			vm.validar = {
				requiereProtesis : validarRequiereProtesis,
				form : validarForm
			};

			vm.paciente = {
				openSelector : openSelectorPaciente,
				// openNewTelefono : openNewTelefono,
				edit: editPaciente
			};

			// EDITAR SOLICITUD

			vm.solicitud = {
				printOrden : printOrdenInternacion,
				printRP : printRP,
				printPresupuesto : printPresupuesto,
				printPedidoMateriales : printPedidoMateriales,
				printPrequirurgicos : printPrequirurgicos
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function reloadPage () {
				$state.reload();
			}

			function volver () {

				if ($stateParams.externo) {
					$state.go('preadmision.list.externo',{
						clavePaciente : SolicitudPreadmision.id_paciente,
						matricula : SolicitudPreadmision.matricula_medico_solicitante
					});
				} else {
					$state.go('preadmision.list');
				}
			}

			function selectEdit () {
				vm.formControl.esEditCreado = $state.current.data.esEditCreado;
				vm.formControl.esEditEnProcesoIntervencion  = $state.current.data.esEditEnProcesoIntervencion;
				vm.formControl.esEditEnProcesoProtesis = $state.current.data.esEditEnProcesoProtesis;
				vm.formControl.esEditEnProcesoHuesos = $state.current.data.esEditEnProcesoHuesos;
				vm.formControl.esEditPendiente = $state.current.data.esEditPendiente;
				vm.formControl.esEditAprobado = $state.current.data.esEditAprobado;
			}


			function validarForm () {
				var _flag=false;

				if (vm.formControl.esEditCreado)
					_flag = validarActionEditCreado();
				else if (vm.formControl.esEditEnProcesoIntervencion)
					_flag = validarActionEditEnProcesoIntervencion();
				else if (vm.formControl.esEditAprobado)
					_flag = validarActionEditAprobado();

				return _flag;
			}

			function llenarTabs () {
				vm.tabs = PreadmisionAuthService.getTabs($state.current.data.idPermiso, User);
			}

			function nextTab (pId) {
				vm.tabCtrl.active = PreadmisionLogicService.nextTab(pId, vm.tabs);
			}

			function previousTab (pId) {
				vm.tabCtrl.active = PreadmisionLogicService.previousTab(pId, vm.tabs);
			}

			function llenarForm () {
				vm.title.small = 'ESTADO: ' + $scope.data.solicitud.EstadoPreadmision.nombre_estado_preadmision;

				PreadmisionLogicService.openSolicitudPreadmisionForEdit($scope.data.solicitud, vm.formData);

				if ($scope.data.solicitud.ProtesisPreadmision.length > 0)
				{
					vm.formData.requiereProtesis = true;
					if (vm.formControl.esEditCreado)
						validarRequiereProtesis();
				}

				if ($scope.formSolicitud)
					$scope.formSolicitud.$pristine = true;

				if (PreadmisionStorageService.haveFormData()) {
					let formData = PreadmisionStorageService.getFormData();
					vm.formData = formData.formData;

					$timeout( () => {

						if ($scope.formSolicitud)
							$scope.formSolicitud.$pristine = formData.formState;
					});
				}
			}

			/* INTERNACION */

			function crearSolicitudPreadmision () {

				if (vm.formControl.esEditCreado) {
					return PreadmisionLogicService
						.crearSolicitudPreadmisionForNew($scope.data.solicitud, null, User);
				} else {
					return PreadmisionLogicService
						.crearSolicitudPreadmisionForEdit($scope.data.solicitud, vm.formData, User);
				}
			}

			function updateSolicitudPreadmision () {

				var _internacion = crearSolicitudPreadmision();

				if (vm.formControl.esEditCreado)
					updateSolicitudPreadmisionCreado();
				else if (vm.formControl.esEditEnProcesoIntervencion)
					updateSolicitudPreadmisionEnProceso();
				else if (vm.formControl.esEditEnProcesoProtesis)
					updateSolicitudPreadmisionEnProceso();
				else if (vm.formControl.esEditEnProcesoHuesos)
					updateSolicitudPreadmisionEnProceso();
				else if (vm.formControl.esEditPendiente)
					updateSolicitudPreadmisionVerificado();
				else if (vm.formControl.esEditAprobado)
					updateSolicitudPreadmisionAprobado();

				function updateSolicitudPreadmisionCreado () {
					PreadmisionDataService.updateOneSolicitudPreadmision(_internacion)
					.then(updateSolicitudPreadmisionOk);
				}

				function updateSolicitudPreadmisionEnProceso () {
					PreadmisionDataService.updateOneIntervencionPreAdmisionEnProceso(_internacion)
					.then(updateSolicitudPreadmisionOk);
				}

				function updateSolicitudPreadmisionVerificado () {
					PreadmisionDataService.updateOneIntervencionPreAdmisionVerificado(_internacion)
					.then(updateSolicitudPreadmisionOk);
				}

				function updateSolicitudPreadmisionAprobado () {
					PreadmisionDataService.updateOneIntervencionPreAdmisionAprobado(_internacion)
					.then(updateSolicitudPreadmisionOk);
				}

				function updateSolicitudPreadmisionOk () {
					ModalService.success('Solicitud actualizada con éxito');

					if ($scope.formSolicitud.formTabProtesis)
						$scope.formSolicitud.formTabProtesis.$pristine = true;
					
					if ($scope.formSolicitud.formTabPaciente)
						$scope.formSolicitud.formTabPaciente.$pristine = true;
				
					if ($scope.formSolicitud.formTabInforme) 
						$scope.formSolicitud.formTabInforme.$pristine = true;
					
					if ($scope.formSolicitud.formTabPrescripcion)
						$scope.formSolicitud.formTabPrescripcion.$pristine = true;

					$scope.formSolicitud.$pristine = true;
				}
			}

			function printSolicitud (pType) {
				var _type = {
					Nombre : pType
				};
				PreadmisionLogicService.print(User, _type, $stateParams.idSolicitud)
				.then(function () {},
					function (pError) {
						if (pError.message)
							ModalService.error(pError.message);
					});
			}

			function printOrdenInternacion () {
				if ($scope.formSolicitud.$pristine)
					printSolicitud('PrintOrden');
				else
					ModalService.info('Debe guardar los cambios primero');
			}

			function printRP () {
				if ($scope.formSolicitud.$pristine)
					printSolicitud('PrintRP');
				else
					ModalService.info('Debe guardar los cambios primero');
			}

			function printPresupuesto () {
				if ($scope.formSolicitud.formTabProtesis.$pristine)
					printSolicitud('PrintPresupuesto');
				else
					ModalService.info('Debe guardar los cambios primero');
			}

			function printPedidoMateriales () {
				if ($scope.formSolicitud.formTabProtesis.$pristine)
					printSolicitud('PrintPedidoMateriales');
				else
					ModalService.info('Debe guardar los cambios primero');
			}

			function printPrequirurgicos () {
				if ($scope.formSolicitud.$pristine)
					printSolicitud('PrintPrequirurgicos');
				else
					ModalService.info('Debe guardar los cambios primero');
			}

			function habilitarCirugia () {
				vm.formData.esQuirurgico = $scope.data.solicitud.TipoInternacion.EsQuirurgica;
				
				if (!vm.formData.esQuirurgico)
					vm.formData.requiereProtesis = false;

				validarRequiereProtesis();
			}

			/* MÉDICO | GUARDIA */

			function validarActionEditCreado () {
				var _flag = true;

				if ($scope.formSolicitud.formTabPaciente && 
						$scope.formSolicitud.formTabInforme &&
						$scope.formSolicitud.formTabPrescripcion) {

					if (!$scope.formSolicitud.formTabPaciente.$pristine ||
						!$scope.formSolicitud.formTabInforme.$pristine ||
						!$scope.formSolicitud.formTabPrescripcion.$pristine) {

						if (!$scope.formSolicitud.formTabPaciente.$valid || !$scope.formSolicitud.formTabInforme.$valid)
							_flag = false;
						else if (vm.formData.requiereProtesis && !$scope.formSolicitud.formTabPrescripcion.$valid)
							_flag = false;

					} else {
						_flag = false;
					}
				} else {
					_flag = false;
				}

				return _flag;
			}

			/* ADMISION */

			function validarActionEditEnProcesoIntervencion () {
				var _flag = false;
				if (!$scope.formSolicitud.$pristine && $scope.formSolicitud.formTabAdmision.$valid)
					_flag=true;

				return _flag;
			}

			function esAdmisionAutorizada () {
				var _flag = false;
				if (vm.formData.estadoAdmision && vm.formData.estadoAdmision.nombre_estado_admision)
					if (vm.formData.estadoAdmision.nombre_estado_admision == 'AUTORIZADO')
						_flag = true;

				return _flag;
			}

			/* PROTESIS */

			function validarRequiereProtesis () {
				if (!vm.formData.requiereProtesis && $scope.data.solicitud.ProtesisPreadmision.length > 0) {
					ModalService.confirm('Si quita esta opción, se eliminarán las prótesis solicitadas. ¿Desea continuar?',
						function (pResult) {
							if (pResult) {
								$scope.data.solicitud.ProtesisPreadmision.length = 0;
								vm.formData.requiereProtesis = false;
								PreadmisionLogicService.habilitarTabPrescripcion(false, vm.tabs);
							} else {
								vm.formData.requiereProtesis = true;
								PreadmisionLogicService.habilitarTabPrescripcion(true, vm.tabs);
							}
						});
				} else {
					PreadmisionLogicService.habilitarTabPrescripcion(vm.formData.requiereProtesis, vm.tabs);
				}
			}

			/* CIRUGIA */

			function validarActionEditAprobado () {
				var _flag = false;
				if (!$scope.formSolicitud.$pristine && $scope.formSolicitud.formTabCirugia.$valid)
					_flag = true;
				
				return _flag;
			}

			// #region PACIENTE

			function openSelectorPaciente () {
				$log.debug('PreadmisionNewController: OpenSelectorPaciente ON.-');
				PacienteLogicService.openPacienteSelector(User)
				.then(successCallback, errorCallBack);

				function successCallback (pPaciente) {
					$scope.data.solicitud.Paciente = pPaciente;
					getAllReadmisionByPaciente(pPaciente.id_paciente);
					$log.debug('PreadmisionNewController: OpenSelectorPaciente OK.-', pPaciente);
				}

				function errorCallBack (pError) {
					if (pError.message) {
						$scope.data.solicitud.Paciente = null;
					}
				}
			}

			function editPaciente() {
				// PreadmisionStorageService.savePreadmision($scope.data.solicitud);
				// PreadmisionStorageService.saveFormData(vm.formData, $scope.formSolicitud.$pristine);
				
				// //DEPRECADO => se redirige a appv2
				// //$state.go('paciente.edit', { idPacienteOld: $scope.data.solicitud.Paciente.id_paciente });
				// window.location.href = `${ENV.APP2}/paciente/edit/` + $scope.data.solicitud.Paciente.id_paciente;

				ModalService.info('Momentaneamente se ha deshabilitado esta funcion por compatibilidad. Para editar el paciente dirigirse al modulo de empadronamiento. Disculpe las molestias');
			}

			// function openNewTelefono () {
			// 	TelefonoLogicService.openModal()
			// 	.then(successCallback);

			// 	function successCallback (pTelefono) {
			// 		PacienteDataService
			// 		.addTelefonoPaciente($scope.data.solicitud.Paciente.id_paciente, pTelefono)
			// 		.then(function (pTelefonos) {
			// 			$scope.data.solicitud.Paciente.TelefonosPaciente = pTelefonos;
			// 		});
			// 	}
			// }

			// function getTelefonosByPaciente (pIdPaciente) {
			// 	PacienteDataService.getAllTelefonosByPaciente(pIdPaciente)
			// 	.then(successCallback)

			// 	function successCallback (pTelefonos) {
			// 		$scope.data.solicitud.Paciente.TelefonosPaciente = pTelefonos;
			// 	}
			// }

			function getAllReadmisionByPaciente (pIdPaciente) {
				PreadmisionDataService.getAllReadmisionByPaciente(pIdPaciente)
				.then(successCallback);

				function successCallback (pInternaciones) {
					if (pInternaciones.length) {
						ModalService.confirm('Este paciente fue dado de alta hace menos de 24 hs. ¿Desea readmitirlo?',
							function (pReadmitir) {
								if (pReadmitir) 
									PreadmisionDataService.readmitirPaciente(pInternaciones[0].id_internacion)
									.then(volver);
							});
					}
				}
			}

			// #endregion

			/* watch */

			$scope.$watch(function () {
				return vm.formControl.protesisChanged;
			}, function (newVal, oldVal) {
				if (newVal)
					validarEstadoPreadmision();
			});

			function validarEstadoPreadmision () {
				$log.debug('Algunar prótesis cambio');
				PreadmisionDataService.calcularEstadoPreadmision($scope.data.solicitud.id_internacion);
				vm.formControl.protesisChanged = false;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.info('Inicializar ON.-');

				if ($stateParams.idSolicitud) {

					if ($stateParams.externo) {
						vm.formControl.externo = true;
						$state.current.data.headerIf = false;
						$state.current.data.menuIf = false;
					}

					selectEdit();
					llenarTabs();

					$scope.data.prioridadesSolicitud = PrioridadesSolicitud;
					$scope.data.estadosPaciente = EstadosPaciente;
					$scope.data.estadosAdmision = EstadosAdmision;
					$scope.data.dificultadesGestion = DificultadesGestion;
					$scope.data.tiposInternacion = TiposInternacion;
					

					if (PreadmisionStorageService.havePreadmision()) {
						let preadmision = PreadmisionStorageService.getPreadmision();
						$scope.data.solicitud = preadmision;
						$scope.data.solicitud.Paciente = SolicitudPreadmision.Paciente;
						$scope.data.solicitud.IntervencionAdmision = preadmision.IntervencionAdmision;
					} else {
						$scope.data.solicitud = SolicitudPreadmision;
					}

					vm.alertaPaciente = [
						{
							IdTipoEntidad: 1, // Tipo paciente
							IdEntidades: [SolicitudPreadmision.id_paciente],
							TiposOrigen: [2], // 2:facturacion
							TiposAlerta: [2] // 2:presenta deuda facturacion
						}
					];

					llenarForm();
					$log.debug('Inicializar OK.-');
				} else {
					 volver();
				}

			}
		}
	};

	return module;

})();