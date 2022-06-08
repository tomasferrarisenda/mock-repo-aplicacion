/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('PrestacionAsignarController', PrestacionAsignarController);

		// Inyección de Dependencia
		PrestacionAsignarController.$inject = ['Logger', '$filter', 'orderByFilter', '$uibModalInstance', 'PrestacionGestionDataService',
			'ModalService', 'IdSucursal', 'IdServicio'
		];

		// Constructor del Controller
		function PrestacionAsignarController($log, $filter, orderByFilter, $uibModalInstance, PrestacionGestionDataService,
			ModalService, IdSucursal, IdServicio
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrestacionAsignarController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				prestacion: {
					Prefacturables: []
				},
				prefacturables: {},
				preFacturable: {},
				prefacturablesList: {},
				tipoPrefacturables: {},
				prestaciones: []

			};

			vm.checkbox = {

			}

			vm.formControl = {
				loadingCalle: false,
				error: true,
				loading: false,
				ok: ok,
				cancel: cancel,
				asignar: asignar

			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.prestacion = {
				asignar: asignar
			};

			vm.filter = {
				Nombre: '',
				Codigo: '',
				clean: cleanFilters,
				validar: validarFilters
			};


			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */


			function cancel() {
				$uibModalInstance.close('close');
			}

			function asignar(pPrestacion) {
				$log.debug('prestacion', pPrestacion);

				ModalService.confirm('¿Desea asignar la prestacion ' + pPrestacion.Nombre + ' al servicio?',
					function(pResult) {
						if (pResult) {


							PrestacionGestionDataService.validarAsignarAServicio(IdServicio,IdSucursal,pPrestacion.Id)
								.then(function(pResponse) {

									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										PrestacionGestionDataService.asignarAServicio(IdServicio,IdSucursal,pPrestacion.Id)
											.then(function(pResp) {
												vm.formControl.loading = true;
												ModalService.success("Prestacion Asignada");
												activate();
											}).catch(function(pError) {
												vm.formControl.loading = false;
												ModalService.error("Error de servidor");
												$log.error('ValidacionAsignar .-', pError);
											});
									} else {
										if (pResponse.Message != null)
											ModalService.error(pResponse.Message);
										else
											ModalService.error("Error de servidor");
										vm.formControl.loading = false;

									}
								})
								.catch(function(pError) {
									vm.formControl.loading = false;

									$log.error('ValidacionAsignar .-', pError);
								});

						}
					});
			}	

			function ok() {
				$uibModalInstance.close('ok');
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.nombrePrestacion = '';
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.id == null)
					vm.filter.id = '';

				if (vm.filter.nombrePrestacion == null)
					vm.filter.nombrePrestacion = '';

				vm.order = {
					id: 1,
					value: 'Codigo',
					descripcion: 'Codigo (Asc)',
					reverse: false
				}

			}


			function getPage() {


				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.prestaciones = orderByFilter(vm.data.prestaciones, vm.order.value, vm.order.reverse);

				vm.filter.prestaciones = $filter('filter')
					(vm.data.prestaciones, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombrePrestacion

					});

				vm.paginacion.totalItems = vm.filter.prestaciones.length;
				vm.filter.prestaciones = vm.filter.prestaciones.slice(begin, end);
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {

				vm.formControl.loading = true;
				vm.formControl.stateLoading = true;

				var _prestaciones = PrestacionGestionDataService.getAll()
					.then(activateOk, activateError);

				function activateOk(pResults) {


					vm.data.prestaciones = pResults;
					$log.debug('Inicializar OK.-');

					cleanFilters();
					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 6;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;
				}

				function activateError(pError) {
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;

					//$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}
		};
	};

	return module;

})();