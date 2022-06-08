/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('CamaListSelectorController', CamaListSelectorController);

		// Inyeccion de dependencia
		CamaListSelectorController.$inject = ['$scope', '$filter', 'Logger', '$q', '$uibModalInstance',
			'CamaDataService',
			'User', 'Internado', 'Title', 'Module'];
		
		// Constructor del Controller
		function CamaListSelectorController ($scope, $filter, $log, $q, $uibModalInstance,
			CamaDataService,
			User, Internado, Title, Module) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CamaListSelectorController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;

			vm.title = {
				module : Module,
				page : Title
			};
			vm.sucursal = Internado.Sucursal.descripcion;

			$scope.data = {
				camas: [],
				categoriasHabitacion : [],
				tiposHabitacionFisica : []
			};

			$scope.formData = {
				camaSeleccionada: ''
			};

			$scope.formControl = {
				loading: false,
				getTiposFisicaByCategoria : getTiposFisicaByCategoria,
				validarOk: validarOk,
				cancel : cancel,
				ok: ok,
				seleccionar : seleccionarCama
			};

			$scope.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged : getPage,
				getPage: getPage
			};

			$scope.filter = {
				camas: [],
				categoriaHabitacion:  '',
				tipoHabitacionFisica: '',
				numeroHabitacion: '',
				clean : cleanFilters,
				validar : validarFilters
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function validarOk () {
				var _flag = false;


				if ($scope.filter.categoriaHabitacion && $scope.filter.categoriaHabitacion.nombre_categoria == 'Sin Habitación') {
					$scope.formData.camaSeleccionada = null;
					_flag = true;
				} else if ($scope.formData.camaSeleccionada != null) {
					if ($scope.formData.camaSeleccionada != '') {
						_flag = true;
					}
				} 

				return _flag;
			}

			function ok (pCama) {
				var cama = pCama  || $scope.formData.camaSeleccionada;
				$uibModalInstance.close(cama);
			}

			function seleccionarCama (pCama) {
				$scope.formData.camaSeleccionada = pCama;
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
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

			/* PAGINACIÓN */

			function cleanFilters () {
				$scope.filter.categoriaHabitacion = '';
				$scope.filter.tipoHabitacionFisica = '';
				$scope.filter.numeroHabitacion = '';
				$scope.paginacion.pageChanged();
			}

			function validarFilters () {
				if ($scope.filter.categoriaHabitacion == null) {
					$scope.filter.categoriaHabitacion = '';
				}
				if ($scope.filter.tipoHabitacionFisica == null) {
					$scope.filter.tipoHabitacionFisica = '';
				}
				if ($scope.filter.numeroHabitacion == null) {
					$scope.filter.numeroHabitacion = '';
				}
			}

			function getPage () {
				var begin = (($scope.paginacion.currentPage - 1) * $scope.paginacion.pageSize);
				var end = begin + $scope.paginacion.pageSize;
				$scope.filter.validar();
				$scope.filter.camas = $filter('filter')
				($scope.data.camas,{
					numero_habitacion: $scope.filter.numeroHabitacion,
					nombre_tipo_habitacion_fisica: $scope.filter.tipoHabitacionFisica.nombre_tipo_habitacion
				});
				$scope.paginacion.totalItems = $scope.filter.camas.length;
				$scope.filter.camas = $scope.filter.camas.slice(begin, end);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$scope.formControl.loading = true;
				$log.debug('Inicializar ON.-');

				var _categorias = CamaDataService.getAllCategoriasHabitacion();
				var _camas = CamaDataService.getAllCamasDisponiblesBySucursalLazy(Internado.Sucursal);

				$q.all([_categorias, _camas])
				.then(activateOk, activateError);
				
				function activateOk (pResults) {
					$scope.data.categoriasHabitacion = pResults[0];
					$scope.data.camas = pResults[1];

					$scope.paginacion.currentPage = 1;
					$scope.paginacion.pageSize = 5;
					$scope.paginacion.getPage();
					$scope.formControl.loading = false;
					$log.debug('Inicializar OK.-', pResults);
				}

				function activateError (pError) {
					$scope.formControl.loading = false;
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}

		}
	};

	return module;

})();