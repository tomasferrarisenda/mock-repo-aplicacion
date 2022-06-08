/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoListPartosController', InternadoListPartosController);

		// Inyeccion de dependencia
		InternadoListPartosController.$inject = [
			'Logger', '$q', '$filter', 'orderByFilter', '$state',
			'INTERNADO_ORDER_BY_LAZY',
			'ModalService', 'AdmisionDataService', 'AdmisionLogicService', 'PacienteLogicService', 'InternacionCommonDataService',
			'User'
		];
		
		// Constructor del Controller
		function InternadoListPartosController (
			$log, $q, $filter, orderByFilter, $state,
			INTERNADO_ORDER_BY,
			ModalService, AdmisionDataService, AdmisionLogicService, PacienteLogicService, InternacionCommonDataService,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoListPartosController');
			$log.debug('ON.-');

			/* ------------------------------------------- API Y VARIABLES ------------------------------------------- */
				
			// En this va lo que se modifica de la vista (VM: ViewModel)
			var vm = this;

			vm.title = {
				icon: $state.current.data.icon,
				page: $state.current.data.title
			};
			vm.order = {};
			vm.listOrderBy = INTERNADO_ORDER_BY;

			vm.data = {
				internaciones : [],
				tiposInternacion : []
			};

			vm.filter = {
				internaciones : [], // Lista filtrada para paginacion
				nombreCompletoPaciente : '',
				numeroDocumento : '',
				tipoDocumento : '',
				sucursal : '',
				nombreMutual : '',
				tipoInternacion : '',
				numeroInternado : '',
				clean : cleanFilters,
				validar : validarFilters
			};

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate
			};

			vm.paginacion = {
				currentPage: 0,
					pageSize: 0,
					totalItems: 0,
					pageChanged : getPage,
					getPage: getPage
			};

			vm.nacimiento = {
				byInternacion : validarSexoFemenino,
				byNumeroInternado : nuevoNacimientoByNumeroInternado
			};

 			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */


			/* PAGINACIÓN */

			function cleanFilters () {
				vm.filter.nombreCompletoPaciente = '';
				vm.filter.numeroDocumento = '';
				vm.filter.nombreMutual = '';
				vm.filter.tipoDocumento = '';
				if (vm.mostrarSucursal) vm.filter.sucursal = '';
				vm.filter.tipoInternacion = '';
				vm.filter.numeroInternado = '';
				vm.order = {};
				getPage();
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

				if (vm.filter.nombreMutual == null)
					vm.filter.nombreMutual = '';
				if (vm.filter.tipoInternacion == null)
					vm.filter.tipoInternacion = '';
				if (vm.filter.numeroInternado == null)
					vm.filter.numeroInternado = '';

				if (vm.order == null) {
					vm.order = {
						id : 5,
						value : 'CamaActual.Habitacion.numero_habitacion',
						descripcion : 'Habitación (Asc)',
						reverse : false
					};
				}
			}

			function getPage () {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.internaciones = orderByFilter(vm.data.internaciones, vm.order.value, vm.order.reverse);
				vm.filter.internaciones = $filter('filter')
					(vm.data.internaciones,{
						nombre_paciente : vm.filter.nombreCompletoPaciente,
						numero_documento: vm.filter.numeroDocumento,
						nombre_mutual: vm.filter.nombreMutual,
						nombre_tipo_documento: vm.filter.tipoDocumento.nombre_tipo_documento,
						id_sucursal : vm.filter.sucursal.Id,
						id_tipo_internacion : vm.filter.tipoInternacion.id_tipo_internacion,
						numero_internado : vm.filter.numeroInternado
					});
				vm.paginacion.totalItems = vm.filter.internaciones.length;
				$log.debug('GetPage OK.-', vm.filter.internaciones);
				vm.filter.internaciones = vm.filter.internaciones.slice(begin, end);
			}

			/* INTERNACION */ 

			function getDatosPacienteString(pInternacion) {
				var nombre = pInternacion.nombre_paciente || pInternacion.Paciente.nombre_completo;
				var numeroInternado = pInternacion.numero_internado;

				return nombre + '. N° Internado: ' + numeroInternado;
			}

			function nuevoNacimiento (pInternacion) {
				var _object, _llamadas;

				_llamadas = [];

				var datosPaciente = getDatosPacienteString(pInternacion);

				PacienteLogicService.newNacimiento(datosPaciente)
				.then(function (pPacientes) {
					$log.debug('Nuevo Naciemitento: ', pPacientes);

					for (var i = 0; i < pPacientes.length; i++) {
						_object = AdmisionLogicService
							.newPacienteFromInternacion(pPacientes[i], pInternacion.id_internacion, User);
						_llamadas[i] = AdmisionDataService.newNacimiento(_object);
					}

					$q.all(_llamadas)
					.then(function (pResults) {
						var _texto = "";
						for (var i = 0; i < pResults.length; i++) {
							$log.debug('NewNacimiento OK.-', pResults[i]);
							_texto += "Paciente " + 
								pResults[i].Paciente.TipoDocumento.nombre_tipo_documento + ":" + 
								pResults[i].Paciente.numero_documento + " " +
								pResults[i].Paciente.nombre_completo + " creado e internado con N° " +
								pResults[i].numero_internado;
							AdmisionLogicService.printPulsera(pResults[i].id_internacion);
						}
						ModalService.success(_texto);
						activate();
						$log.debug('NewNacimiento OK.-', pResults);
					});

				});
			}

			function validarSexoFemenino (pInternacion) {
				$log.debug('internacion para nacimient',pInternacion);
				var sexo = pInternacion.id_sexo || pInternacion.Paciente.id_tipo_sexo;
				if (sexo != 5) {
					ModalService.confirm('El internado no es de sexo femenino. ¿Desea continuar?', 
						function (pResult) {
							if (pResult) {
								nuevoNacimiento(pInternacion);
							} 
						});
				} else {
					nuevoNacimiento(pInternacion);
				}
				// ModalService.warn('El internado no es de sexo femenino. ¿Desea continuar?');
			}

			function nuevoNacimientoByNumeroInternado () {
				ModalService.prompt('Ingrese el número de internado', '',
					function (pNumeroInternado) {
						if (pNumeroInternado) {
							AdmisionDataService.getOneInternacionAdmitidoByNumero(pNumeroInternado)
							.then(validarSexoFemenino);
						}
					});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				vm.formControl.loading = true;
				
				$log.debug('Inicializar ON.-');

				var _internados = AdmisionDataService.getAllPartosLazy();
				var _tiposInternacion = InternacionCommonDataService.getAllTiposInternacion();

				$q.all([_internados, _tiposInternacion])
				.then(activateOk, activateError);

				function activateOk (results) {
					vm.data.internaciones = results[0];
					vm.data.tiposInternacion = results[1];
					vm.data.sucursales = User.sucursales;

					cleanFilters();

					vm.formControl.error = false;
					vm.formControl.loading = false;
					vm.paginacion.currentPage = 1;
 					vm.paginacion.pageSize = 10;
					getPage();
					$log.debug('Inicializar OK');
				}

				function activateError (pError) {
					vm.formControl.loading = false;
					$log.error('Inicializar ERROR.-', pError);
				}
			}
		}

	};

	return module;

})();