import { IMovimientoStockDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DosificacionStockInternadoPrintCotroller', DosificacionStockInternadoPrintCotroller);

		// Inyección de Dependencia
		DosificacionStockInternadoPrintCotroller.$inject = ['$scope', '$log',
			'MovimientoStockDataService',
			'StockFarmaciaLogicService', 'Movimiento'
		];
		// Constructor del Controller
		function DosificacionStockInternadoPrintCotroller($scope, $log,
			MovimientoStockDataService: IMovimientoStockDataService,
			StockFarmaciaLogicService, Movimiento) {

			$log.debug('DosificacionStockInternadoPrintCotroller: ON.-');

			var vm = this;

			$scope.formData = {
				aval: '',
				html: ''
			};

			$scope.data = {
				aval: {},
				listadoInternados: [],
				descartables: [],
				ubicacionPiso: ''
			};

			$scope.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				reloadPage: activate,
				volver: volver,
				validarForm: validarForm,
				llenarForm: llenarForm,
				esValidoParaFirma: esValidoParaFirma
			};

			$scope.validar = {
				error: validarError
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver() {


			}

			function validarError(pBool) {
				if (!pBool) {
					return 'error';
				}
				return;
			}

			function esValidoParaFirma(pIndex) {
				if (pIndex == 2 || pIndex == 8) {
					return true;
				}
				return;
			}

			function validarForm() {
				// body...
			}

			function llenarForm() {
				// body...
			}


			vm.imprimirInternado = function () {
				for (let k = 0; k < $scope.data.listado.Internados.length; k++) {
					if ($scope.data.listado.Internados[k].Dosificaciones.length > 0)
						$scope.data.listado.Internados[k].hayDosificaciones = true;
					if ($scope.data.listado.Internados[k].Agregados.length > 0)
						$scope.data.listado.Internados[k].hayAgregados = true;
					for (var j = $scope.data.materiales.length - 1; j >= 0; j--) {
						for (var i = $scope.data.listado.Internados[k].Dosificaciones.length - 1; i >= 0; i--) {
							if ($scope.data.materiales[j].numero_articulo == $scope.data.listado.Internados[k].Dosificaciones[i].numero_articulo) {
								$scope.data.listado.Internados[k].Dosificaciones[i].nombre = $scope.data.materiales[j].nombre;
								$scope.data.listado.Internados[k].Dosificaciones[i].presentacion = $scope.data.materiales[j].presentacion;
							}
						}
						for (var i = 0; i < $scope.data.listado.Internados[k].Agregados.length; i++) {
							if ($scope.data.materiales[j].numero_articulo == $scope.data.listado.Internados[k].Agregados[i].numero_articulo) {
								$scope.data.listado.Internados[k].Agregados[i].nombre = $scope.data.materiales[j].nombre;
								$scope.data.listado.Internados[k].Agregados[i].presentacion = $scope.data.materiales[j].presentacion;
							}
						}
					}
				}
				$scope.data.internacionesPrint = $scope.data.listado.Internados;
				setTimeout(function () { window.print(); }, 1000);
			};



			activate();
			/* Método inicializador */
			function activate() {
				$scope.formControl.loading = true;
				MovimientoStockDataService.obtenerListadoDosificacionPorMovimiento(Movimiento.id_movimiento)
					.then(function (listado) {
						$scope.data.listado = listado;
						$scope.data.materiales = StockFarmaciaLogicService.materiales;
						$scope.data.ubicacion = {
							nombre_ubicacion_piso: listado.Piso
						}
						$scope.data.fecha_hora = Movimiento.fecha_alta;
						$scope.formControl.loading = false;
						vm.imprimirInternado();
					})
			}
		}

	};
	return module;

})();