 import { ISucursalDataService } from '../../../../../allendeModules/support/basic/services';
 import { servicioDto } from '../models';
 
 /**
 * @author 			ppautasso
 * @description 	Controller para ABM de servicios medicos
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };
	module.init = function(module) {
		module.controller('ServiciosGestionListController', ServiciosGestionListController);
		// Inyeccion de dependencia
		ServiciosGestionListController.$inject = ['$filter', 'orderByFilter', 'Logger', '$q',
			'ServiciosGestionDataService', 'ServiciosGestionLogicService', 'SupportLogicService',
			'ModalService', 'ServiciosGestionAuthService', 'SucursalDataService', 'AlertaService', 'User'
		];
		// Constructor del Controller
		function ServiciosGestionListController($filter, orderByFilter, $log, $q,
			ServiciosGestionDataService, ServiciosGestionLogicService, SupportLogicService,
			ModalService, ServiciosGestionAuthService, SucursalDataService: ISucursalDataService, AlertaService, User
		) {
			/* ------------------------------------------ LOG ------------------------------------------ */
			$log = $log.getInstance('ServiciosGestionListController');
			$log.debug('ON.-');
			/* -------------------------------------- API Y VARIABLES ---------------------------------- */
			var vm = this;
			vm.title = {
				page: 'Gestion de Servicios Medicos'
			};
			vm.order = {
				value: '',
				reverse: false
			};
			//vm.listOrderBy = HABITACION_ORDER;
			vm.formControl = {
				esAll: false,
				loading: false,
				stateLoading: false,
				reloadPage: activate,
				getCol: getCol,
				nombreServicio : '',
				buscar : buscar,
				buscarPagina : buscarPagina,
				limpiarFiltros: limpiarFiltros
			};
			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};
			vm.servicio = {
				new: newServicio,
				view: verServicio,
				edit: editServicio,
				delete: deleteServicio,
				asignar: asignarServicio
			};
			vm.data = {
				servicios: {},
				sucursal: {},
				sucursales: {},
				filtroServicioDTO : servicioDto,
				listadoServicio: {}
			};
			vm.filter = {
				id: '',
				clean: cleanFilters,
				validar: validarFilters
			};
			vm.sucursal = {
				open: openSucursalSelector
			};
			vm.validar = {
				puedeVer: validarPuedeVer,
				puedeAgregar: validarPuedeAgregar,
				puedeEditar: validarPuedeEditar,
				puedeEliminar: validarPuedeEliminar,
				puedeAsignar: validarPuedeAsignar
			};
			vm.table = {
				export : exportarTable
			};

	
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			/* FORMULARIO */
			function getCol(servicioStatus) {
				//$log.debug('getColorStatus OK.-', servicioStatus);
				switch (servicioStatus) {
					case true:
						return 'color-verde';
					case false:
						return 'color-rojo';
					default:
						return '';
				}
			}

			function verServicio(pServicio) {

				$log.debug('verServicio OK.-');

				// if (ServiciosGestionAuthService.puedeVerServicio(User)) {
				// 	if (pServicio.Sucursales.length > 0) {
				// 		var sucursalesArray = [];
				// 		var sucursalesArray = pServicio.Sucursales.map(function(item) {
				// 			return item.IdSucursal;
				// 		});
				// 		SupportLogicService.openSucursalOptionalSelector(sucursalesArray, true)
				// 			.then(successCallback, errorCallbackModal);
				// 	} else {
				// 		AlertaService.NewWarning("Aviso","Atencion! Servicio sin sucursal.");
				// 	}
				// }

				// function successCallback(pSucursal) {
				// 	$log.debug('successCallbackSucursal OK.-', pSucursal);
				// 	vm.data.sucursal = pSucursal;
				// 	ServiciosGestionLogicService.IdServicio = pServicio.Id;
				// 	ServiciosGestionLogicService.NombreServicio = pServicio.Nombre;
				// 	ServiciosGestionLogicService.IdSucursal = pSucursal.id_sucursal;
				// 	ServiciosGestionLogicService.NombreSucursal = pSucursal.descripcion;
				// 	$state.go('basico.serviciomedico.gestion.listall');
				// }

				// function errorCallbackModal(pError) {
				// 	$log.error('errorCallbackModal OK.-', pError);
				// }
			}

			function newServicio() {
				$log.debug('newServicio OK.-');
				if (ServiciosGestionAuthService.puedeAgregarServicio(User)) {
					ServiciosGestionLogicService.newServicio()
						.then(newServicioOk, newServicioError);
				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");

				function newServicioOk(pResult) {
					activate();
				}

				function newServicioError(pError) {
					$log.error('newServicio OK.-', pError);
				}
			}

			function editServicio(pServicio) {
				$log.debug('editServicio OK.-');
				if (ServiciosGestionAuthService.puedeEditarServicio(User)) {
					var _id = pServicio.Id;
					ServiciosGestionLogicService.editServicio(_id)
						.then(editServicioOk, editServicioError);
				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");

				function editServicioOk(pResult) {
					activate();
				}

				function editServicioError(pError) {
					$log.error('editServicio OK.-', pError);
				}
			}

			function deleteServicio(pServicio) {
				$log.debug('deleteHabitacion OK.-');
				if (ServiciosGestionAuthService.puedeEliminarServicio(User)) {
					
					ModalService.confirm('¿Desea eliminar el servicio ' + pServicio.Nombre + '?',
						function(pResult) {
							if (pResult) {
								vm.formControl.loading = true;
								ServiciosGestionDataService.validarDeleteServicio(pServicio.Id)
									.then(function(pResponse) {
										$log.debug("ValidacionEliminar", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											ServiciosGestionDataService.deleteServicio(pServicio.Id)
												.then(function(pResp) {
													vm.formControl.loading = true;
													AlertaService.NewSuccess("", "Servicio Borrado");
													buscar();
												}).catch(function(pErr) {
													vm.formControl.loading = false;
													$log.error('ValidacionEliminar .-', pErr);
												});
										} else {
											if (pResponse.Message != null)
												AlertaService.NewError("Error", pResponse.Message);
												
											else
												AlertaService.NewError("", "Error de servidor");
												
											vm.formControl.loading = false;
										}
									})
									.catch(function(pError) {
										vm.formControl.loading = false;
										$log.error('ValidacionEliminar .-', pError);
									});
							}
						});
				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");
			}

			function asignarServicio(pServicio) {
				if (ServiciosGestionAuthService.puedeAsignarServicio(User)) {
					var sucursalesArray = [];
					sucursalesArray = pServicio.Sucursales.map(function(item) {
						return item.IdSucursal;
					});
					SupportLogicService.openSucursalOptionalSelector(sucursalesArray, false)
						.then(successCallback, errorCallbackModal);
				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");

				function successCallback(pSucursal) {
					$log.debug('successCallbackSucursal OK.-', pSucursal);
					vm.data.sucursal = pSucursal;
					ModalService.confirm('¿Desea asignar el servicio ' + pServicio.Nombre + ' a la sucursal ' + pSucursal.descripcion + '?',
						function(pResult) {
							if (pResult) {
								vm.formControl.loading = true;
								ServiciosGestionDataService.ValidarAsignarASucursal(pServicio.Id, pSucursal.id_sucursal)
									.then(function(pResponse) {
										$log.debug("ValidacionAsignacion response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											ServiciosGestionDataService.AsignarServicioASucursal(pServicio.Id, pSucursal.id_sucursal)
												.then(function(pResp) {
													vm.formControl.loading = true;
													AlertaService.NewSuccess("","Servicio Asignado");
													
													activate();
												}).catch(function(pErr) {
													vm.formControl.loading = false;
													$log.error('ValidacionAsignacion .-', pErr);
												});
										} else {
											if (pResponse.Message != null)
												AlertaService.NewError("", pResponse.Message);
											else
												AlertaService.NewError("","Error");
											vm.formControl.loading = false;
										}
									})
									.catch(function(pError) {
										vm.formControl.loading = false;
										$log.error('ValidacionAsignacion error.-', pError);
									});
							}
						});
				}

				function errorCallbackModal(pError) {
					$log.error('errorCallbackModal OK.-', pError);
				}
			}
			/* VALIDACION */
			/**
			 * validamos todas las operaciones con los permisos
			 */
			function validarPuedeVer() {
				return ServiciosGestionAuthService.puedeVerServicio(User);
			}

			function validarPuedeAgregar() {
				return ServiciosGestionAuthService.puedeAgregarServicio(User);
			}

			function validarPuedeEditar() {
				return ServiciosGestionAuthService.puedeEditarServicio(User);
			}

			function validarPuedeEliminar() {
				return ServiciosGestionAuthService.puedeEliminarServicio(User);
			}

			function validarPuedeAsignar() {
				return ServiciosGestionAuthService.puedeAsignarServicio(User);
			}
			/* PAGINACIÓN */
			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.nombre = '';
				vm.order = {};
				vm.paginacion.pageChanged();
			}
			/**
			 * validamos los filtros.
			 * @return void
			 */
			function validarFilters() {
				if (vm.filter.id == null)
					vm.filter.id = '';
				if (vm.filter.nombre == null)
					vm.filter.nombre = '';
				vm.order = {
					id: 5,
					value: 'Id',
					descripcion: 'Id (Asc)',
					reverse: false
				};
			}
			/**
			 * configura la paginacion por los parametros de la misma
			 * @return void
			 */
			function getPage() {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.servicios = orderByFilter(vm.data.servicios, vm.order.value, vm.order.reverse);
				vm.filter.servicios = $filter('filter')
					(vm.data.servicios, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombre
					});
				vm.paginacion.totalItems = vm.filter.servicios.length;
				vm.filter.servicios = vm.filter.servicios.slice(begin, end);
			}

			function exportarTable(pExportation) {

				if (pExportation.isCsv()) {

					ServiciosGestionDataService.exportarListaToXls()
						.then(exportarOk, exportarError);
				}

				function exportarOk() {
					//vm.formControl.loading = false;
				}

				function exportarError(pError) {
					vm.formControl.loading = false;
					ModalService.error("Error: " + pError.message);
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			/**
			 * abrir selector de sucursal para elegir cualquiera
			 * @return object sucursal
			 */
			function openSucursalSelector() {
				$log.debug('OpenSucursalSelector ON.-');
				SupportLogicService.openSucursalSelector()
					.then(successCallback, errorCallbackModal);

				function successCallback(pSucursal) {
					$log.debug('successCallback OK.-');
					vm.data.sucursal = pSucursal;
					activate();
				}

				function errorCallbackModal(pError) {
					$log.error('errorCallbackModal OK.-', pError);
				}
			}


			
			function limpiarFiltros() {
				vm.formControl.nombreServicio = "";
			}


			function buscar() {
				buscarPagina(0);
			}


			function buscarPagina(pPaginacion) {
				vm.data.filtroServicioDTO.Nombre = vm.formControl.nombreServicio.toUpperCase();
				vm.data.filtroServicioDTO.CurrentPage = pPaginacion.currentPage || 1 ;
				vm.data.filtroServicioDTO.PageSize = pPaginacion.pageSize || 10;
		
				ServiciosGestionDataService.ObtenerPorFiltro(vm.data.filtroServicioDTO).then(function(respuestaServicio){
					vm.data.listadoServicio = respuestaServicio
					console.log('Respuesta Back', vm.data.listadoServicio);
				});

			}


			activate();
			/**
			 * activate, primera funcion llamada despues de la declaracion de variables
			 * 
			 */
			function activate() {
				//vm.formControl.loadin
				vm.formControl.loading = true;
				vm.formControl.stateLoading = true;
				if (vm.data.sucursal.id_sucursal === null) {
					vm.data.sucursal.id_sucursal = 1;
				}
				var _servicios = ServiciosGestionDataService.ObtenerTodosParaAsignar();
				var _sucursales = SucursalDataService.getAllSucursalesSinTodas();

				ServiciosGestionDataService.ObtenerNuevoFiltroBusqueda().then(function(filtroDto){
					vm.data.filtroServicioDTO = filtroDto
				});


				//obtengo datos del back sincronamente, dependiendo las variables antes declaradas
				$q.all([_servicios, _sucursales
						//,_sucursales
					])
					.then(activateOk, activateError);

				function activateOk(pResults) {
					//traje los datos correctamente y los asigno
					vm.data.servicios = pResults[0].map(servicio => {
						var listaSucursales = servicio.Sucursales.map(sucursal => sucursal.Sucursal);
						servicio.SucursalesString = listaSucursales.join("<br>");
						return servicio;
					});

					vm.data.sucursales = pResults[1];
					//declaro opciones de paginacion
					vm.paginacion.currentPage = 1; //pagina actual = 1 pagina
					vm.paginacion.pageSize = 6; //cantidad de elementos por paginacion
					vm.paginacion.getPage(); //llamo al getpage para filtrar por datos anteriores
					vm.formControl.loading = false; //false al loading para mostrar datos y ocultar el spin load
					vm.formControl.stateLoading = false;
					$log.debug('Inicializar OK.-',pResults);
				}

				function activateError(pError) {
					//error en tratar de obtener los datos hacia el back
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;
					$log.error('Inicializar ERROR.-', pError);
				}
			}
		}
	};
	return module;

})();