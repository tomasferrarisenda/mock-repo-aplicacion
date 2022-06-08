import { IUbicacionDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('UtilizadosPrintController', UtilizadosPrintController);

		// Inyección de Dependencia
		UtilizadosPrintController.$inject = ['$scope', '$log', '$uibModalInstance',
			'UbicacionDataService',
			'StockEnfermeriaLogicService', 'Ubicacion', 'TipoUbicacion'];

		// Constructor del Controller
		function UtilizadosPrintController($scope, $log, $uibModalInstance,
			UbicacionDataService: IUbicacionDataService,
			StockEnfermeriaLogicService, Ubicacion, TipoUbicacion) {

			$log.debug('UtilizadosPrintController: ON.-', Ubicacion);

			$scope.constante = {
				ubicacion: Ubicacion,
				title: "Detalle de stock utilizados de "
			};

			$scope.formData = {
				aval: '',
				html: ''
			};

			$scope.data = {
				detalles: []
				//user: User// Usuario con rol del modulo
			};

			$scope.formControl = {
				// Manejo del formulario
				error: true,
				loading: true,
				reloadPage: activate,
				volver: volver,
				validarForm: validarForm,
				llenarForm: llenarForm,
			};

			$scope.validar = {
				error: validarError
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver() { }

			function validarError(pBool) {
				if (!pBool) {
					return 'error';
				}
				return;
			}

			function validarForm() { }

			function llenarForm() { }

			activate();
			/* Método inicializador */
			function activate() {
				$scope.formControl.loading = true;
				UbicacionDataService.getTotalNoRepuestoByUbicacionAndTipo($scope.constante.ubicacion.id_ubicacion,
					TipoUbicacion.id_tipo_ubicacion_detalle)
					.then(function (_ubicaciones) {

						$log.debug('_ubicaciones', _ubicaciones);
						$scope.data.materiales = StockEnfermeriaLogicService.materiales;
						$scope.constante.ubicacion.DetalleStock = [];
						$scope.formControl.vacio = true;
						if (_ubicaciones.length > 0) {
							for (var k = 0; k < $scope.data.materiales.length; k++) {
								for (var i = 0; i < _ubicaciones.length; i++) {
									if ($scope.data.materiales[k].id_producto == _ubicaciones[i].id_producto) {
										_ubicaciones[i].Producto = {};
										_ubicaciones[i].Producto = $scope.data.materiales[k];
										// _ubicaciones[i].stock_actual = $scope.data.materiales[k].costo;
										if (_ubicaciones[i].cantidad_utilizada && _ubicaciones[i].cantidad_utilizada > 0) {
											_ubicaciones[i].stock_actual = _ubicaciones[i].cantidad_utilizada;
											$log.debug('_ubicaciones[i]', _ubicaciones[i]);
											$scope.formControl.vacio = false;
											$scope.constante.ubicacion.DetalleStock.push(_ubicaciones[i]);
										}
									}
								}
							}
							$scope.formControl.loading = false;
							if (!$scope.formControl.vacio) {
								setTimeout(function () { window.print(); }, 1000);
							}
						}
						else {
							$scope.constante.ubicacion.DetalleStock = [];
							$scope.formControl.loading = false;
						}
					}, function () {
						$scope.formControl.loading = false;
					});
			}
		}

	};
	return module;

})();