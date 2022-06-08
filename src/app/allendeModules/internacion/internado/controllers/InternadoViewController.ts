import { IPacienteDataService } from '../../../persona/paciente/services';

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoViewController', InternadoViewController);

		// Inyeccion de dependencia
		InternadoViewController.$inject = [
			'$scope', 'Logger', '$location',  '$filter', '$state', '$stateParams',
			'InternadoAuthService',
			'AdmisionDataService', 'PreadmisionDataService',
			'AdmisionLogicService', 'PreadmisionLogicService', 'AutorizacionInternadoLogicService',
			'Internado', 'TiposAfiliados', 'EstadosAdmision', 'TiposPacienteFacturacion', 'TiposPorcentajes',
			'User'
		];
		
		// Constructor del Controller
		function InternadoViewController (
			$scope, $log, $location, $filter, $state, $stateParams,
			InternadoAuthService,
			AdmisionDataService, PreadmisionDataService,
			AdmisionLogicService, PreadmisionLogicService, AutorizacionInternadoLogicService,
			Internado, TiposAfiliados, EstadosAdmision, TiposPacienteFacturacion, TiposPorcentajes,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoViewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
				
			var vm = this;
			vm.title = {
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
				tiposPorcentaje : []
			};

			$scope.formControl = {
				error: false,
				loading: false,
				existeGarante: true,
				existeEmpresa: true,
				reloadPage: reloadPage,
				volver: volver,
				esEdit : false,
				cargarPorcentajes : cargarPorcentajes
			};

			$scope.garante = { openModal : openModalGarante };

			$scope.empresa = { openModal : openModalEmpresa };

			// $scope.paciente = { openNewTelefono : openNewTelefono };

			$scope.validar = {
				form : validarForm,
				facturaEmpresa : validarFacturaEmpresa
			};

			$scope.autorizacion = {
				new : newAutorizacioInternacion,
				view : viewAutorizacioInternacion,
				edit : editAutorizacionInternacion,
				print : printAutorizacionInternacion
			};

			$scope.internacion = {
				nuevoMovimiento: nuevoMovimientoCama,
				vueltaAtrasMovimiento: vueltaAtrasMovimiento,
				reimprimirRP: printRP,
				selectPrint : selectPrint,
				// reimprimirFichaInternacion : printFichaInternacion,
				prorroga : prorrogarInternacion,
				crear : crearInternacion,
				guardar : updateInternacion,
				darDeAlta: darDeAltaInternacion
 			};

 			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

 			/* FORMULARIO */

			function volver () {
				var stateReturn = AdmisionDataService.pathReturn || 'internado.list';
				$state.go(stateReturn);
			}

			function reloadPage () {
				$state.reload();
			}

			function validarForm () {
				return true;
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

			// function llenarEmpresa () {
			// 	if ($scope.data.internacion.EmpresaFactura != null) {
			// 		$scope.formData.numeroCuitEmpresa = $scope.data.internacion.EmpresaFactura.cuit;
			// 	}
			// }

			function openModalEmpresa () {

			}

			/* GARANTE */

			// function llenarGarante () {
			// 	if ($scope.data.internacion.PersonaGarante != null) {
			// 		$scope.formData.tipoDocumentoGarante.id_tipo_documento = 
			// 			$scope.data.internacion.PersonaGarante.TipoDocumento.id_tipo_documento;
			// 		$scope.formData.numeroDocumentoGarante = $scope.data.internacion.PersonaGarante.numero_documento;
			// 		$scope.formControl.existeGarante = true;
			// 	}
			// }

			function openModalGarante () {

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

			// }

			/* INTERNACION */

			function crearInternacion () {

			}

			function updateInternacion () {

			}

			function darDeAltaInternacion () {

			}

			function nuevoMovimientoCama () {

			}

			// function getNumeroCamaByIndexMovimiento (pIndex) {
			// }

			function vueltaAtrasMovimiento () {

			}

			function printRP () {
				PreadmisionDataService.idSolicitud = $scope.data.internacion.id_internacion;
				var _type = {
					Nombre: 'PrintRP'
				};
				PreadmisionLogicService.print(User, _type);
			}

			function selectPrint () {
				AdmisionLogicService.selectPrint(User)
				.then(function (pPrintSelected) {
					AdmisionLogicService.print(pPrintSelected, User, $scope.data.internacion.id_internacion);
				});
			}

			function cargarPorcentajes () {
			}

			function prorrogarInternacion () {
				
			}

			/* AUTORIZACION*/
			function newAutorizacioInternacion () {
			}

			function viewAutorizacioInternacion (pId) {
				AdmisionDataService.pathReturn = $location.path();
				AdmisionDataService.idIntervencion = pId;
				$location.url('/Internado/Autorizacion/View');
			}

			function editAutorizacionInternacion () {
				// AdmisionDataService.pathReturn = $location.path();
				// AdmisionDataService.idIntervencion = pId;
				// $location.url('/Internado/Autorizacion/Edit');
			}

			function printAutorizacionInternacion (pIntervencion) {
				AutorizacionInternadoLogicService
					.printAll(pIntervencion.id_internacion, pIntervencion.id_intervencion_admision, User);
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			/* Método inicializador */
			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-');
				$scope.formControl.loading = true;


				if ($stateParams.idInternacion) {
					$scope.formControl.loading = false;

					$scope.tabs = InternadoAuthService.getTabs(71, User);
					$log.debug('tabs: ', $scope.tabs);

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