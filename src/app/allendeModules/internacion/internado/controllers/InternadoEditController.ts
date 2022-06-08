import { IPersonaLogicService, IPersonaDataService } from '../../../persona/prospecto/services';
/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoEditController',InternadoEditController);

		// Inyeccion de dependencia
		InternadoEditController.$inject = [
			'$scope', 'Logger', '$filter', '$state', '$stateParams',
			'ModalService', 'MovimientoCamaService',
			'AdmisionDataService', 'TelefonoLogicService',
			'AdmisionLogicService', 'PreadmisionLogicService', 'EmpresaLogicService',
			'PersonaLogicService', 'PersonaDataService', 'CamaLogicService',
			'AutorizacionInternadoLogicService', 'InternadoAuthService',
			// Inject por state
			'Internado', 'TiposAfiliados', 'EstadosAdmision', 'TiposPacienteFacturacion', 'TiposPorcentajes',
			'User'];
		
		// Constructor del Controller
		function InternadoEditController (
			$scope, $log, $filter, $state, $stateParams,
			ModalService, MovimientoCamaService,
			AdmisionDataService, TelefonoLogicService,
			AdmisionLogicService, PreadmisionLogicService, EmpresaLogicService,
			PersonaLogicService: IPersonaLogicService, PersonaDataService: IPersonaDataService, CamaLogicService,
			AutorizacionInternadoLogicService, InternadoAuthService,
			// Inject por state
			Internado, TiposAfiliados, EstadosAdmision, TiposPacienteFacturacion, TiposPorcentajes,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoEditController');
			$log.debug('ON.-');

			/* ------------------------------------------- API Y VARIABLES ------------------------------------------- */
				
			var vm = this;

			vm.user = User;
			vm.title = {
				icon : $state.current.data.icon,
				page : $state.current.data.title,
				detail : ''
			};

			$scope.constante = {
				today : new Date()
			};

			$scope.formData = {
				facturaEmpresa: false,
				numeroCuitEmpresa: '',
				tipoDocumentoGarante: '',
				numeroDocumentoGarante: '',
				camaSeleccionada: null,
				categoriaHabitacion: {},
				tipoHabitacionFisica: {}
			};

			$scope.data = {
				internacion: {},
				garante: {},
				empresa: {},
				tiposPorcentaje : [],
				tiposAfiliado : [],
				estadosAdmision : [],
				tiposPacienteFacturacion : []
			};

			$scope.formControl = {
				error: false,
				loading: true,
				existeGarante: true,
				existeEmpresa: true,
				reloadPage: reloadPage,
				volver: volver,
				esEdit : true,
				deAlta : $state.current.data.deAlta,
				cargarPorcentajes : cargarPorcentajes

			};

			$scope.garante = {
				openModal: openModalGarante,
				openTelefono: openTelefonoGarante
			};

			$scope.empresa = { openModal : openModalEmpresa };

			// $scope.paciente = { openNewTelefono : openNewTelefono };

			$scope.autorizacion = {
				new : newAutorizacioInternacion,
				view : viewAutorizacioInternacion,
				edit : editAutorizacionInternacion,
				print : printAutorizacionInternacion
			};

			$scope.validar = {
				form : validarForm,
				facturaEmpresa : validarFacturaEmpresa
			};

			$scope.internacion = {
				nuevoMovimiento: nuevoMovimientoCama,
				vueltaAtrasMovimiento: vueltaAtrasMovimiento,
				reimprimirRP: printRP,
				selectPrint : selectPrint,
				// reimprimirFichaInternacion : printFichaInternacion,
				// prorroga : prorrogarInternacion,
				guardar : updateInternacion,
				darDeAlta: darDeAltaInternacion
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver () {
				var stateReturn = AdmisionDataService.pathReturn || 'internado.list';
				$state.go(stateReturn);
			}

			function reloadPage() {
				$state.reload();
			}

			function validarForm () {
				var _flag = true;

				if ($scope.formControl.deAlta) {
					if ($scope.data.internacion.PersonaGarante == null) {
						_flag = false;
					} else if (!$scope.formControl.existeGarante) {
						_flag = false;
					}
					if ($scope.formData.facturaEmpresa && $scope.data.internacion.EmpresaFactura == null) {
						_flag = false;
					} else if (!$scope.formControl.existeEmpresa) {
						_flag = false;
					}
				}
				return _flag;
			}

			function llenarForm () {
				if ($scope.data.internacion.PersonaGarante) {
					$scope.formData.tipoDocumentoGarante = $scope.data.internacion.PersonaGarante.TipoDocumento;
					$scope.formData.numeroDocumentoGarante = $scope.data.internacion.PersonaGarante.numero_documento;
				}

				$scope.data.garante = $scope.data.internacion.PersonaGarante;
				if ($scope.data.internacion.EmpresaFactura != null) {
					$scope.formData.facturaEmpresa = true;
					$scope.formData.numeroCuitEmpresa= $scope.data.internacion.EmpresaFactura.cuit;
					$scope.data.empresa = $scope.data.internacion.EmpresaFactura;
				}

				// Porcentaje
				$scope.formData.arrayPorcentaje = AdmisionLogicService
				.getArrayPorcentaje($scope.data.internacion.PorcentajesCargoInternacion, $scope.data.tiposPorcentaje);

				validarFacturaEmpresa();
			}

			/* EMPRESA */

			function validarFacturaEmpresa () {
				for (var i = 0; i < $scope.tabs.length; i++) {
					if ($scope.tabs[i].NAME == 'EMPRESA') {
						if ($scope.formData.facturaEmpresa) {
							$scope.tabs[i].HIDE = false;
						} else {
							$scope.tabs[i].HIDE = true;
						}
					}
				}
			}

			function llenarEmpresa () {
				if ($scope.data.internacion.EmpresaFactura != null) {
					$scope.formData.numeroCuitEmpresa = $scope.data.internacion.EmpresaFactura.cuit;
				}
			}

			function openModalEmpresa () {
				EmpresaLogicService.openModal($scope.formData.numeroCuitEmpresa, User)
				.then(successCallback, errorCallback);

				function successCallback (pEmpresa) {
					$scope.data.internacion.EmpresaFactura = pEmpresa;
					llenarEmpresa();
				}

				function errorCallback (pError) {
					$scope.data.internacion.EmpresaFactura = null;
				}
			}

			/* GARANTE */

			function llenarGarante () {
				if ($scope.data.internacion.PersonaGarante != null) {
					$scope.formData.tipoDocumentoGarante.id_tipo_documento = $scope.data.internacion.PersonaGarante.TipoDocumento.id_tipo_documento;
					$scope.formData.numeroDocumentoGarante = $scope.data.internacion.PersonaGarante.numero_documento;
					$scope.formControl.existeGarante = true;
				}
			}

			function openModalGarante () {
				PersonaLogicService
				.openModal($scope.formData.tipoDocumentoGarante, $scope.formData.numeroDocumentoGarante, User)
					.then(pPersona => {
						$scope.data.internacion.PersonaGarante = pPersona;
						llenarGarante();
					}, error => {
						$scope.data.internacion.PersonaGarante = null;
					});
			}

			function openTelefonoGarante(telefono?) {
				TelefonoLogicService.openModal(telefono)
				.then(successCallback);

				function successCallback (pTelefono) {
					PersonaDataService.addTelefono($scope.data.internacion.PersonaGarante.id_persona, pTelefono)
					.then(function (pTelefonos) {
						$scope.data.internacion.Paciente.TelefonosPaciente = pTelefonos;
						openModalGarante();
					});
				}
			}

			/* PACIENTE */

			// function getTelefonosByPaciente (pIdPaciente) {
			// 	PacienteDataService.getAllTelefonosByPaciente(pIdPaciente)
			// 	.then(successCallback);

			// 	function successCallback (pTelefonos) {
			// 		$scope.data.internacion.Paciente.TelefonosPaciente = pTelefonos;
			// 	}
			// }

			// function openNewTelefono () {
			// 	TelefonoLogicService.openModal()
			// 	.then(successCallback);

			// 	function successCallback (pTelefono) {
			// 		PacienteDataService
			// 		.addTelefonoPaciente($scope.data.internacion.Paciente.id_paciente, pTelefono)
			// 		.then(function (pTelefonos) {
			// 			$scope.data.internacion.Paciente.TelefonosPaciente = pTelefonos;
			// 		});
			// 	}
			// }

			/* INTERNACION */

			function crearInternacion () {
				return AdmisionLogicService.crearInternacionForAdmision(
					$scope.data.internacion,
					$scope.formData,
					User
					);
			}

			function updateInternacion () {
				$log.debug('UpdateInternado ON.-');
				var _internacion = crearInternacion();
				AdmisionDataService.updateInternacion(_internacion)
				.then(successCallback);

				function successCallback (pInternacion) {
					$log.debug('UpdateInternado OK.-');
					ModalService.success('Internado actualizado: '+ _internacion.numero_internado);
					volver();
				}
			}

			function darDeAltaInternacion () {
				AdmisionLogicService.darDeAlta($scope.data.internacion.id_internacion, User)
				.then(successCallback);

				function successCallback () {
					ModalService.success('Alta exitosa. N° Internado: ' + $scope.data.internacion.numero_internado);
					volver();
				}
			}

			function nuevoMovimientoCama () {
				var _movimiento;

				CamaLogicService.openHabitaciones($scope.data.internacion, User)
				.then(successCallback);

				function successCallback (pCama) {
					if (pCama) {
						ModalService.prompt('Ingrese motivo del movimiento', '',
							function (pMotivo) {
								if (pMotivo) {
									_movimiento = MovimientoCamaService
										.newMovimientoCama(pCama, pMotivo, User, $scope.data.internacion.id_internacion);

									MovimientoCamaService.addOneMovimientoCama(_movimiento)
									.then(function (pIdMovimiento) {
										ModalService.success('Nuevo movimiento creado');
										reloadPage();
									});

								} else {
									ModalService.error('No ingresó ningún motivo. Intente de nuevo.');
								}
							});
					} else {
						ModalService.error('No seleccionó ninguna cama. Intente de nuevo.');
					}
				}
			}

			function getNumeroCamaByIndexMovimiento (pIndex) {
				var _text = '';
				_text = 'habitación  ';
				_text += $scope.data.internacion.MovimientosCama[pIndex].Cama.Habitacion.numero_habitacion;
				_text += ' cama ';
				_text += $scope.data.internacion.MovimientosCama[pIndex].Cama.numero_cama;
				return _text;
			}

			function vueltaAtrasMovimiento (pIndex) {
				var _camaVieja, _camaNueva;

				if ($scope.data.internacion.MovimientosCama.length > 1 && pIndex > 0) {
					_camaVieja = getNumeroCamaByIndexMovimiento(pIndex);
					_camaNueva = getNumeroCamaByIndexMovimiento(pIndex-1);
					ModalService.prompt('¿Desea volver a ocupar la ' + _camaNueva +' y desocupar la ' + _camaVieja + '?',
						'',cargarObservaciones);
				}

				function cargarObservaciones (pObservaciones) {
					if (pObservaciones) {
						MovimientoCamaService.rollbackLasMovimiento(
							$scope.data.internacion.id_internacion,
							pObservaciones,
							User
						).then(activate);
					}
				}
			}

			function printRP () {
				var _type = {
					Nombre: 'PrintRP'
				};
				PreadmisionLogicService.print(User, _type, $scope.data.internacion.id_internacion);
			}

			function selectPrint () {
				InternadoAuthService.selectPrint(User)
				.then(function (pPrintSelected) {
					AdmisionLogicService.print(pPrintSelected, User, $scope.data.internacion.id_internacion);
				});
			}

			function cargarPorcentajes () {
				$scope.formData.porcentajesCargoInternacion = AdmisionLogicService
						.getPorcentajesCargoInternacion($scope.formData.arrayPorcentaje, $scope.data.tiposPorcentaje);
			}

			/* AUTORIZACION*/
			function newAutorizacioInternacion () {
				$state.go('autorizacion.new', {idInternacion : $scope.data.internacion.id_internacion});
			}

			function viewAutorizacioInternacion (pId) {
				$state.go('autorizacion.view', {
					idInternacion : $scope.data.internacion.id_internacion,
					idIntervencion : pId
				});
			}

			function editAutorizacionInternacion (pId) {
				$state.go('autorizacion.editSelect', {
					idInternacion : $scope.data.internacion.id_internacion,
					idIntervencion : pId
				});
			}

			function printAutorizacionInternacion (pIntervencion) {
				AutorizacionInternadoLogicService
					.printAll(pIntervencion.id_internacion, pIntervencion.id_intervencion_admision, User);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-');
				$scope.formControl.loading = true;


				if ($stateParams.idInternacion) {
					$scope.formControl.loading = false;

					$scope.tabs = InternadoAuthService.getTabs($state.current.data.idPermiso, User);

					$scope.data.internacion = Internado;
					$scope.data.tiposPorcentaje = TiposPorcentajes;
					$scope.data.tiposAfiliado = TiposAfiliados;
					$scope.data.estadosAdmision = EstadosAdmision;
					$scope.data.tiposPacienteFacturacion = TiposPacienteFacturacion;

					vm.title.page += Internado.numero_internado;

					vm.title.detail = $scope.data.internacion.Paciente.nombre_completo + ' - INGRESO: ' + 
						$filter('date')($scope.data.internacion.fecha_admision, 'dd/MM/yyyy HH:mm');

					if ($scope.data.internacion.fecha_alta_administrativa) {
						vm.title.detail += ' - ALTA: ' +
						$filter('date')($scope.data.internacion.fecha_alta_administrativa, 'dd/MM/yyyy HH:mm');
					}
					// getTelefonosByPaciente($scope.data.internacion.id_paciente);
					llenarForm();

				} else {
					$scope.formControl.loading = false;
					volver();
				}
			}
		}

	};

	return module;

})();