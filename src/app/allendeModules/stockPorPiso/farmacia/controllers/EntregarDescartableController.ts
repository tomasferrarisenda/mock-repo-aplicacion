import { IFacturacionMedicamentoDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('EntregarDescartableController', EntregarDescartableController);

		EntregarDescartableController.$inject = ['$scope', '$log', '$q', '$uibModalInstance',
			'FacturacionMedicamentoDataService',
			'StockFarmaciaLogicService', 'AlertaService', 'ModalService', 'SecurityLogicService'];

		function EntregarDescartableController($scope, $log, $q, $uibModalInstance,
			FacturacionMedicamentoDataService: IFacturacionMedicamentoDataService,
			StockFarmaciaLogicService, AlertaService: IAlertaService, ModalService, SecurityLogicService) {

			$log.debug('EntregarDescartableController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.title = {

			};

			$scope.formData = {

			};

			$scope.data = {
				facturaciones: [],
				materiales: [],
				sistemas: [],
				usuarioRetira: ''

			};

			$scope.formControl = {
				error: true,
				loading: false,
				nuevaCordoba: false,
				cerro: false,

				reloadPage: activate,
				ok: guardar,
				cancel: cancel,

				agregarProducto: agregarProducto,
				nuevoProducto: nuevoProducto,
				registrarRetira: registrarRetira,
				suma: suma,
				resta: resta
			};

			// $scope.paginacion = {
			// 	currentPage: 1,
			// 	pageSize: 7
			// };

			// $scope.filter = {
			// 	facturaciones: [],
			// 	usuario: '',
			//              origen: '',
			//              codigo_material: '',

			//              // mètodo para botòn Limpiar filtros
			//              clean: function (){
			//              	$scope.filter.usuario = '';
			//                  $scope.filter.origen = '';
			//                  $scope.filter.codigo_material = '';
			//                  $scope.formControl.limpiar = true;
			//                  // $scope.formData.search = ''

			//              },
			//              // mètodo para que no valle el filtro de solicitudes
			//              validar: function () {

			//                  if ($scope.filter.usuario == null) {
			//                      $scope.filter.usuario = '';
			//                  }
			//                  if ($scope.filter.origen == null) {
			//                      $scope.filter.origen = '';
			//                  }
			//                  if ($scope.filter.codigo_material == null) {
			//                      $scope.filter.codigo_material = '';
			//                  } 
			//              }
			// };

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			// function getPage() {
			//           	$log.debug('Get Page ON');
			//              var begin = (($scope.paginacion.currentPage - 1) * $scope.paginacion.pageSize);
			//              var end = begin + $scope.paginacion.pageSize;
			//              $scope.filter.validar();
			//              $scope.filter.facturaciones = $filter('filter')
			//                  ($scope.data.facturaciones,{
			//                  	sistema: $scope.filter.origen,
			//                  	numero_articulo : $scope.filter.codigo_material
			//                  });

			//              $scope.paginacion.totalItems = $scope.filter.facturaciones.length;
			//              $scope.filter.facturaciones = $scope.filter.facturaciones.slice(begin, end);
			//          }

			function inicializarVariables() {



			}

			function guardar() {
				var _llamadas: Array<any> = [];
				var _movimiento = {
					id_usuario_alta: StockFarmaciaLogicService.usuario.id,
					id_usuario_modificacion: $scope.data.usuarioRetira.id,
					id_ubicacion_desde: StockFarmaciaLogicService.farmacia.Ubicacion.id_ubicacion,
					id_ubicacion_hasta: $scope.data.internacion.substring(0, 6),
					DetallesMovimiento: <Array<any>>[]
				};
				var _detalle = {};
				for (var i = 0; i < $scope.data.facturaciones.length; i++) {
					if ($scope.data.facturaciones[i].nuevo) {
						if ($scope.data.facturaciones[i].cantidad > 0) {
							_llamadas.push(FacturacionMedicamentoDataService.newFacturacion($scope.data.internacion.substring(0, 6),
								$scope.data.facturaciones[i].Material.numero_articulo,
								$scope.data.facturaciones[i].cantidad));
							_detalle = {
								id_producto: $scope.data.facturaciones[i].Material.id_producto,
								cantidad_productos: $scope.data.facturaciones[i].cantidad
							};
							_movimiento.DetallesMovimiento.push(_detalle);
						}
					}
					else {
						// if($scope.data.facturaciones[i].cantidad != $scope.data.facturaciones[i].cantidad_o)
						// {
						// 	_llamadas.push(FacturacionMedicamentoDataService.editFacturacion($scope.data.facturaciones[i].id,
						// 															$scope.data.facturaciones[i].cantidad,
						// 															$scope.data.facturaciones[i].id_sucursal));
						// 	_detalle = {
						// 		id_producto: $scope.data.facturaciones[i].Material.id_producto,
						// 		cantidad_productos: $scope.data.facturaciones[i].cantidad
						// 	};
						// 	_movimiento.DetallesMovimiento.push(_detalle);
						// }
					}
				}
				// if ($scope.data.usuarioRetira != '') {
				// 	$log.debug('_movimiento', _movimiento);
				// 	_llamadas.push(MovimientoStockDataService.newMovimientoVentanilla(_movimiento));
				// }
				$q.all(_llamadas)
					.then(function () {
						$log.debug('Entrega ventanilla OK');
						AlertaService.NewSuccess("Productos entregados correctamente");
						$uibModalInstance.close(true);
					});
			}



			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			function agregarProducto() {
				$scope.formControl.cargarProducto = !$scope.formControl.cargarProducto;
			}

			function nuevoProducto() {
				if($scope.formData.productoNuevo.stock <= 0) {
					var pregunta = 'El producto seleccionado tiene stock en cero, ¿está seguro que quiere facturar este producto?';
					ModalService.confirm(pregunta,
					function(pResult) {
						if (pResult) {
							agregarNuevoProducto();
						} 
					});
				} else {
					agregarNuevoProducto();
				}

				//$log.debug('Producto', $scope.formData.productoNuevo);
				
			}

			function agregarNuevoProducto(){
				var _facturacion: any = {};
				_facturacion.Material = $scope.formData.productoNuevo;
				_facturacion.numero_articulo = _facturacion.Material.numero_articulo;
				_facturacion.cantidad = 0;
				_facturacion.minimo = true;
				_facturacion.nuevo = true;
				_facturacion.sistema = '';
				_facturacion.id = 0;
				var _existe = false;
				for (var i = 0; i < $scope.data.facturaciones.length; i++) {
					if ($scope.data.facturaciones[i].id == 0 && $scope.data.facturaciones[i].numero_articulo == _facturacion.numero_articulo) {
						_existe = true;
					}
				}
				if (!_existe) {
					$scope.data.facturaciones.push(_facturacion);
				}
				// getPage();
				$scope.formData.productoNuevo = '';
				$scope.formControl.cargarProducto = false;
			}	

			function suma(pFacturacion) {

				for (var i = 0; i < $scope.data.facturaciones.length; i++) {
					if ($scope.data.facturaciones[i].id == pFacturacion.id &&
						$scope.data.facturaciones[i].numero_articulo == pFacturacion.numero_articulo) {
						$scope.data.facturaciones[i].cantidad += 1;
						$scope.data.facturaciones[i].minimo = false;
					}
				}

			}

			function resta(pFacturacion) {
				for (var i = 0; i < $scope.data.facturaciones.length; i++) {
					if ($scope.data.facturaciones[i].id == pFacturacion.id &&
						$scope.data.facturaciones[i].numero_articulo == pFacturacion.numero_articulo) {
						$scope.data.facturaciones[i].cantidad -= 1;
						if ($scope.data.facturaciones[i].cantidad == 0) {
							$scope.data.facturaciones[i].minimo = true;
						}
					}
				}
			}

			function registrarRetira() {
				$scope.data.usuarioRetira = '';
				SecurityLogicService.ValidarUsuario()
					.then(function (pCredentials) {
						$scope.data.usuarioRetira = pCredentials;
					});
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				// $scope.formControl.loading = true;
				$scope.formControl.supervisor = StockFarmaciaLogicService.supervisor;
				$scope.data.materiales = StockFarmaciaLogicService.materiales;
				$scope.data.internacion = StockFarmaciaLogicService.internacion;

				if (StockFarmaciaLogicService.sucursal.Id == 1) {
					$scope.formControl.nuevaCordoba = true;
				}
				else if (StockFarmaciaLogicService.sucursal.Id == 2) {
					$scope.formControl.cerro = true;
				}
				for (var i = 0; i < $scope.data.materiales.length; i++) {
					$scope.data.materiales[i].stock = ($scope.formControl.nuevaCordoba) ? $scope.data.materiales[i].stock_nueva_cordoba : $scope.data.materiales[i].stock_cerro;
					
				}
				// FacturacionMedicamentoDataService.getFacturacionesByNumeroInternado($scope.data.internacion.NumeroInternado)
				// 	.then(function (_facturaciones) {
				// 		$scope.data.facturaciones = _facturaciones;
				// 		inicializarVariables();
				// 	});
				$log.debug('EntregarDescartableController: Inicializar ON.-', StockFarmaciaLogicService.internacion);


			}


		}
	};

	return module;
})();