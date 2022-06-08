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

		module.controller('PreadmisionNewController', PreadmisionNewController);

		PreadmisionNewController.$inject = [
			'$scope', 'Logger', '$state', '$stateParams', 'ModalService',
			'PreadmisionDataService', 'PacienteDataService', 'PreadmisionStorageService',
			'PreadmisionLogicService', 'PacienteLogicService', 'TelefonoLogicService', 'PreadmisionAuthService',
			// Datos injectados
			'PrioridadesSolicitud', 'EstadosPaciente', 'TiposInternacion',  'SolicitudPreadmisionNew', 'Medico', 'Paciente',
			'User', 'ENV'
		];

		function PreadmisionNewController (
			$scope, $log, $state, $stateParams, ModalService: IModalService,
			PreadmisionDataService, PacienteDataService: IPacienteDataService, PreadmisionStorageService: IPreadmisionStorageService,
			PreadmisionLogicService, PacienteLogicService, TelefonoLogicService, PreadmisionAuthService,
			// Datos injectados
			PrioridadesSolicitud, EstadosPaciente, TiposInternacion,  SolicitudPreadmisionNew, Medico, Paciente,
			User, ENV) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			// $scope.today se usa para modal preadmision-save.tpl.tml
			$scope.today = new Date();

			vm.today = new Date();
			vm.title = {
				page: $state.current.data.title,
				module: $state.current.data.module,
				path : $state.current.data.path
			};
			vm.tabs = [];
			vm.tabCtrl = {
				active : 1
			};
			
			vm.constante = {
				disabled : false
				// matriculaMedico : PreadmisionDataService.matriculaMedico || User.employeeId
			};
			
			$scope.data = {
				turnoCirugia : null,
				solicitud : {}
			};

			vm.formData = {
				requiereProtesis : false,
				requiereMedicoCirujano : false,
				esQuirurgico : false
			};

			vm.formControl = {
				externo : false,
				error : true,
				loading : false,
				reloadPage : reloadPage,
				esUrgente : $state.current.data.urgent,
				// Para que funciones en Edit y New
				esEditCreado : true,
				protesisChanged : false,
				habilitarCirugia : habilitarCirugia,
				save : confirmarSolicitud,
				cancel: cancel,

				buscarPlantillas : buscarPlantillas,
				// Tabs
				nextTab : nextTab,
				previousTab : previousTab
			};

			vm.turno = {
				loading : false,
				cargar : cargarFechaTurno
			};

			vm.validar = {
				form : validarForm,
				requiereProtesis : validarRequiereProtesis
			};

			vm.paciente = {
				openSelector : openSelectorPaciente,
				// openNewTelefono: openNewTelefono,
				edit: editPaciente
			};

			vm.solicitud = { save : saveSolicitudPreadmision };

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function reloadPage () {
				$state.reload();
			}

			function validarForm () {
				var _flag = true;
				
				if (!vm.formData.esQuirurgico) {
					$scope.data.solicitud.Prequirurgicos = [];
					$scope.data.solicitud.ProtesisPreadmision = [];
				}

				if (!$scope.data.solicitud.Paciente || !$scope.data.solicitud.MedicoSolicitante)
					_flag = false;

				return _flag;
			}

			function llenarTabs () {
				vm.tabs = PreadmisionAuthService.getTabs($state.current.data.idPermiso, User);
				validarRequiereProtesis();
			}

			function nextTab (pId) {
				vm.tabCtrl.active = PreadmisionLogicService.nextTab(pId, vm.tabs);
			}

			function previousTab (pId) {
				vm.tabCtrl.active = PreadmisionLogicService.previousTab(pId, vm.tabs);
			}

			function cancel () {
				ModalService.confirm('¿Desea cancelar la solicitud?',
					function (pResult) {
						if (pResult) volver();
					});
			}

			/* Otros mètodos*/

			function habilitarCirugia () {
				vm.formData.esQuirurgico = $scope.data.solicitud.TipoInternacion.EsQuirurgica;
				
				if (!vm.formData.esQuirurgico) {
					vm.formData.requiereProtesis = false;
					$scope.data.solicitud.Prequirurgicos = [];
					$scope.data.solicitud.ProtesisPreadmision = [];
				}

				validarRequiereProtesis();
			}

			function cargarFechaTurno () {
				$log.debug('CargarFechaTurno ON.-');
				vm.formControl.loadingTurno = true;
				PreadmisionDataService.getAllTurnosCirugiaByPaciente($scope.data.solicitud.Paciente.id_paciente)
				.then(successCallback, errorCallback);

				function successCallback (pTurnosCirugia) {
					vm.formControl.loadingTurno = false;
					$scope.data.turnoCirugia = pTurnosCirugia;
					for (var i = 0; i < $scope.data.sucursales.length; i++) {
						if ($scope.data.sucursales[i].id_sucursal == pTurnosCirugia.id_sucursal)
							$scope.data.solicitud.Sucursal = $scope.data.sucursales[i];
					}

					$scope.data.solicitud.IntervencionAdmision.fecha_cirugia_probable = 
							$scope.data.turnoCirugia.fecha_cirugia;
					$log.debug('CargarFechaTurno OK.-', pTurnosCirugia);
				}

				function errorCallback (pError) {
					vm.formControl.loadingTurno = false;
					$log.warn('CargarFechaTurno ERROR.-', pError);
				}
			}

			function volver () {

				if ($stateParams.externo) {
					$state.go('preadmision.list.externo',{
						clavePaciente : $stateParams.clavePaciente,
						matricula : $stateParams.matricula
					});
				} else {
					$state.go('preadmision.list');
				}
			}

			/* SOLICITUD */

			function confirmarSolicitud () {
				PreadmisionLogicService.saveSolicitud($scope)
				.then(saveSolicitudPreadmision,
					function () {
						vm.formData.saveTemplate = false;
						// $scope.data.solicitud.nombre_template;
					});
			}

			function saveSolicitudPreadmision () {
				var _solicitud = PreadmisionLogicService
					.crearSolicitudPreadmisionForNew($scope.data.solicitud, $scope.data.turnoCirugia, User);
					
				$log.debug('GuardarSolicitud ON.-');

				PreadmisionLogicService.addOnePreadmision(_solicitud)
					.then(saveSolicitudPreadmisionOk);
				

				function saveSolicitudPreadmisionOk (pSolicitudReturn) {
					// PreadmisionDataService.idSolicitud = pSolicitudReturn.id_internacion;
					$log.debug('GuardarSolicitud OK.-');
					var _id = pSolicitudReturn.id_internacion;
					ModalService.success('Creación de solicitud Nº'
						+ _id + ' exitosa. \n Informar al paciente que se dirija a Admision');
					volver();
				}
			}

			function buscarPlantillas () {
				PreadmisionLogicService.openTemplates($scope.data.solicitud.MedicoSolicitante.numero_matricula)
				.then(function (pInternacionTemplate) {
					PreadmisionLogicService.copyTemplate(pInternacionTemplate, $scope.data.solicitud);

					if ($scope.data.solicitud.ProtesisPreadmision.length)
						vm.formData.requiereProtesis = true;

					if ($scope.data.solicitud.Prequirurgicos)
						vm.formData.prequirurgicoValido = true;
					
					habilitarCirugia();
					$scope.formSolicitud.$pristine = false;
				});
			}

			/* PROTESIS */

			function validarRequiereProtesis () {

				// Si no requiere prótesis
				if (!vm.formData.requiereProtesis) {

					// Si no requiere prótesis y
					// ProtesisPreadmision existe y tiene por lo menos una prótesis
					// Entonces
					// Pregunta si desea eliminar las prótesis que tiene cargadas.
					if ($scope.data.solicitud.ProtesisPreadmision && $scope.data.solicitud.ProtesisPreadmision.length > 0) {

						ModalService.confirm('Si quita esta opción, se eliminarán las prótesis solicitadas. ¿Desea continuar?',
							function (pResult) {
								if (pResult) {
									// $scope.data.solicitud.ProtesisPreadmision.length = 0;
									$scope.data.solicitud.ProtesisPreadmision.length = [];
									vm.formData.requiereProtesis = false;
									PreadmisionLogicService.habilitarTabPrescripcion(false, vm.tabs);
								} else {
									vm.formData.requiereProtesis = true;
									PreadmisionLogicService.habilitarTabPrescripcion(true, vm.tabs);
								}
							});
					} else {
						// Si no requiere prótesis y
						// ProtesisPreadmision no existe o no tiene por lo menos una prótesis
						// Entonces
						// Deshabilito la solapa prescripción de elementos
						PreadmisionLogicService.habilitarTabPrescripcion(false, vm.tabs);
					}
				} else {
					// Si requiere prótesis
					// Entonces
					// Habilito la solapa prescripción de elementos
					PreadmisionLogicService.habilitarTabPrescripcion(vm.formData.requiereProtesis, vm.tabs);
				}
			}

			// #region PACIENTE

			function openSelectorPaciente () {
				$log.debug('OpenSelectorPaciente ON.-');
				PacienteLogicService.openPacienteSelector(User)
				.then(successCallback, errorCallBack);

				function successCallback (pPaciente) {
					$scope.data.solicitud.Paciente = pPaciente;
					$scope.formSolicitud.$pristine = false;
					getAllReadmisionByPaciente(pPaciente.id_paciente);
					$log.debug('OpenSelectorPaciente OK.-', pPaciente);
				}

				function errorCallBack (pError) {
					if (pError.message) {
						$scope.data.solicitud.Paciente = null;
					}
					$log.error('GetOnePacienteByDocumento ERROR.-', pError);
				}
			}

			function editPaciente() {
				// PreadmisionStorageService.savePreadmision($scope.data.solicitud);
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

			function getAllReadmisionByPaciente (pIdPaciente) {
				PreadmisionDataService.getAllReadmisionByPaciente(pIdPaciente)
				.then(successCallback);

				function successCallback (pInternaciones) {
					if (pInternaciones.length) {
						ModalService.confirm('Este paciente fue dado de alta hace menos de 24 hs. ¿Desea readmitirlo?',
							function (pReadmitir) {
								if (pReadmitir) {

									if (PreadmisionAuthService.puedeReadmitir(User)) {

										ModalService.confirm(`¿Está seguro que desea readmitir al paciente ${pInternaciones[0].Paciente.nombre_completo}?`,
											function (pResult) {
												if (pResult) {
													pInternaciones[0].usuario_modifica = User.userName.substring(0, 30);
													PreadmisionDataService.readmitirPaciente(pInternaciones[0].id_internacion)
														.then(function () {
															ModalService.success(`Se readmitió al paciente con éxito. Ingrese al censo para asignarle cama. N° internado ${pInternaciones[0].numero_internado}`);
															volver();
														});	
												}
										});
									} else {
										ModalService.warn('Usted no posee permiso para readmitir pacientes.');
									}
								}
							});
					}
				}
			}

			// #endregion

			/* VALIDAR */

			function cargarDatosMedico (pMedico) {
				if (pMedico) {
					$scope.data.solicitud.MedicoSolicitante = pMedico;
				}
			}

			function cargarDatosPaciente (pPaciente) {
				if (pPaciente) {
					$scope.data.solicitud.Paciente = pPaciente;
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				// $log.debug('Inicializar ON.-', PreadmisionDataService.matriculaMedico, User.employeeId);

				llenarTabs();

				if ($stateParams.externo) {
					vm.formControl.externo = true;
					$state.current.data.headerIf = false;
					$state.current.data.menuIf = false;
				}

				$scope.data.prioridadesSolicitud = PrioridadesSolicitud;
				$scope.data.estadosPaciente = EstadosPaciente;
				$scope.data.tiposInternacion = TiposInternacion;

				if (PreadmisionStorageService.havePreadmision()) {
					$scope.data.solicitud = PreadmisionStorageService.getPreadmision();
					PacienteDataService.getOnePacienteByClave($scope.data.solicitud.Paciente.id_paciente)
						.then(p => cargarDatosPaciente(p));
				} else {
					$scope.data.solicitud = SolicitudPreadmisionNew;
					cargarDatosPaciente(Paciente);
				}

				cargarDatosMedico(Medico);
			}
		}
	};

	return module;

})();