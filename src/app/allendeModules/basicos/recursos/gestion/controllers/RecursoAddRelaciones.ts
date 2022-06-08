/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('RecursoAddRelaciones', RecursoAddRelaciones);

		// Inyección de Dependencia
		RecursoAddRelaciones.$inject = ['Logger', '$filter', 'orderByFilter', '$q', '$uibModalInstance',
			'PrestacionGestionLogicService',
			'PrestacionGestionDataService',
			'EspecialidadMedicaDataService',
			'EspecialidadMedicaLogicService',
			'ModalService',
			'RecursoXServicio',
			'IdSucursal',
			'IdServicio',
			'ViewSelector'
		];

		// Constructor del Controller
		function RecursoAddRelaciones($log, $filter, orderByFilter, $q, $uibModalInstance,
			PrestacionGestionLogicService,
			PrestacionGestionDataService,
			EspecialidadMedicaDataService,
			EspecialidadMedicaLogicService,
			ModalService,
			RecursoXServicio,
			IdSucursal,
			IdServicio,
			ViewSelector) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RecursoAddRelaciones');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				recurso_servicio: RecursoXServicio,
				prestaciones: [],
				especialidades: [],
				idSucursal: IdSucursal,
				idServicio: IdServicio
			};


			vm.formControl = {
				loadingCalle: false,
				error: true,
				loading: false,
				ok: ok,
				cancel: cancel,
				viewSelector: ViewSelector

			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.prestacion = {
				asignar: asignarPrestacion,
				desactivar: desactivarPrestacion,
				delete: deletePrestacion
			};

			vm.especialidad = {
				asignar: asignarEspecialidad,
				desactivar: desactivarEspecialidad,
				delete: deleteEspecialidad
			};

			vm.filter = {
				Nombre: '',
				Codigo: '',
				tipoRecurso: '',
				nombreRecurso: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------ */

			function cancel() {
				$uibModalInstance.close('close');
			}

			/* -------------------------------------IMPLEMENTACION PRESTACION-------------------------------- */

			function desactivarPrestacion(pPrestacion) {

				$log.debug('desactivarPrestacion: ', pPrestacion);


				PrestacionGestionLogicService.activarDesactivarPrestacionDelRecurso(pPrestacion)
					.then(success, error);

				function success(pOk) {
					$log.debug('activarDesactivarPrestacion .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('activarDesactivarPrestacion .-', pError);
				}
			}

			function deletePrestacion(pPrestacion) {


				$log.debug('deletePrestacion: ', pPrestacion);


				PrestacionGestionLogicService.deleteRelacionRecurso(pPrestacion)
					.then(success, error);

				function success(pOk) {
					$log.debug('deletePrestacion .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('deletePrestacion .-', pError);

				}
			}

			function asignarPrestacion(pPrestacion) {

				$log.debug('asignarPrestacion', pPrestacion);

				if (pPrestacion.Activo === false) {
					ModalService.error("La Prestacion " + pPrestacion.Nombre + " esta desactivada");
				} else {

					ModalService.confirm('¿Desea asignar la Prestacion ' + pPrestacion.Nombre + ' al Recurso ' +
						vm.data.recurso_servicio.Nombre + '?',
						function(pResult) {
							if (pResult) {


								PrestacionGestionDataService.validarAsignarARecurso(pPrestacion.Id,
										vm.data.recurso_servicio.Id)
									.then(function(pResponse) {
										$log.debug('ValidacionAsignar .-', pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											PrestacionGestionDataService.asignarARecurso(pPrestacion.Id,
													vm.data.recurso_servicio.Id)
												.then(function(pResp) {
													vm.formControl.loading = true;
													ModalService.success("Prestacion Asignada a Recurso");
													$uibModalInstance.close('close');
												}).catch(function(pErr) {
													vm.formControl.loading = false;
													ModalService.error("Error de servidor");
													$log.error('ValidacionAsignar .-', pErr);
												});
										} else {
											if (pResponse.Message !== null) {
												$log.error('pResponse.Message .-', pResponse);

												ModalService.error(pResponse.Message);
											} else
												ModalService.error("Error de servidor");
											vm.formControl.loading = false;
											$uibModalInstance.close('close');

										}
									})
									.catch(function(pError) {
										vm.formControl.loading = false;

										$log.error('ValidacionAsignar .-', pError);
									});
							}
						});
				}
			}

			/* -------------------------------------IMPLEMENTACION ESPECIALIDAD-------------------------------- */

			function desactivarEspecialidad(pEspecialidad) {

				$log.debug('desactivarEspecialidad: ', pEspecialidad);


				EspecialidadMedicaLogicService.activarDesactivarDelRecurso(pEspecialidad)
					.then(success, error);

				function success(pOk) {
					$log.debug('activarDesactivarEspecialidad .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('activarDesactivarEspecialidad .-', pError);

				}

			}

			function deleteEspecialidad(pEspecialidad) {


				$log.debug('deleteEspecialidad: ', pEspecialidad);


				EspecialidadMedicaLogicService.deleteRelacionRecurso(pEspecialidad)
					.then(success, error);

				function success(pOk) {
					$log.debug('deleteEspecialidad .-', pOk);
					activate();
				}

				function error(pError) {
					$log.debug('deleteEspecialidad .-', pError);

				}
			}

			function asignarEspecialidad(pEspecialidad) {

				$log.debug('asignarEspecialidad', pEspecialidad);

				if (pEspecialidad.Activo === false) {
					ModalService.error("La Especialidad " + pEspecialidad.Nombre + " esta desactivada");
				} else {

					ModalService.confirm('¿Desea asignar la Especialidad ' + pEspecialidad.Nombre + ' al Recurso ' +
						vm.data.recurso_servicio.Nombre + '?',
						function(pResult) {
							if (pResult) {


								EspecialidadMedicaDataService.validarAsignarARecurso(pEspecialidad.Id,
										vm.data.recurso_servicio.Id)
									.then(function(pResponse) {
										$log.debug('ValidacionAsignar .-', pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											EspecialidadMedicaDataService.asignarARecurso(pEspecialidad.Id,
													vm.data.recurso_servicio.Id)
												.then(function(pResp) {
													vm.formControl.loading = true;
													ModalService.success("Especialidad Asignada a Recurso");
													$uibModalInstance.close('close');
												}).catch(function(pErr) {
													vm.formControl.loading = false;
													ModalService.error("Error de servidor");
													$log.error('ValidacionAsignar .-', pErr);
												});
										} else {
											if (pResponse.Message !== null) {
												$log.error('pResponse.Message .-', pResponse);

												ModalService.error(pResponse.Message);
											} else
												ModalService.error("Error de servidor");
											vm.formControl.loading = false;
											$uibModalInstance.close('close');

										}
									})
									.catch(function(pError) {
										vm.formControl.loading = false;

										$log.error('ValidacionAsignar .-', pError);
									});

							}
						});
				}
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
				if (vm.filter.id === null)
					vm.filter.id = '';

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
				vm.data.prestaciones = orderByFilter(vm.data.prestaciones, vm.order.value, vm.order.reverse);

				vm.filter.prestaciones = $filter('filter')
					(vm.data.prestaciones, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombreRecurso,
						TipoRecurso: vm.filter.tipoRecurso

					});

				vm.paginacion.totalItems = vm.filter.prestaciones.length;
				vm.filter.prestaciones = vm.filter.prestaciones.slice(begin, end);
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {

				vm.formControl.loading = true;
				vm.formControl.stateLoading = true;


				var _prestaciones;
				var _especialidades;


				if (vm.formControl.viewSelector == 'ver') {

					$log.debug('data obtenida selector OK.-', vm.formControl.viewSelector);

					_prestaciones = PrestacionGestionDataService.obtenerPrestacionXRecurso(vm.data.recurso_servicio.IdRecurso);
					_especialidades = EspecialidadMedicaDataService.obtenerEspecialidadXRecurso(vm.data.recurso_servicio.Id);

				} else if (vm.formControl.viewSelector == 'asignar') {

					$log.debug('data obtenida selector OK.-', vm.formControl.viewSelector);

					_prestaciones = PrestacionGestionDataService.obtenerPorServicioEnSucursal(vm.data.idSucursal,
						vm.data.idServicio);
					_especialidades = EspecialidadMedicaDataService.obtenerPorServicioEnSucursal(vm.data.idSucursal,
						vm.data.idServicio);

				}

				$q.all([_prestaciones, _especialidades])
					.then(activateOk, activateError);


				function activateOk(pResults) {

					if(pResults[0].length !== 0)
					vm.data.prestaciones = pResults[0];
					if(pResults[1].length !== 0)
					vm.data.especialidades = pResults[1];
					$log.debug('Inicializar OK.-', pResults);

					cleanFilters();
					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 6;
					//vm.paginacion.getPage();
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