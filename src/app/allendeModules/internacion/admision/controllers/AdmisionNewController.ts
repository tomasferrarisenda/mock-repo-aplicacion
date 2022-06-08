/**
 * @author 			emansilla
 * @description 	description
 */

import { IPersonaLogicService, IPersonaDataService } from "../../../persona/prospecto/services";
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AdmisionNewController', AdmisionNewController);

		AdmisionNewController.$inject = [
			'$scope', 'Logger', '$filter', '$state', '$stateParams', 'ModalService', 
			'AdmisionDataService',
			'AdmisionLogicService', 'PreadmisionLogicService', 'EmpresaLogicService',
			'PersonaLogicService', 'PersonaDataService',
			'CamaLogicService', 'TelefonoLogicService', 'AdmisionAuthService',
			// Inject por state
			'Solicitud', 'TiposPacienteFacturacion', 'TiposPorcentajes',
			'User'
		];

		function AdmisionNewController (
			$scope, $log, $filter, $state, $stateParams, ModalService,
			AdmisionDataService,
			AdmisionLogicService, PreadmisionLogicService, EmpresaLogicService,
			PersonaLogicService: IPersonaLogicService, PersonaDataService: IPersonaDataService,
			CamaLogicService, TelefonoLogicService, AdmisionAuthService,
			// Inject por state
			Solicitud, TiposPacienteFacturacion, TiposPorcentajes,
			User
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AdmisionNewController');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			$scope.tabs = [];
			vm.today = new Date();
			vm.esAdmision = true;
			vm.alertaPaciente = [];

			vm.title = {
				page : $state.current.data.title + $stateParams.idSolicitud
			};

			// En todas los controllers.
			$scope.constante = {
				idInternacion: $stateParams.idSolicitud
			};

			$scope.data = {
				tiposPorcentaje : [],
				tiposPacienteFacturacion : [],
				internacion : {}
			};

			$scope.formData = {
				// Garante
				numeroDocumentoGarante: '',
				tipoDocumentoGarante: {
					id_tipo_documento: ''
				},
				// Empresa
				numeroCuitEmpresa: '',
				facturaEmpresa: false,
				// Porcentajes
				arrayPorcentaje : [],
				porcentajesCargoInternacion : []
			};

			$scope.formControl = {
				loading : false,
				error : false,
				existeGarante : true,
				existeEmpresa : true,
				reloadPage : activate,
				guardar : updateInternacion,
				volver : volver,
				admitir : openHabitaciones,
				cargarPorcentajes: cargarPorcentajes
			};

			$scope.validar = {
				form : validarForm,
				garante : validarGarante,
				empresa : validarEmpresa,
				facturaEmpresa : validarFacturaEmpresa
			};

			$scope.garante = {
				openModal :openModalGarante,
				openTelefono: openTelefonoGarante
			};

			$scope.empresa = { openModal: openModalEmpresa };

			$scope.internacion = {
				// admitir : admitirPaciente,
				// guardar : updateInternacion,
				reimprimirRP : printRP,
				reimprimirFichaInternacion : printFichaInternacion,
				selectPrint : selectPrint
			};

			/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */

			// #region FORMULARIO

			function inicializarVariables () {
				$scope.formData.tipoDocumentoGarante = {
					id_tipo_documento: '1'
				};
			}
			
			function llenarForm () {
				if ($scope.data.internacion.EmpresaFactura !== null) {
					$scope.formData.facturaEmpresa = true;
				}

				$scope.tabs = AdmisionAuthService.getTabs($state.current.data.idPermiso, User);
				// Porcentaje
				$scope.formData.arrayPorcentaje = AdmisionLogicService
					.getArrayPorcentaje($scope.data.internacion.PorcentajesCargoInternacion, $scope.data.tiposPorcentaje);

				validarFacturaEmpresa();
				llenarGarante();
				llenarEmpresa();
			}

			function validarForm () {
				var _flag = true;
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
				if (!$scope.data.internacion.Paciente.Telefonos || !$scope.data.internacion.Paciente.Telefonos.length) {
					_flag = false;
				}
				return _flag;
			}

			function volver () {
				$state.go('admision.list');
			}

			// #endregion

			// #region EMPRESA

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

			function validarEmpresa () {
				var _flag = false;
				if ($scope.formSolicitud.numeroCuitEmpresa.$valid ) {
					_flag = true;
				}
				return _flag;
			}

			function llenarEmpresa () {
				if ($scope.data.internacion.EmpresaFactura != null) {
					$scope.formData.numeroCuitEmpresa = $scope.data.internacion.EmpresaFactura.cuit;
				}
			}

			function openModalEmpresa () {
				EmpresaLogicService.openModal($scope.formData.numeroCuitEmpresa, User)
				.then(empresa => {
					$scope.data.internacion.EmpresaFactura = empresa;
					llenarEmpresa();
				}, error => {
					$scope.data.internacion.EmpresaFactura = null;
				});
			}

			// #endregion

			// #region GARANTE

			function validarGarante () {
				var _flag = false;
				if ($scope.formSolicitud.tipoDocumentoGarante.$valid &&
					$scope.formSolicitud.numeroDocumentoGarante.$valid) {
					_flag = true;
				}
				return _flag;
			}

			function llenarGarante () {
				if ($scope.data.internacion.PersonaGarante != null) {
					$scope.formData.tipoDocumentoGarante.id_tipo_documento = 
						$scope.data.internacion.PersonaGarante.TipoDocumento.id_tipo_documento;
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

			// #endregion

			// #region PACIENTE

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

			// #endregion

			// #region INTERNACION

			function crearInternacion () {
				return AdmisionLogicService.crearInternacionForAdmision(
					$scope.data.internacion,
					$scope.formData,
					User
					);
			}

			function updateInternacion () {
				$log.debug('UpdatePaciente ON.-');
				var _internacion = crearInternacion();
				AdmisionDataService.updateInternacion(_internacion)
				.then(successCallback);

				function successCallback (pInternacion) {
					$log.debug('UpdatePaciente OK.-', pInternacion);
					ModalService.success('Solicitud actualizada: '+ _internacion.id_internacion);
					volver();
				}
			}

			function admitirPaciente (pInternado) {
				$log.debug('AdmitirPaciente ON.-');
				var _internacion;
				if (!pInternado) {
					_internacion = crearInternacion();
				} else {
					_internacion = pInternado;
				}
				let sucursales: any[] = User.sucursales;

				if (sucursales.some(s=> s.Id == _internacion.Sucursal.id_sucursal)){
					AdmisionDataService.admitirPaciente(_internacion)
					.then(admitirPacienteOk);
				} else {
					ModalService.warn('No tiene permiso para admitir en la sucursal ' + _internacion.Sucursal.descripcion);
				}

				
				function admitirPacienteOk (pInternacion) {

					$log.debug('AdmitirPaciente OK.-', pInternacion);

					ModalService.confirm('¿Desea imprimir los documentos?',
						function (pResult) {
							if (pResult) {
								imprimirDocumentos(pInternacion);
							} else {
								notifiarAdmisionCorrecta(pInternacion);
								volver();
							}
						});
				}
			}

			function imprimirDocumentos(pInternacion) {
				var _print = {
					Nombre: ''
				};
				_print.Nombre = 'PrintHomeTicket';
				AdmisionLogicService.print(_print, User, pInternacion.id_internacion)
				.then(successCallback, function (pError) {
					if (pError.message) {
						ModalService.error(pError.message);
					} else {

						_print.Nombre = 'PrintFichaInternacion';
						AdmisionLogicService.print(_print, User, pInternacion.id_internacion)
						.then(successCallback, function (pError) {
							if (pError.message) {
								ModalService.error(pError.message);
							} else {

								_print.Nombre = 'PrintHojaAdmision';
								AdmisionLogicService.print(_print, User, pInternacion.id_internacion)
								.then(successCallback, function (pError) {
									if (pError.message) {
										ModalService.error(pError.message);
									} else {
										_print.Nombre = 'PrintAval';
										AdmisionLogicService.print(_print, User, pInternacion.id_internacion)
										.then(successCallback, function (pError) {
											if (pError.message) {
												ModalService.error(pError.message);
											} else {
												
												AdmisionLogicService.printPulsera(pInternacion.id_internacion);
												notifiarAdmisionCorrecta(pInternacion);
												volver();
											}
										});
									}
								});

							}
						});
					}
				});

				function successCallback() {
					// No hacer nada
				}
			}

			function notifiarAdmisionCorrecta(pInternacion) {
				var _mensajeSuccess;
				if ($filter('date')(pInternacion.fecha_admision_probable, 'dd/MM/yyyy') > $filter('date')( vm.today, 'dd/MM/yyyy')) {
					_mensajeSuccess = 'Paciente Admitido: '+ pInternacion.numero_internado + 
						'. El paciente tenía fecha probable de internación para el ' +
						$filter('date')(pInternacion.fecha_admision_probable, 'dd/MM/yyyy') +
						'. Informar a quirófano si se opera antes. ';
				}
				else {
					_mensajeSuccess = 'Paciente Admitido: '+ pInternacion.numero_internado;
				}
				ModalService.success(_mensajeSuccess);
			}

			function openHabitaciones () {

				CamaLogicService.openHabitaciones($scope.data.internacion, User)

				.then(function (pCama) {
					// Creo el movimiento
					var _internado = crearInternacion();
					$log.debug('openHabitaciones: crear internacion', _internado);

					_internado.usuario_admision = User.userName.substring(0,30);

					if (pCama) 
						_internado.CamaActual = pCama;
					else 
						_internado.CamaActual = null;
					
					admitirPaciente(_internado);
				}, function (pError) {
					if (pError.message)
						ModalService.error(pError.message);
				});
			}

			function printRP () {
				var _type = {
					Nombre: 'PrintRP'
				};
				PreadmisionLogicService.print(User, _type, $scope.data.internacion.id_internacion);
			}

			function printFichaInternacion () {
				var _type = {
					Nombre: 'PrintFichaInternacion'
				};
				AdmisionLogicService.print(_type, User, $scope.data.internacion.id_internacion);
			}

			function cargarPorcentajes () {
				$scope.formData.porcentajesCargoInternacion = AdmisionLogicService
					.getPorcentajesCargoInternacion($scope.formData.arrayPorcentaje, $scope.data.tiposPorcentaje);
			}

			function selectPrint() {
				AdmisionAuthService.selectPrint(User);
			}

			// #endregion

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');

				if($stateParams.idSolicitud) {
					$log.debug('Inicializar OK.-');

					inicializarVariables();
					$scope.data.internacion = Solicitud;
	 				$scope.data.tiposPorcentaje = TiposPorcentajes;
	 				$scope.data.tiposPacienteFacturacion = TiposPacienteFacturacion;
	 				vm.alertaPaciente = [
	 					{
	 						IdTipoEntidad:1, // Tipo paciente
	 						IdEntidades:[Solicitud.id_paciente],
	 						TiposOrigen:[2], // 2:facturacion
	 						TiposAlerta:[2] // 2:presenta deuda facturacion
	 					}
	 				];
	 				// getTelefonosByPaciente($scope.data.internacion.id_paciente);
	 				llenarForm();
				} else {
					volver();
				}
 			}
		}
	};

	return module;

})();