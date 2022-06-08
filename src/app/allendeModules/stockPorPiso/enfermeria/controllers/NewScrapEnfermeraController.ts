import { IMovimientoStockDataService, IUbicacionScrapDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('NewScrapEnfermeraController', NewScrapEnfermeraController);

		NewScrapEnfermeraController.$inject = ['$scope', '$log', '$uibModalInstance',
			'MovimientoStockDataService', 'UbicacionScrapDataService',
			'StockEnfermeriaLogicService', 'AlertaService'];

		function NewScrapEnfermeraController($scope, $log, $uibModalInstance,
			MovimientoStockDataService: IMovimientoStockDataService, UbicacionScrapDataService: IUbicacionScrapDataService,
			StockEnfermeriaLogicService, AlertaService: IAlertaService) {

			$log.debug('NewScrapEnfermeraController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {
				observacion: '',
				searchEnfermera: '',
				subseccion: ''
			};

			$scope.data = {
				movimientosDetalle: [],
				detallesScrap: [],
				movimiento: '',
				movimientosDetalleFiltrado: [],
				usuario: ''

			};

			$scope.formControl = {
				error: true,
				loadingModal: false,
				observacionCargada: false,

				validarObservacion: validarObservacion,
				reloadPage: activate,
				ok: newScrap,
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {
				$scope.data.detallesScrap = StockEnfermeriaLogicService.ubicacionesDetalle;
				$scope.data.movimiento = StockEnfermeriaLogicService.movimiento;
				$scope.data.ubicacion = StockEnfermeriaLogicService.ubicacion;
				var j = 0;
				for (var i = 0; i < $scope.data.detallesScrap.length; i++) {
					$scope.data.detallesScrap[i].nombre = $scope.data.detallesScrap[i].Producto.nombre;
				}


			}

			function newScrap() {

				if ($scope.formData.observacion != '') {
					var ubicacionScrap: any = {};
					ubicacionScrap.observacion = $scope.formData.observacion;
					$scope.data.movimiento.observaciones = $scope.formData.observacion;
					UbicacionScrapDataService.newUbicacionScrapEnfermera(ubicacionScrap)
						.then(function (pUbicacion) {
							$scope.data.movimiento.id_ubicacion_hasta = pUbicacion.id_ubicacion;
							MovimientoStockDataService.addMovimiento($scope.data.movimiento)
								.then(function () {
									$uibModalInstance.close();
									AlertaService.NewSuccess('Movimiento de Scrap Cargado');
								}, function () {
									$scope.formControl.loading = false;
								});
						}, function () {
							$scope.formControl.loading = false;
						});
				}
			}


			function validarObservacion() {
				if ($scope.formData.observacion != '') {
					$scope.formControl.observacionCargada = true;
				}
				else {
					$scope.formControl.observacionCargada = false;
				}
			}


			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('NewScrapEnfermeraController: Inicializar ON.-');
				inicializarVariables();


			}


		}
	};

	return module;
})();