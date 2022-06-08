import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('GuardiaEditController', GuardiaEditController);

		// Inyección de Dependencia
		GuardiaEditController.$inject = [
			'$scope', '$log', '$filter', '$q', '$state', 'GuardiaAtencionDataService', 'GuardiaAtencionLogicService',
			'TITLE_ATENCION', 'User'
		];

		// Constructor del Controller
		function GuardiaEditController(
			$scope, $log, $filter, $q, $state, GuardiaAtencionDataService, GuardiaAtencionLogicService,
			TITLE_ATENCION, User) {

			$log.debug('GuardiaEditController: ON.-');

			// En $scope va lo que necesite modificar la vista.
			// En this (vm) va lo que no modifica la vista

			$scope.title = {
				module: TITLE_ATENCION.MODULE,
				page: TITLE_ATENCION.EDIT
			};


			$scope.formData = {
				// Información del formulario
			};

			$scope.data = {
				prescripcion: '',
				paciente: '',
				medicamentos: [],
				medicamentosCarga: [],
				tiposDosis: [],
				vias: [],
				user: User// Usuario con rol del modulo
			};

			$scope.filter = {
				lista: [], // Lista filtrada para paginacion
				nombreCompleto: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			$scope.formControl = {
				// Manejo del formulario
				error: false,
				loading: false,
				vacia: false,
				reloadPage: activate,
				volver: volver,
				validarForm: validarForm,
				llenarForm: llenarForm,
				verMedicamentos: verMedicamentos,
				colorearPrioridad: colorearPrioridad,
				realizarPrescripcion: realizarPrescripcion

			};

			$scope.validar = {
				error: validarError
			};

			$scope.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver() {
				// Ejemplo
				$state.go('guardiaAtencion.list');
				// $location.url('/Guardia/Atencion/List');
			}

			function validarError(pBool) {
				if (!pBool) {
					return 'error';
				}
				return '';
			}

			function validarForm() {
				// body...
			}

			function llenarForm() {
				// body...
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				$scope.filter.nombreCompleto = '';
			}

			function validarFilters() {
				if ($scope.filter.nombreCompleto == null) {
					$scope.filter.nombreCompleto = '';
				}
			}

			function getPage() {
				var begin = (($scope.paginacion.currentPage - 1) * $scope.paginacion.pageSize);
				var end = begin + $scope.paginacion.pageSize;
				$scope.filter.validar();
				$scope.filter.lista = $filter('filter')
					($scope.data.lista, {
						Paciente:
						{
							NombreCompleto: $scope.filter.nombreCompleto
						}
						// Agregar los filters restantes
					});
				$scope.paginacion.totalItems = $scope.filter.lista.length;
				$scope.filter.lista = $scope.filter.lista.slice(begin, end);
				//$log.debug('GuardiaEditController: GetPage OK.-');
			}

			function verMedicamentos(pIndex) {
				if (!$scope.data.prescripcion.Detalles[pIndex].verMateriales) {
					$scope.data.prescripcion.Detalles[pIndex].verMateriales = true;
				}
				else {
					$scope.data.prescripcion.Detalles[pIndex].verMateriales = false;
				}
				if ($scope.data.prescripcion.Detalles[pIndex].Materiales.length == 0) {
					$scope.data.prescripcion.Detalles[pIndex].noMateriales = true;
				}
				$log.debug('detalle', $scope.data.prescripcion.Detalles[pIndex]);
			}


			function colorearPrioridad(pPrioridad) {
				return GuardiaAtencionLogicService.colorearPrioridad(pPrioridad);
			}

			function inicializarVariables() {
				GuardiaAtencionDataService.getAllDescartablesByUbicacion()
					.then(function (pDescartables) {
						GuardiaAtencionDataService.descartables = pDescartables;
					});

				// for (var j = 0; j < $scope.data.prescripcion.Detalles.length; j++) {
				// 	getIndicacion($scope.data.prescripcion.Detalles[j].Indicacion,j);
				// 	for (var i = 0; i < $scope.data.prescripcion.Detalles[j].Materiales.length; i++) {
				// 		getMaterial($scope.data.prescripcion.Detalles[j].Materiales[i],j,i);
				// 	}
				// }
				$scope.formControl.loading = false;
			}


			function realizarPrescripcion(pDetalle) {
				$log.debug('realizarPrescripcion', pDetalle);
				GuardiaAtencionDataService.detalle = pDetalle;
				GuardiaAtencionDataService.vias = $scope.data.vias;
				GuardiaAtencionDataService.tiposDosis = $scope.data.tiposDosis;
				GuardiaAtencionLogicService.editPrescripcion()
					.then(function () {
						activate();
					});
			}


			activate();
			/* Método inicializador */
			function activate() {
				$log.debug('GuardiaEditController: Inicializar ON.-', User);
				if (!GuardiaAtencionDataService.prescripcion) {
					// $log.debug('GuardiaEditController: 1.-');
					$state.go('guardiaAtencion.list');
					// $location.path('/Guardia/Atencion/List');
				}
				else {
					$log.debug('GuardiaEditController: 2.-');
					$scope.formControl.loading = true;
					var _prescripcion = GuardiaAtencionDataService.prescripcion;
					var _usuario = GuardiaAtencionDataService.getUsuarioByNombre(User.userName);
					// var _medicamentos = GuardiaAtencionDataService.getAllMedicamentosByUbicacion();
					var _vias = GuardiaAtencionDataService.getAllVias();
					var _tiposDosis = GuardiaAtencionDataService.getAllTiposDosis();
					var _detallesPrescripcion = GuardiaAtencionDataService.getDetallesPrescripcionPendientes();

					$log.debug('GuardiaEditController: 3.-');
					$q.all([_prescripcion, _usuario, _vias, _tiposDosis, _detallesPrescripcion])
						.then(function (pResult) {
							$log.debug('GuardiaEditController: 4.-');
							$scope.data.prescripcion = GuardiaAtencionDataService.prescripcion;
							$scope.data.user.id_usuario = pResult[1].id_usuario;
							$scope.data.paciente = pResult[0].Paciente;
							// $scope.data.medicamentos = pResult[2];
							$scope.data.vias = pResult[2];
							$scope.data.tiposDosis = pResult[3];
							$scope.data.prescripcion.Detalles = pResult[4];
							GuardiaAtencionDataService.usuario = User;
							if ($scope.data.prescripcion.Detalles.length == 0) {
								$scope.formControl.vacia = true;
							}

							$log.debug('prescripcion', $scope.data.prescripcion);
							inicializarVariables();
						});
				}
			}

		}
	};

	return module;
})();