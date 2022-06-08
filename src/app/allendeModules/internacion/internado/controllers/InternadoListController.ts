/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoListController', InternadoListController);

		// Inyeccion de dependencia
		InternadoListController.$inject = [
			'Logger', '$q', '$filter', '$state', 'orderByFilter',
			'INTERNADO_ORDER_BY_LAZY',
			'ModalService', 'AlertaService', 'AdmisionDataService', 'AdmisionLogicService', 'CamaDataService', 'InternadoAuthService',
			'User'
			];
		
		// Constructor del Controller
		function InternadoListController (
			$log, $q, $filter, $state, orderByFilter,
			INTERNADO_ORDER_BY,
			ModalService, AlertaService, AdmisionDataService, AdmisionLogicService, CamaDataService, InternadoAuthService,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoListController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
				
			// En this va lo que se modifica de la vista (VM: ViewModel)
			var vm = this;

			vm.alertasDe = [];
			vm.title = {
				page: $state.current.data.title
			};
			
			vm.order = {
				value:'',
				reverse: false
			};
			vm.listOrderBy = INTERNADO_ORDER_BY;

			vm.data = {
				internaciones: [],
				tiposHabitacionFisica : []
			};

			vm.filter = {
				internacionesAll : [],
				internaciones : [], // Lista filtrada para paginacion
				nombreCompletoPaciente : '',
				numeroDocumento : '',
				tipoDocumento : '',
				tipoHabitacionFisica : '',
				sucursal : '',
				nombreMutual : '',
				codigoMutual : '',
				numeroInternado: '',
				altaPendiente : '',
				altaAdministrativaPendiente: '',
				altaEnfermeriaPendiente: '',
				altaMedicaPendiente : '',
				cargoAfiliado : '',
				diasInternado : 0,
				valorUpaMinimo: '',
				tieneCama: '',
				clean : cleanFilters,
				validar : validarFilters
			};

			vm.internado = {
				edit : editInternado,
				print : printOne,
				anular : anularInternacion,
				revert : revertirInternacion,
				puedeAnular : validarPuedeAnular,
				puedeEditar : validarPuedeEditar,
				puedeImprimir : validarPuedeImprimir,
				puedeRevertir : validarPuedeRevertir
			};

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate,
				printAll : printAllInternados
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged : getPage,
				getPage: getPage
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* PAGINACIÓN */

			function cleanFilters () {
				vm.filter.nombreCompletoPaciente = '';
				vm.filter.numeroDocumento = '';
				vm.filter.nombreMutual = '';
				vm.filter.codigoMutual = '';
				vm.filter.numeroInternado = '';
				vm.filter.tipoDocumento = '';
				vm.filter.tipoHabitacionFisica = '';
				if (vm.mostrarSucursal) vm.filter.sucursal = '';
				vm.filter.altaPendiente = '';
				vm.filter.altaAdministrativaPendiente = '';
				vm.filter.altaEnfermeriaPendiente = '';
				vm.filter.altaMedicaPendiente = '';
				vm.filter.cargoAfiliado = '';
				vm.filter.diasInternado = 0;
				vm.filter.valorUpaMinimo = '';
				vm.filter.tieneCama = 'true';
				vm.order = {};
				getPage();
				// vm.alertasDe = [
				// 		{
				// 			IdEntidades: [275526], 
				// 			IdTipoEntidad: 1 , 
				// 			TiposAlerta:[2],
				// 			TiposOrigen:[]
				// 		}
				// 	];
			}

			function validarFilters () {
				if (vm.filter.nombreCompletoPaciente == null)
					vm.filter.nombreCompletoPaciente = '';
				if (vm.filter.numeroDocumento == null)
					vm.filter.numeroDocumento = '';
				if (vm.filter.tipoDocumento == null)
					vm.filter.tipoDocumento = '';

				if (User.sucursales.length == 1) {
					vm.filter.sucursal = User.sucursales[0];
					vm.mostrarSucursal = false;
				} else if (vm.filter.sucursal == null) {
					vm.filter.sucursal = '';
					vm.mostrarSucursal = true;
				}

				if (vm.order == null) {
					vm.order = {
						id : 5,
						value : 'numero_habitacion',
						descripcion : 'Habitación (Asc)',
						reverse : false
					};
				}

				if (vm.filter.nombreMutual == null)
					vm.filter.nombreMutual = '';
				if (vm.filter.codigoMutual == null)
					vm.filter.codigoMutual = '';
				if (vm.filter.numeroInternado == null)
					vm.filter.numeroInternado = '';
				if (vm.filter.altaPendiente == null)
					vm.filter.altaPendiente = '';
				if (vm.filter.altaAdministrativaPendiente == null)
					vm.filter.altaAdministrativaPendiente = '';
				if (vm.filter.altaEnfermeriaPendiente == null)
					vm.filter.altaEnfermeriaPendiente = '';
				if (vm.filter.altaMedicaPendiente == null)
					vm.filter.altaMedicaPendiente = '';
				if (vm.filter.tipoHabitacionFisica == null)
					vm.filter.tipoHabitacionFisica = '';

				if (vm.filter.cargoAfiliado == null)
					vm.filter.cargoAfiliado = '';

				if (vm.filter.diasInternado == null)
					vm.filter.diasInternado = 0;

				if (vm.filter.valorUpaMinimo == null)
					vm.filter.valorUpaMinimo = '';

				if (vm.filter.tieneCama == null)
					vm.filter.tieneCama = '';
			}

			function getPage () {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.internaciones = orderByFilter(vm.data.internaciones, vm.order.value, vm.order.reverse);

				vm.filter.internacionesAll = $filter('filter')
					(vm.data.internaciones,{
						numero_internado : vm.filter.numeroInternado,
						nombre_paciente : vm.filter.nombreCompletoPaciente,
						codigo_mutual : vm.filter.codigoMutual,
						nombre_mutual : vm.filter.nombreMutual,
						id_sucursal : vm.filter.sucursal.Id,
						nombre_tipo_habitacion_fisica : vm.filter.tipoHabitacionFisica.nombre_tipo_habitacion,
						AltaAdministrativaPendiente : getAltaPendienteByTipo('administrativa'),
						AltaEnfermeriaPendiente : getAltaPendienteByTipo('enfermeria'),
						AltaMedicaPendiente : getAltaPendienteByTipo('medica'),
						diferencia_habitacion : vm.filter.cargoAfiliado
						// AltaAdministrativaPendiente : vm.filter.altaAdministrativaPendiente,
						// AltaEnfermeriaPendiente : vm.filter.altaEnfermeriaPendiente,
						// AltaMedicaPendiente : vm.filter.altaMedicaPendiente
					});
				
				// Cantidad todal de días
				vm.filter.internacionesAll = $filter('filter')(vm.filter.internacionesAll, function (value) {
					if (value.CantidadTotalDiasReales >= vm.filter.diasInternado) return true;
					return false;
				});

				// UPA
				if (vm.filter.valorUpaMinimo !== '' && vm.filter.valorUpaMinimo !== 'false') {
					vm.filter.internacionesAll = $filter('filter')(vm.filter.internacionesAll, function (value) {
						if (value.TieneValorUpa && value.ValorUpa >= vm.filter.valorUpaMinimo) return true;
						return false;
					});
				} else if(vm.filter.valorUpaMinimo === 'false') {
					vm.filter.internacionesAll = $filter('filter')(vm.filter.internacionesAll, function (value) {
						if (!value.TieneValorUpa) return true;
						return false;
					});
				}
				
				// TIENE O NO TIENE CAMA
				if (vm.filter.tieneCama !== '') {
					
					if (vm.filter.tieneCama === 'true') {
						vm.filter.internacionesAll = $filter('filter')(vm.filter.internacionesAll, value => {
							if (value.numero_habitacion) return true;
							return false;
						});
					}

					if (vm.filter.tieneCama === 'false') {
						vm.filter.internacionesAll = $filter('filter')(vm.filter.internacionesAll, value => {
							if (value.numero_habitacion) return false;
							return true;
						});
					}
				}
				vm.paginacion.totalItems = vm.filter.internacionesAll.length;
				vm.filter.internaciones = vm.filter.internacionesAll.slice(begin, end);
				$log.debug('GetPage OK.-', vm.filter.internaciones);
			}

			function getAltaPendienteByTipo(pTipoAlta) {
				if (!pTipoAlta) return '';
				if (vm.filter.altaPendiente === pTipoAlta) return true;
				return '';
			}

			function validarMutualValida (pInternaciones) {
				for (var i = 0; i < pInternaciones.length; i++) {
					if (!pInternaciones[i].nombre_mutual) {
						pInternaciones[i].nombre_mutual = 'NO VÁLIDA';
					}
					if (!pInternaciones[i].codigo_mutual) {
						pInternaciones[i].codigo_mutual = 0;
					}
				}
			}

			/* INTERNACION */ 

			function validarPuedeEditar () {
				return InternadoAuthService.puedeEditar(User);
			}

			function validarPuedeImprimir() {
				return InternadoAuthService.puedeImprimir(User);
			}

			function validarPuedeAnular() {
				return InternadoAuthService.puedeAnular(User);
			}

			function validarPuedeRevertir() {
				return InternadoAuthService.puedeRevertir(User);
			}

			function printAllInternados () {
				switch ($state.current.name) {
					case 'internado.list.all.censo':
						AdmisionLogicService.printCenso(User, vm.order, vm.filter.internacionesAll);
						break;
					case 'internado.list.all.camas':
						AdmisionLogicService.printGestionCamas(User, vm.order, vm.filter.internacionesAll);
						break;
					case 'internado.list.all.prorrogas':
						AdmisionLogicService.printProrrogas(User, vm.order, vm.filter.internacionesAll);
						break;
				}
			}

			function editInternado (pIdInternacion) {
				AdmisionDataService.pathReturn = 'internado.list';
				$state.go('internado.editSelector',{idInternacion:pIdInternacion});
			}

			function printOne (pIdSolicitud) {
				InternadoAuthService.selectPrint(User)
				.then(function (pPrintSelected) {
					AdmisionLogicService.print(pPrintSelected, User, pIdSolicitud)
					.then(function () {}, printOneError);
				}, printOneError);
				// vm.alertasDe[0].IdEntidades[0]= 410915;
				
				function printOneError(pError) {
					if (pError.message)
						$log.error(pError.message,pError);
				}
			}

			function anularInternacion(pIdInternacion, pNumeroInternado) {

				ModalService.prompt('Ingrese el motivo de anulación para la internación ' + pNumeroInternado, '',
					function (pMotivo) {

						if (pMotivo) {
							AdmisionDataService.anularInternacion(pIdInternacion, pMotivo)
							.then(anularInternacionOk, anularInternacionError);
						}
					});


				function anularInternacionOk(pResult) {
					AlertaService.NewSuccess('Anulación correcta. N° internado: ', pNumeroInternado);
					activate();
				}

				function anularInternacionError(pError) {
					if (pError.message) $log.error(pError.message,pError);
				}
			}

			function revertirInternacion(pIdInternacion, pNumeroInternado) {
				ModalService.confirm('¿Desea volver la internación ' + pNumeroInternado + 'al punto anterior (preadmisión)?', 
					function (pResult) {
						if (pResult) {	
							AdmisionDataService.revertirInternacion(pIdInternacion)
							.then(revertirInternacionOk, revertirInternacionError);
						}
					});

				function revertirInternacionOk(pResult) {
					AlertaService.NewSuccess('Se volvió a preadmisión en forma correcta. N° solicitud: ', pIdInternacion);
					activate();
				}

				function revertirInternacionError(pError) {
					if (pError.message) $log.error(pError.message,pError);
				}
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				AdmisionDataService.idInternacion = 0;
				
				$log.debug('Inicializar ON.-');

				var _tiposHabitacionFisica = CamaDataService.getAllTiposHabitacionFisica();
				var _internados = AdmisionDataService.getAllAdmitidasForProrrogaLazyHabiliatadasParaUsuario();

				// if (User.sucursales.length == 1) {
				// 	vm.mostrarSucursal = false;
				// } else {
				// 	vm.mostrarSucursal = true;
				// }

				$q.all([_tiposHabitacionFisica, _internados])
				.then(activateOk, activateError);
			}

			function activateOk (results) {
				vm.data.tiposHabitacionFisica = results[0];
				vm.data.internaciones = results[1];
				vm.data.sucursales = User.sucursales;
				validarMutualValida(vm.data.internaciones);
				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 10;
				vm.paginacion.getPage();
				cleanFilters();
				// AlertaService.GetAlertasDePaciente(275526);
				$log.debug('Inicializar OK', results);
			}

			function activateError (pError) {
				vm.formControl.loading = false;
				$log.error('Inicializar ERROR.-', pError);
			}
		}

	};

	return module;

})();