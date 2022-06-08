import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ListAltaController', ListAltaController);

		// Inyección de Dependencia
		ListAltaController.$inject = [
			'$scope', '$log', '$filter', '$q', 'ModalService', 'GuardiaAdministracionDataService', 'GuardiaAdministracionLogicService',
			'TITLE_ADMINISTRACION', 'User'
		];

		// Constructor del Controller
		function ListAltaController(
			$scope, $log, $filter, $q, ModalService, GuardiaAdministracionDataService, GuardiaAdministracionLogicService,
			TITLE_ADMINISTRACION, User) {

			$log.debug('ListAltaController: ON.-');

			// En $scope va lo que necesite modificar la vista.
			// En this (vm) va lo que no modifica la vista
			var vm = this;

			$scope.title = {
				module: TITLE_ADMINISTRACION.MODULE,
				page: TITLE_ADMINISTRACION.LIST
			};



			$scope.formData = {

			};

			$scope.data = {
				// Información traida desde la BD
			};

			$scope.filter = {

			};

			$scope.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,

				cambiaFecha: cambiaFecha,
				// filterNombre: filterNombre,
				// filterNombreMutual: filterNombreMutual,
				// filterCodigoMutual : filterCodigoMutual,
				verDetalle: verDetalle,
				facturar: facturar,
				reloadPage: activate,
				volver: volver,
			};

			$scope.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				cleanFilters: cleanFilters,
				getPage: getPage
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver() {
				// Ejemplo
				// $location.url('/Home');
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				$scope.filter.nombreCompletoPaciente = '';
				$scope.filter.codigo_mutual = '';
				$scope.filter.nombre_mutual = '';
				getPage();
			}

			function validarFilters() {
				if ($scope.filter.nombreCompletoPaciente == null) {
					$scope.filter.nombreCompletoPaciente = '';
				}
				if ($scope.filter.nombre_mutual == null) {
					$scope.filter.nombre_mutual = '';
				}
				if ($scope.filter.codigo_mutual == null) {
					$scope.filter.codigo_mutual = '';
				}
				if ($scope.filter.numero_documento == null) {
					$scope.filter.numero_documento = '';
				}
			}

			function getPage() {
				var begin = (($scope.paginacion.currentPage - 1) * $scope.paginacion.pageSize);
				var end = begin + $scope.paginacion.pageSize;
				// validarFilters();
				$log.debug("getPage");
				$scope.filter.prescripciones = $filter('filter')
					($scope.data.prescripciones,
					{
						NombrePaciente: $scope.filter.nombreCompletoPaciente,
						NombreMutual: $scope.filter.nombre_mutual,
						CodigoMutual: $scope.filter.codigo_mutual,

						NumeroDocumento: $scope.filter.numero_documento


						// Agregar los filters restantes
					});
				$scope.paginacion.totalItems = $scope.filter.prescripciones.length;
				$scope.filter.prescripciones = $scope.filter.prescripciones.slice(begin, end);
			}

			function cambiaFecha() {
				$scope.data.fecha_desde = $filter('date')($scope.formData.fecha_desde, 'MM/dd/yyyy');
				$scope.data.fecha_hasta = $filter('date')($scope.formData.fecha_hasta, 'MM/dd/yyyy');
				// $scope.formControl.fecha_cambiada = true;
				getprescripciones();
			}

			function getprescripciones() {
				var _object = {};
				_object['id_ubicacion'] = $scope.data.ubicacion.id_ubicacion;
				_object['fecha_desde'] = $scope.data.fecha_desde;
				_object['fecha_hasta'] = $scope.data.fecha_hasta;

				GuardiaAdministracionDataService.GetPrescripcionesByUbicacionAndFecha(_object)
					.then(function (_prescripciones) {
						$scope.data.prescripciones = _prescripciones;
						$log.debug('ListAltaController: getprescripciones OK.-', _prescripciones);
						cleanFilters();
					}, function (pError) {
						// ModalService.error(pError.message);
						$scope.formControl.loading = false;
						$log.error('ListAltaController: getprescripciones ERROR.-', pError);
					})
			}


			function verDetalle(pPrescripcion) {
				$log.debug('pPrescripcion', pPrescripcion);
				GuardiaAdministracionLogicService.viewDetalle(pPrescripcion, $scope.data.materiales, $scope.data.practicas)
					.then(function (argument) {
						cambiaFecha();
					})
			}

			function facturar(pPrescripcion) {
				$log.debug('Facturar Prescripcion', pPrescripcion);
				GuardiaAdministracionLogicService.facturar(pPrescripcion)
					.then(function () {
						cambiaFecha();
						// body...
					})
				// body...
			}


			function inicializarVariables() {
				$scope.formData.fecha_hasta = new Date();
				$scope.formData.fecha_desde = new Date(Date.now() - 172800000);
				cambiaFecha();
			}

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('ListAltaController: Inicializar ON.-', User);
				var _ubicacion = GuardiaAdministracionDataService.GetUbicacionBySucursal(User.sucursales[0].Id);
				var _materiales = GuardiaAdministracionDataService.GetAllMateriales();
				var _practicas = GuardiaAdministracionDataService.GetPracticasMedicas();
				$q.all([_ubicacion, _materiales, _practicas])
					.then(function (pResult) {
						$scope.data.ubicacion = pResult[0];
						$scope.data.materiales = pResult[1];
						$scope.data.practicas = pResult[2];
						$scope.paginacion.currentPage = 1;
						$scope.paginacion.pageSize = 20;
						$scope.formControl.loading = false;
						$scope.formControl.error = false;
						inicializarVariables();
					}, function (pError) {
						// ModalService.error(pError.message);
						$scope.formControl.loading = false;
						$log.error('ListAltaController: Inicializar ERROR.-', pError);
					})
			}
		};
	};

	return module;
})();