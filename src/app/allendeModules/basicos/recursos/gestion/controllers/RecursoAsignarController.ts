/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('RecursoAsignarController', RecursoAsignarController);

		// Inyección de Dependencia
		RecursoAsignarController.$inject = ['Logger', '$filter', 'orderByFilter', '$q', '$uibModalInstance', 'RecursosDataService',
			'ModalService', 'IdSucursal', 'IdServicio'
		];

		// Constructor del Controller
		function RecursoAsignarController($log, $filter, orderByFilter, $q, $uibModalInstance, RecursosDataService,
			ModalService, IdSucursal, IdServicio) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RecursoAsignarController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				recursos: {},
				tipoRecursos: {}
			};

			vm.checkbox = {
			};

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

			vm.recurso = {
				asignar: asignar
			};

			vm.filter = {
				Nombre: '',
				Codigo: '',
				tipoRecurso: '',
				nombreRecurso: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */


			function cancel() {
				$uibModalInstance.close('close');
			}

			function asignar(pRecurso) {
				$log.debug('recurso', pRecurso);


				ModalService.confirm('¿Desea asignar el recurso ' + pRecurso.Nombre + ' al servicio?',
					function(pResult) {
						if (pResult) {


							RecursosDataService.validarAsignarAServicio(IdServicio, IdSucursal, pRecurso.Id, pRecurso.IdTipo)
								.then(function(pResponse) {

									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										RecursosDataService.asignarAServicio(IdServicio, IdSucursal, pRecurso.Id, pRecurso.IdTipo)
											.then(function(pResp) {
												vm.formControl.loading = true;
												ModalService.success("Recurso Asignado");
												activate();
											}).catch(function(pError) {
												vm.formControl.loading = false;
												ModalService.error("Error de servidor");
												$log.error('ValidacionAsignar .-', pError);
											});
									} else {
										if (pResponse.Message !== null) {
											$log.error('pResponse.Message .-', pResponse);

											ModalService.error(pResponse.Message);
										} else
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
				vm.filter.nombreRecurso = '';
				vm.filter.tipoRecurso = '';
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.id  === null)
					vm.filter.id  = '';

				if (vm.filter.nombreRecurso === null)
					vm.filter.nombreRecurso = '';

				if (vm.filter.tipoRecurso === null)
					vm.filter.tipoRecurso = '';


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
				vm.data.recursos = orderByFilter(vm.data.recursos, vm.order.value, vm.order.reverse);

				vm.filter.recursos = $filter('filter')
					(vm.data.recursos, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombreRecurso,
						TipoRecurso : vm.filter.tipoRecurso.Nombre

					});

				vm.paginacion.totalItems = vm.filter.recursos.length;
				vm.filter.recursos = vm.filter.recursos.slice(begin, end);
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {

				vm.formControl.loading = true;
				vm.formControl.stateLoading = true;

				var _recursos = RecursosDataService.getAll();
				var _tipoRecursos = RecursosDataService.getAllTipos();

				$q.all([_recursos, _tipoRecursos])
					.then(activateOk, activateError);


				function activateOk(pResults) {

					vm.data.recursos = pResults[0];
					vm.data.tipoRecursos = pResults[1];
					$log.debug('Inicializar OK.-', pResults);

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