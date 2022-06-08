/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('CamaStateListController', CamaStateListController);

		// Inyeccion de dependencia
		CamaStateListController.$inject = [
			'$scope', '$filter', 'Logger', '$state',
			'CamaDataService', 'AdmisionDataService', 
			'CamaLogicService', 'AdmisionLogicService',
			// Inject by state
			'EstadosCama', 'CategoriasHabitacion',
			'User'
		];
		
		// Constructor del Controller
		function CamaStateListController (
			$scope, $filter, $log, $state,
			CamaDataService, AdmisionDataService, 
			CamaLogicService, AdmisionLogicService,
			// Inject by state
			EstadosCama, CategoriasHabitacion,
			User) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CamaStateListController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			var vm = this;

			vm.title = {
				module: $state.current.data.icon,
				page: $state.current.data.title,
				sucursal: ''
			};

			$scope.data = {
				camas : [],
				sucursales : [],
				estadosCama : [],
				estadosPosibles : [],
				tiposHabitacionFisica : [],
				categoriasHabitacion : []
			};

			$scope.formData = {
				camaSeleccionada : '',
				observacionesEstado : ''
			};

			$scope.formControl = {
				esAll : $state.current.data.all,
				loading : false,
				stateLoading : false,
				getTiposFisicaByCategoria : getTiposFisicaByCategoria,
				reloadPage : activate,
				// ok: ok,
				selectState : selectState,
				changeState : changeState
			};

			vm.paginacion = {
				currentPage : 0,
				pageSize : 0,
				totalItems : 0,
				pageChanged : getPage,
				getPage : getPage
			};

			vm.filter = {
				camas : [],
				sucursal : '',
				estadoCama : '',
				numeroHabitacion : '',
				tipoHabitacionFisica : '',
				categoriaHabitacion : '',
				clean : cleanFilters,
				validar : validarFilters
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function selectState (pCama) {
				$scope.formControl.stateLoading = true;
				$scope.formData.observacionesEstado = pCama.observaciones;
				$scope.formData.camaSeleccionada = pCama;
				var _estado = pCama.EstadoCama;

				if (_estado.nombre_estado_cama == 'OCUPADA' || _estado.nombre_estado_cama == 'DISPONIBILIDAD PENDIENTE') {
					AdmisionDataService.getOneInternacionByCamaActual(pCama)
					.then(function (pInternacion) {
						AdmisionLogicService.showInModal(pInternacion.id_internacion, User)
						.then(doNothing,errorCallback);
					}, errorCallback);
				} else {
					CamaDataService.getAllEstadosCamaSiguientes(_estado)
					.then(function (pEstados) {
						$scope.data.estadosPosibles = pEstados;
						CamaLogicService.openStates($scope)
						.then(changeState, errorCallback);
					}, errorCallback);
				}
			}

			function doNothing () {
				$scope.formControl.stateLoading = false;
			}

			function changeState (pEstado) {
				var _historial = CamaLogicService
					.newHistorial($scope.formData.camaSeleccionada, pEstado, $scope.formData.observacionesEstado);
				CamaDataService
				.addHistorialEstadoCama(_historial)
					.then(function () {
						activate();
					}, errorCallback);
			}

			function getTiposFisicaByCategoria (pCategoria) {
				if (pCategoria) {
					CamaDataService.getAllTiposHabitacionFisicaByCategoria(pCategoria)
					.then(successCallback, errorCallback);
				} else {
					$scope.data.tiposHabitacionFisica = [];
					$log.debug('No viene la categoria');
				}

				function successCallback (pTipos) {
					$scope.data.tiposHabitacionFisica = pTipos;
					if (pTipos.length == 1) {
						vm.filter.tipoHabitacionFisica = $scope.data.tiposHabitacionFisica[0];
					} else {
						vm.filter.tipoHabitacionFisica = '';
					}
					getPage();
					$log.debug('CamaListSelectorController: GetTiposFisicaByCategoria OK.-');
				}
			}

			function errorCallback (pError) {
				$scope.formControl.stateLoading = false;
			}

			/* PAGINACIÓN */

			function cleanFilters () {
				vm.filter.sucursal = '';
				vm.filter.numeroHabitacion = '';
				vm.filter.estadoCama = '';
				vm.filter.tipoHabitacionFisica = '';
				vm.filter.categoriaHabitacion = '';
				$scope.data.tiposHabitacionFisica = [];
				vm.paginacion.pageChanged();
			}

			function validarFilters () {
				if (vm.filter.sucursal == null)
					vm.filter.sucursal = '';
				if (vm.filter.numeroHabitacion == null)
					vm.filter.numeroHabitacion = '';
				if (vm.filter.estadoCama == null)
					vm.filter.estadoCama = '';
				if (vm.filter.tipoHabitacionFisica == null)
					vm.filter.tipoHabitacionFisica = '';
				if (vm.filter.categoriaHabitacion == null)
					vm.filter.categoriaHabitacion = '';
			}

			function getPage () {

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.filter.camas = $filter('filter')
				($scope.data.camas,{
					numero_habitacion: vm.filter.numeroHabitacion,
					nombre_tipo_habitacion_fisica : vm.filter.tipoHabitacionFisica.nombre_tipo_habitacion,
					id_sucursal : vm.filter.sucursal.Id,
					EstadoCama : {
						nombre_estado_cama : vm.filter.estadoCama.nombre_estado_cama
					}
				});

				vm.paginacion.totalItems = vm.filter.camas.length;
				vm.filter.camas = vm.filter.camas.slice(begin, end);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$scope.formControl.loading = true;
				$log.debug('Inicializar ON.-');

				CamaLogicService.getAllByActionAndSucursal($state.current.data.idPermiso, User.sucursales[0])
				.then(activateOk);

				function activateOk (pCamas) {
					$scope.data.sucursales = User.sucursales;
					$scope.data.estadosCama = EstadosCama;
					$scope.data.categoriasHabitacion = CategoriasHabitacion;
					$scope.data.camas = pCamas;

					if ($state.current.data.all) {
						vm.title.sucursal = ' - ' + User.sucursales[0].Nombre;
					}

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 5;
					vm.paginacion.getPage();
					$scope.formControl.loading = false;
					$scope.formControl.stateLoading = false;
				}


			}
		}
	};

	return module;

})();