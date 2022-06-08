import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('PrescripcionDetalleController', PrescripcionDetalleController);

		PrescripcionDetalleController.$inject = ['$scope', '$log', '$q', '$filter',
			'TITLE_ADMINISTRACION', 'GuardiaAdministracionDataService', 'GuardiaAdministracionLogicService', '$uibModalInstance', 'Prescripcion', 'Materiales', 'Practicas'];

		function PrescripcionDetalleController($scope, $log, $q, $filter,
			TITLE_ADMINISTRACION, GuardiaAdministracionDataService, GuardiaAdministracionLogicService, $uibModalInstance, Prescripcion, Materiales, Practicas) {

			$log.debug('PrescripcionDetalleController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			var vm = this;
			vm.template = 'atencion/templates/detalle_prescripcion.tpl.html';

			$scope.title = {
				module: TITLE_ADMINISTRACION.GUARDIA,
				page: TITLE_ADMINISTRACION.DETALLE
			};

			$scope.formData = {
				detalle: ''
			};

			$scope.data = {
				prescripcion: Prescripcion,
				materiales: Materiales,
				practicas: Practicas
			};

			$scope.formControl = {
				error: true,
				loading: false,
				print: print,
				cargarEvolucion: cargarEvolucion,
				printFoja: printFoja,

				reloadPage: activate,
				ok: ok
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables() {

				for (var i = 0; i < $scope.data.prescripcion.Detalles.length; i++) {
					if ($scope.data.prescripcion.Detalles[i].Foja) {
						$scope.data.prescripcion.Detalles[i].tieneFoja = true;
					}
				}
				$scope.data.prescripcion.EvolucionesCargadas = [];
				var evolucion;
				for (var i = 0; i < $scope.data.prescripcion.Evoluciones.length; i++) {
					evolucion = $scope.data.prescripcion.Evoluciones[i];
					$scope.data.prescripcion.Evoluciones[i] = {};
					$scope.data.prescripcion.Evoluciones[i].cargada = true;
					$scope.data.prescripcion.Evoluciones[i].evolucion = evolucion;
					$scope.data.prescripcion.EvolucionesCargadas.push($scope.data.prescripcion.Evoluciones[i]);
				}
				if ($scope.data.prescripcion.Detalles.length == 0) {
					$scope.formControl.practicasVacio = true;
				}
				if ($scope.data.prescripcion.Materiales.length == 0) {
					$scope.formControl.productosVacio = true;
				}
				if ($scope.data.prescripcion.Evoluciones.length == 0) {
					$scope.formControl.evolucionesVacio = true;
				}
				$log.debug("Prescripcion", $scope.data.prescripcion);
			}

			function cargarEvolucion() {
				$scope.data.prescripcion.EvolucionesCargadas = [];
				for (var i = 0; i < $scope.data.prescripcion.Evoluciones.length; i++) {
					if ($scope.data.prescripcion.Evoluciones[i].cargada) {
						$scope.data.prescripcion.EvolucionesCargadas.push($scope.data.prescripcion.Evoluciones[i]);
					}
				}
				$log.debug("Prescripcion", $scope.data.prescripcion);
			}

			function ok() {
				$uibModalInstance.close();
			}

			function print() {
				GuardiaAdministracionLogicService.printDetalle($scope.data.prescripcion);
			}

			function printFoja(pDetalle) {
				GuardiaAdministracionLogicService.printFoja(pDetalle, $scope.data.prescripcion);
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('PrescripcionDetalleController: Inicializar ON.-');

				var _detalles = GuardiaAdministracionDataService.GetDetallesPracticaById($scope.data.prescripcion.Id);
				var _materiales = GuardiaAdministracionDataService.GetDetallesMaterialById($scope.data.prescripcion.Id);
				var _evolucion = GuardiaAdministracionDataService.GetEvolucionByPrescripcion($scope.data.prescripcion.Id);

				$q.all([_detalles, _materiales, _evolucion])
					.then(function (pResult) {
						$scope.data.prescripcion.Detalles = pResult[0];
						$scope.data.prescripcion.Materiales = pResult[1];
						$scope.data.prescripcion.Evoluciones = pResult[2];
						$log.debug('PrescripcionDetalleController: activate pResult.-', pResult);
						inicializarVariables();
					})
			}

			function activateOk(pResult) {
				$scope.data.medicamentos = pResult[0];
				$scope.formControl.loading = false;
			}

			function activateError(pError) {
				$scope.formControl.loading = false;
				$scope.formControl.error = true;
			}
		};
	};

	return module;
})();