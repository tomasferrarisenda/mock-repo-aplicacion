import * as angular from 'angular';
import { IMaterialDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('CambiarProductoController', CambiarProductoController);

		CambiarProductoController.$inject = ['$scope', '$log', '$uibModalInstance',
			'MaterialDataService',
			'StockFarmaciaLogicService', 'NumeroArticulo', 'Droga'];

		function CambiarProductoController($scope, $log, $uibModalInstance,
			MaterialDataService: IMaterialDataService,
			StockFarmaciaLogicService, NumeroArticulo, Droga) {

			$log.debug('CambiarProductoController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.constante = {
				numeroArticulo: NumeroArticulo,
				droga: Droga
			};

			$scope.title = {

			};

			$scope.formData = {
				producto: ''
			};

			$scope.data = {
				materiales: []
			};

			$scope.formControl = {
				error: true,
				loading: false,
				nuevaCordoba: false,
				cerro: false,
				productoCargado: false,

				reloadPage: activate,
				ok: guardar,
				cancel: cancel,

				productoSeleccionado: productoSeleccionado,
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function productoSeleccionado(producto) {
				$scope.formControl.productoCargado = false;
				$scope.formData.producto = producto;
				if ($scope.formData.producto.Id) {
					$scope.formControl.productoCargado = true;
					guardar()
				}
			}

			function guardar() {
				StockFarmaciaLogicService.nuevoProducto = $scope.formData.producto;
				$uibModalInstance.close();
			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			function agregarProducto() {
				$scope.formControl.cargarProducto = !$scope.formControl.cargarProducto;
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$scope.formControl.loading = true;
				MaterialDataService.obtenerParaCambioPorArticuloReferenciaYDroga($scope.constante.numeroArticulo, $scope.constante.droga)
					.then(activateOk, activateError);
			}

			function activateOk(result) {
				$scope.formControl.loading = false;
				$scope.data.materiales = result;
				if (StockFarmaciaLogicService.sucursal.Id == 1) {
					$scope.formControl.nuevaCordoba = true;
				}
				else if (StockFarmaciaLogicService.sucursal.Id == 2) {
					$scope.formControl.cerro = true;
				}
				for (var i = 0; i < $scope.data.materiales.length; i++) {
					$scope.data.materiales[i].Stock = ($scope.formControl.nuevaCordoba) ? $scope.data.materiales[i].StockNuevaCordoba : $scope.data.materiales[i].StockCerro;
				}
			}

			function activateError(error) {
				$scope.formControl.loading = false;
			}
		}
	};

	return module;
})();