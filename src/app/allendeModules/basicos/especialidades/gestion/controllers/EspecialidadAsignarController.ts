/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('EspecialidadAsignarController', EspecialidadAsignarController);

		// Inyección de Dependencia
		EspecialidadAsignarController.$inject = ['Logger', '$filter', 'orderByFilter', '$uibModalInstance', 'EspecialidadMedicaDataService',
			'ModalService', 'IdSucursal', 'IdServicio'
		];

		// Constructor del Controller
		function EspecialidadAsignarController($log, $filter, orderByFilter, $uibModalInstance, EspecialidadMedicaDataService,
			ModalService, IdSucursal, IdServicio) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EspecialidadAsignarController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				especialidades: {}
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

			function asignar(pEspecialidad) {
				$log.debug('especialidad', pEspecialidad.Id + ' ' + IdSucursal + ' ' + IdServicio);

				ModalService.confirm('¿Desea asignar la especialidad ' + pEspecialidad.Nombre + ' al servicio?',
					function (pResult) {
						if (pResult) {


							EspecialidadMedicaDataService.validarAsignarAServicio(IdServicio, IdSucursal, pEspecialidad.Id)
								.then(function (pResponse) {

									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										EspecialidadMedicaDataService.asignarAServicio(IdServicio, IdSucursal, pEspecialidad.Id)
											.then(function (pResp) {
												vm.formControl.loading = true;
												ModalService.success("Especialidad Asignada");
												activate();
											}).catch(function (pErr) {
												vm.formControl.loading = false;
												ModalService.error("Error de servidor");
												$log.error('ValidacionAsignar .-', pErr);
											});
									} else {
										if (pResponse.Message !== null)
											ModalService.error(pResponse.Message);
										else
											ModalService.error("Error de servidor");
										vm.formControl.loading = false;

									}
								})
								.catch(function (pError) {
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
				if (vm.filter.id === null)
					vm.filter.id = '';

				if (vm.filter.nombrePrestacion === null)
					vm.filter.nombrePrestacion = '';

				vm.order = {
					id: 1,
					value: 'Codigo',
					descripcion: 'Codigo (Asc)',
					reverse: false
				};

			}


			function getPage() {

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.especialidades = orderByFilter(vm.data.especialidades, vm.order.value, vm.order.reverse);

				vm.filter.especialidades = $filter('filter')
					(vm.data.especialidades, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombrePrestacion

					});

				vm.paginacion.totalItems = vm.filter.especialidades.length;
				vm.filter.especialidades = vm.filter.especialidades.slice(begin, end);
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {

				vm.formControl.loading = true;
				vm.formControl.stateLoading = true;

				EspecialidadMedicaDataService.getAll()
					.then(activateOk, activateError);

				function activateOk(pResults) {

					vm.data.especialidades = pResults;
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

		}
	};

	return module;

})();