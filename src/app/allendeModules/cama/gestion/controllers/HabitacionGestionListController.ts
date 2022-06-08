import { ISucursalDataService } from '../../../support/basic/services';

/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('HabitacionGestionListController', HabitacionGestionListController);

		// Inyeccion de dependencia
		HabitacionGestionListController.$inject = ['$scope', '$filter','orderByFilter', 'Logger', '$q','$state',
			'CamaGestionDataService','HabitacionGestionDataService','HabitacionGestionLogicService',
			 'ModalService', 'HABITACION_ORDER', 'SucursalDataService',
			 'User'];
		
		// Constructor del Controller
		function HabitacionGestionListController ($scope, $filter,orderByFilter, $log, $q, $state,
			CamaGestionDataService,HabitacionGestionDataService,HabitacionGestionLogicService, 
			ModalService, HABITACION_ORDER, SucursalDataService: ISucursalDataService,
			User) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('HabitacionGestionListController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;

			vm.title = {
				name : $state.current.data.title,
				icon : $state.current.data.icon
			};
			// vm.sucursal = User.Sucursal;
			vm.order = {};
			vm.listOrderBy = HABITACION_ORDER;

			$scope.data = {
				habitaciones: [],
				camas: [],
				categoriasHabitacion : [],
				tiposHabitacionFisica : []
			};

			$scope.formData = {
				camaSeleccionada: ''
			};

			$scope.formControl = {
				esAll : false,
				loading: false,
				stateLoading : false,
				reloadPage : activate,
				getTiposFisicaByCategoria : getTiposFisicaByCategoria,
				validarOk: validarOk
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged : getPage,
				getPage: getPage
			};

			$scope.filter = {
				camas: [],
				habitaciones: [],
				categoriaHabitacion:  '',
				tipoHabitacionFisica: '',
				numeroHabitacion: '',
				clean : cleanFilters,
				validar : validarFilters
			};

			vm.habitacion = {
				new: newHabitacion,
				view : verHabitacion,
				addCama : addCama,
				edit : editHabitacion,
				delete : deleteHabitacion
			};

			vm.filter = {
				camas : '',
				habitaciones: [],
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

			function validarOk () {
				var _flag = false;


				if ($scope.filter.categoriaHabitacion && 
						$scope.filter.categoriaHabitacion.nombre_categoria == 'Sin Habitación') {
					
					$scope.formData.camaSeleccionada = null;
					_flag = true;
				} else if ($scope.formData.camaSeleccionada != null) {
					if ($scope.formData.camaSeleccionada != '') {
						_flag = true;
					}
				} 

				return _flag;
			}

			// function ok () {
			// 	$uibModalInstance.close($scope.formData.camaSeleccionada);
			// }

			// function cancel () {
			// 	$uibModalInstance.dismiss('cancel');
			// }

			function getTiposFisicaByCategoria (pCategoria) {
				if (pCategoria) {
					CamaGestionDataService.getAllTiposHabitacionFisicaByCategoria(pCategoria)
					.then(successCallback, errorCallback);					
				} else {
					$scope.data.tiposHabitacionFisica = [];
					$log.debug('No viene la categoria');
				}

				function successCallback (pTipos) {
					$scope.data.tiposHabitacionFisica = pTipos;
					if (pTipos.length == 1) {
						$scope.filter.tipoHabitacionFisica = $scope.data.tiposHabitacionFisica[0];
					} else {
						$scope.filter.tipoHabitacionFisica = '';
					}
					getPage();
					$log.debug('GetTiposFisicaByCategoria OK.-');
				}

				function errorCallback () {
					
				}
			}

			function verHabitacion (pHabitacion) {

				var _id = pHabitacion.Id;

				HabitacionGestionLogicService.openCamas(_id,User);
			}

			function newHabitacion () {
				HabitacionGestionLogicService.newHabitacion(User)
				.then(newHabitacionOk, newHabitacionError);

				function newHabitacionOk () {
					activate();				
				}
				function newHabitacionError (pError) {
				
					$log.error('newHabitacion OK.-', pError);

				}
			}

			function addCama (pHabitacion) {

				var _id = pHabitacion.Id;
				HabitacionGestionLogicService.addCama(_id,User);

			}

			function editHabitacion (pHabitacion) {

				var _id = pHabitacion.Id;
				HabitacionGestionLogicService.editHabitacion(_id,User)
				.then(editHabitacionOk, editHabitacionError);

				function editHabitacionOk () {
					activate();				
				}
				function editHabitacionError (pError) {
				
					$log.error('newHabitacion OK.-', pError);
				}
			}

			function deleteHabitacion (pHabitacion) {

				$log.debug('deleteHabitacion OK.-', pHabitacion);

				var _id = pHabitacion.Id;
				ModalService.confirm('¿Desea eliminar la Habitacion ' + pHabitacion.Numero +'?',
				function (pResult) {
					if (pResult) {
						$scope.formControl.loading = true;

						HabitacionGestionDataService.deleteHabitacion(pHabitacion)
						.then(function () {
							ModalService.success("Habitacion Borrada");
							activate();
						},function (pError) {
							$scope.formControl.loading = false;
							ModalService.error("Error de servidor");
							$log.error('deleteHabitacion .-', pError);
						});
					}
				});	
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

				vm.order = {
					id : 1,
					value : 'Numero',
					descripcion : 'Habitación (Asc)',
					reverse : false
				};
			}


			function getPage () {


				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				$scope.data.habitaciones = orderByFilter($scope.data.habitaciones, vm.order.value, vm.order.reverse);

				vm.filter.habitaciones = $filter('filter')
				($scope.data.habitaciones,{
					Numero: vm.filter.numeroHabitacion,
					NombreTipoHabitacionFisica : vm.filter.tipoHabitacionFisica.nombre_tipo_habitacion,
				    //NombreSucursal : vm.filter.sucursal
					// EstadoCama : {
					// 	nombre_estado_cama : vm.filter.estadoCama.nombre_estado_cama
					 //}
				});

				vm.paginacion.totalItems = vm.filter.habitaciones.length;
				vm.filter.habitaciones = vm.filter.habitaciones.slice(begin, end);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-', User);

				$scope.formControl.loading = true;
				$scope.formControl.stateLoading = true;

				var _categorias = CamaGestionDataService.getAllCategoriasHabitacion();
				var _sucursales = SucursalDataService.getAllSucursalesSinTodas();
				var _habitaciones = HabitacionGestionDataService.getAll();

				$q.all([_categorias,_habitaciones,_sucursales])
				.then(activateOk, activateError);
				
				function activateOk (pResults) {
					$scope.data.categoriasHabitacion = pResults[0];
					$scope.data.habitaciones = pResults[1];
					$scope.data.sucursales = pResults[2];
					//$scope.data.habitaciones = pResults[2];

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 5;
					vm.paginacion.getPage();
					$scope.formControl.loading = false;
					$scope.formControl.stateLoading = false;

					$log.debug('Inicializar OK.-', pResults);
				}

				function activateError (pError) {
					$scope.formControl.loading = false;
					$scope.formControl.stateLoading = false;

					//$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}
		}
	};

	return module;

})();