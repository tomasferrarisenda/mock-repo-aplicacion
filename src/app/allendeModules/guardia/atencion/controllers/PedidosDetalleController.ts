import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PedidosDetalleController', PedidosDetalleController);

		PedidosDetalleController.$inject = ['$scope', '$log', '$q', '$filter', '$location',
		'TITLE_ATENCION', 'GuardiaAtencionDataService', '$uibModalInstance','ModalService', 'User', 'Pedidos'];

		function PedidosDetalleController ($scope, $log, $q, $filter,$location,
			TITLE_ATENCION , GuardiaAtencionDataService , $uibModalInstance, ModalService, User, Pedidos) {

			$log.debug('PedidosDetalleController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */
			


			// $scope.icono = ICON;
			$scope.title = {
				module: TITLE_ATENCION.MODULE,
				page: TITLE_ATENCION.NEW_MEDICAMENTO
			};
			$scope.constante = {

			};
			$scope.formData = {

			};

			$scope.data = {
				
			};

			$scope.formControl = {
				error: true,
				loading: false,
				vacio: false,
				hayCargado: false,

				verDetalle: verDetalle,
				asociar: asociar,
				reloadPage: activate,
				ok : guardar,
				cancel : cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {
				if($scope.data.pedidos.length == 0)
				{
					$scope.formControl.vacio = true;
				}
				for (var i = 0; i < $scope.data.pedidos.length; i++) {
					for (var j = 0; j < $scope.data.pedidos[i].Detalles.length; j++) {

						// getMaterialByProducto(i,j);
					}
					// $scope.data.pedidos[i].cantidad = 0;
					// $scope.data.pedidos[i].minimo = true;
					// getPrescripcionDetalleMaterialById(i,j);

					for (var j = 0; j < Pedidos.length; j++) {
						if(Pedidos[j].id_pedido_farmacia_ventanilla ==  $scope.data.pedidos[i].id_pedido_farmacia_ventanilla)
						{
							$scope.data.pedidos[i].asociado = true;
							$scope.data.pedidos[i].yaAsociado = true;
						}
					}	
				}
			}


			function verDetalle(index) {
				$log.debug('pedido',$scope.data.pedidos[index]);
				if($scope.data.pedidos[index].verDetalle)
				{
					$scope.data.pedidos[index].verDetalle = false;
				}
				else
				{
					$scope.data.pedidos[index].verDetalle = true;
				}
			}

			// function suma(pDetalle) {
			// 	for (var i = 0; i < $scope.data.ubicacionesDetalle.length; i++) {
			// 		if($scope.data.ubicacionesDetalle[i].id_ubicacion_detalle == pDetalle.id_ubicacion_detalle)
			// 		{
			// 			$scope.data.ubicacionesDetalle[i].cantidad += 1;
			// 			$scope.data.ubicacionesDetalle[i].minimo = false;
			// 			if($scope.data.ubicacionesDetalle[i].cantidad == $scope.data.ubicacionesDetalle[i].stock_actual)
			// 			{
			// 				$scope.data.ubicacionesDetalle[i].maximo = true;
			// 			}
			// 		}
			// 	}
			// 	hayCargados();
			// }

			// function resta(pDetalle) {
			// 	for (var i = 0; i < $scope.data.ubicacionesDetalle.length; i++) {
			// 		if($scope.data.ubicacionesDetalle[i].id_ubicacion_detalle == pDetalle.id_ubicacion_detalle)
			// 		{
			// 			$scope.data.ubicacionesDetalle[i].cantidad -= 1;
			// 			$scope.data.ubicacionesDetalle[i].maximo = false;
			// 			if($scope.data.ubicacionesDetalle[i].cantidad == 0)
			// 			{
			// 				$scope.data.ubicacionesDetalle[i].minimo = true;
			// 			}
			// 		}
			// 	}
			// 	hayCargados();
			// }

			function asociar() {
				$scope.formControl.hayCargado = false;
				for (var i = 0; i < $scope.data.pedidos.length; i++) {
					if($scope.data.pedidos[i].asociado && !$scope.data.pedidos[i].yaAsociado)
					{
						$scope.formControl.hayCargado = true;
					}
				}
			}

			function guardar() {
				ModalService.confirm("¿Asociar pedido?",function (pResult) {
					if(pResult)
					{
						var pedidos : Array<any> = [];
						for (var i = 0; i < $scope.data.pedidos.length; i++) {
							if($scope.data.pedidos[i].asociado && !$scope.data.pedidos[i].yaAsociado)
							{
								pedidos.push($scope.data.pedidos[i]);
							}
						}
						$log.debug("pedidos",pedidos);
					 	$uibModalInstance.close(pedidos);
					}
				});
			}

			
			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('PedidosDetalleController: Inicializar ON.-');
				$scope.formControl.loading = true;
				var _ubicacion = GuardiaAtencionDataService.getUbicacionBySucursal(GuardiaAtencionDataService.sucursal);
				// var _ubicacionesDetalle = StockService.getUbicacionesDetallePedidoByUbicacion(Ubicacion.id_ubicacion);

				$q.all([_ubicacion])
					.then(function (results) {
						$scope.data.ubicacion = results[0];
						var _pedidos = GuardiaAtencionDataService.getPedidosByUbicacion($scope.data.ubicacion.id_ubicacion);
						$q.all([_pedidos])
							.then(function (pResult) {
								$scope.data.pedidos = pResult[0];
								$scope.formControl.loading = false;
								inicializarVariables();
							});
					});

			}


		}
	};

	return module;
})();