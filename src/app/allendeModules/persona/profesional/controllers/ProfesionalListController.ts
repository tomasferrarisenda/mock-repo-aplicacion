/**
 * @author 			emansilla
 * @description 	description
 */
import { IProfesionalesDataService } from '../../../profesionales';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProfesionalListController', ProfesionalListController);

		// Inyeccion de dependencia
		ProfesionalListController.$inject = [
			'$scope', '$filter', 'Logger', '$q', '$uibModalInstance', '$window',
			'User', 'ProfesionalesDataService', 'ModalService', 'Detail'
		];
		
		// Constructor del Controller
		function ProfesionalListController (
			$scope, $filter, $log, $q, $uibModalInstance, $window,
			User, ProfesionalesDataService: IProfesionalesDataService, ModalService, Detail
			) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProfesionalListController');
			$log.debug('ON.-');
				
				// Variable para ProfesionalListController (ViewlModel)
				var vm = this;

				$scope.data = {
					profesionales: [],
					user: User
				};

				$scope.formData = {
					profesionalSeleccionado: ''
				};

				$scope.formControl = {
					loading: false,
					validarOk: validarOk,
					cancel : cancel,
					ok : ok,
					seleccionar : seleccionarProfesional
				};

				$scope.filter = {
					profesionales: [],
					nombreProfesional: '',
					matriculaProfesional : '',
					clean: cleanFilters,
					validar : validarFilters
				};

				$scope.paginacion = {
					currentPage: 0,
					pageSize: 0,
					totalItems: 0,
					pageChanged : getPage,
					getPage : getPage
				};

				/* IMPLEMENTACIÓN DE LOS MÉTODOS */

				/* FORMULARIO */

				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function ok (pProfesional) {
					var profesional = pProfesional || $scope.formData.profesionalSeleccionado;
					if (Detail) {
						ProfesionalesDataService
						.getOneProfesionalByMatricula(profesional.numero_matricula)
						.then(function (pProfesional) {
							$uibModalInstance.close(pProfesional);
						}, errorCallBack);
					}
					else {
						$uibModalInstance.close(profesional);
					}
				}

				function seleccionarProfesional(pProfesional) {
					$scope.formData.profesionalSeleccionado = pProfesional;
				}

				function validarOk () {
					var _flag = false;
					if ($scope.formData.profesionalSeleccionado != null) {
						if ($scope.formData.profesionalSeleccionado != '') {
							_flag = true;
						}
					}
					return _flag;
				}

				/* PAGINACIÓN */

				function cleanFilters () {
					$scope.filter.nombreProfesional = '';
					$scope.filter.matriculaProfesional = '';
					$scope.paginacion.pageChanged();
				}

				function validarFilters () {
					if ($scope.filter.nombreProfesional == null) {
						$scope.filter.nombreProfesional = '';
					}
					if ($scope.filter.matriculaProfesional == null) {
						$scope.filter.matriculaProfesional = '';
					}
				}

				function getPage () {
					var begin = (($scope.paginacion.currentPage - 1) * $scope.paginacion.pageSize);
					var end = begin + $scope.paginacion.pageSize;
					$scope.filter.validar();
					$scope.filter.profesionales = $filter('filter')
					($scope.data.profesionales,{
						nombre_completo : $scope.filter.nombreProfesional,
						numero_matricula : $scope.filter.matriculaProfesional
					});
					$scope.paginacion.totalItems = $scope.filter.profesionales.length;
					$scope.filter.profesionales = $scope.filter.profesionales.slice(begin, end);
				}

				activate();

				function activate () {
					$scope.formControl.loading = true;
					$log.debug('Inicializar ON.-');

					var _profesionales = ProfesionalesDataService.getAllProfesionales();

					$q.all([_profesionales])
					.then(function (pResults) {
						$log.debug('Inicializar OK.-', pResults);
						$scope.data.profesionales = pResults[0];

						$scope.paginacion.currentPage = 1;
						$scope.paginacion.pageSize = 5;
						$scope.paginacion.getPage();
						$scope.formControl.loading = false;
					}, errorCallBack);
				}

				function errorCallBack (pError) {
					$uibModalInstance.dismiss(pError);
				}
			}
		};

	return module;

})();