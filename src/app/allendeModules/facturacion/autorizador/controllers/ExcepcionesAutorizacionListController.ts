/**
 * @author 			pferrer
 * @description 	description
 */
import { ISupportDataService } from '../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('ExcepcionesAutorizacionListController', ExcepcionesAutorizacionListController);

		// Inyección de Dependencia
		ExcepcionesAutorizacionListController.$inject = ['$log', '$q', '$scope', '$state', 'ModalService',
			'SupportDataService', 'SupportLogicService', 'User',
			'AutorizadorDataService', 'AutorizadorAuthService', 'AlertaService'
		];

		// Constructor del Controller
		function ExcepcionesAutorizacionListController($log, $q, $scope, $state, ModalService,
			SupportDataService: ISupportDataService, SupportLogicService, User,
			AutorizadorDataService, AutorizadorAuthService, AlertaService) {

			//$log.debug('ExcepcionesAutorizacionListController: ON.-');

			// En this va lo que se modifica de la vista (VM: ViewModel)	
			var vm = this;

			vm.user = User;
			vm.title = {
				icon: 'LIST',
				name: 'Lista Excepciones'
			};

			vm.data = {
				excepciones: [],
				mutual: [],
				tiposExcepciones: [],
				practica: []
			};

			vm.filter = {
				excepciones: [],
				tipoExcepcion: '',
				codigoPractica: '',
				nombrePractica: '',
				codigoMutual: '',
				nombreMutual: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 10,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate,
				editarExcepcion: editarExcepcion,
				eliminarExcepcion: eliminarExcepcion,

				buscarExcepciones: buscarExcepciones,
				/*PRACTICA*/
				buscarPracticas: buscarPracticas,
				buscarPractica: buscarPractica,
				buscarPracticaEnter: buscarPracticaEnter,
				/*MUTUAL*/
				buscarMutuales: buscarMutuales,
				buscarMutual: buscarMutual,
				buscarMutualEnter: buscarMutualEnter,

				visibilidadFiltros: visibilidadFiltros,
				volver : volver
			};

			vm.validar = {
				puedeAgregar: validarPuedeEditar,
				puedeEditar: validarPuedeEditar,
				puedeEliminar: validarPuedeEditar
			};

			function editarExcepcion(pIdExcepcion) {				
				if (AutorizadorAuthService.puedeEditarExcepcion(User)) {

					if (pIdExcepcion == null) {
						AutorizadorDataService.newExcepcion()
							.then(function(result) {
								AutorizadorDataService.excepcion = result;
								if (vm.data.mutual != null) {
									AutorizadorDataService.excepcion.Mutual = vm.data.mutual;
								}
								guardarFiltrosDeBusqueda();
								$state.go('facturacion.autorizador.excepciones.editar');
							})
							.catch(function(pError) {
								ModalService.error(pError.message);
								return;
							});
					} else {
						AutorizadorDataService.getExcepcionById(pIdExcepcion)
							.then(function(result) {
								AutorizadorDataService.excepcion = result;
								guardarFiltrosDeBusqueda();	
								$state.go('facturacion.autorizador.excepciones.editar');
							})
							.catch(function(pError) {
								ModalService.error(pError.message);
								return;
							});
					}

				} else AlertaService.NewWarning("Sin permiso", "Atencion, usted no tiene permiso para realizar esta accion");
			}

			vm.sort = function(keyname) {
				$scope.sortKey = keyname; 
				$scope.reverse = !$scope.reverse; 
			}

			function eliminarExcepcion(pIdExcepcion) {

				if (AutorizadorAuthService.puedeEditarExcepcion(User)) {

					ModalService.confirm('¿Está seguro que desea eliminar el registro seleccionado?',
					function(pResult) {
						if (pResult) {
							AutorizadorDataService.deleteExcepcion(pIdExcepcion)
								.then(function(result) {
									buscarExcepciones();
								})
								.catch(function(pError) {
									ModalService.error(pError.message);
									return;
								});
						}
					});

				}else AlertaService.NewWarning("Sin permiso", "Atencion, usted no tiene permiso para realizar esta accion");

			}

			function visibilidadFiltros() {
				if(!vm.filter.tipoExcepcion){
					return;
				}
				if (vm.filter.tipoExcepcion.Id == 1) {
					vm.filter.visiblePlan = false;
					vm.filter.visibleSucursal = false;
					vm.filter.visibleProfesional = false;
					vm.filter.visiblePractica = true;
					vm.filter.visibleServicio = false;
				}
				if (vm.filter.tipoExcepcion.Id == 3) {
					vm.filter.visiblePlan = false;
					vm.filter.visibleSucursal = true;
					vm.filter.visibleProfesional = true;
					vm.filter.visiblePractica = false;
					vm.filter.visibleServicio = false;
				}
			}

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */


			function validarPuedeEditar() {
				return AutorizadorAuthService.puedeEditarExcepcion(User);
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				/*PRACTICA*/
				vm.filter.codigoPractica = '';
				vm.filter.nombrePractica = '';
				/*MUTUAL*/
				vm.filter.codigoMutual = '';
				vm.filter.nombreMutual = '';

				vm.data.practica = null;
				vm.data.mutual = null;
				vm.filter.tipoExcepcion = null;

				vm.paginacion.currentPage = 1;
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				/*PRACTICA*/
				if (vm.filter.codigoPractica == null)
					vm.filter.codigoPractica = '';
				if (vm.filter.nombrePractica == null)
					vm.filter.nombrePractica = '';
				/*MUTUAL*/
				if (vm.filter.codigoMutual == null)
					vm.filter.codigoMutual = '';
				if (vm.filter.nombreMutual == null)
					vm.filter.nombreMutual = '';
			}

			function getPage() {
				var cantidadRegistros = vm.data.excepciones.length;
				var cantidadPaginas = cantidadRegistros / vm.paginacion.pageSize;

				if (cantidadPaginas - cantidadPaginas > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;

				vm.filter.validar();
				vm.filter.excepciones = vm.data.excepciones;
				vm.paginacion.totalItems = vm.filter.excepciones.length;
				vm.filter.excepciones = vm.filter.excepciones.slice(begin, end);
			}

			/* BUSCADOR EXCEPCIONES */

			function buscarExcepciones() {
				vm.formControl.loading = true;

				var idTipoExc = 0;
				if (vm.filter.tipoExcepcion != null && vm.filter.tipoExcepcion != '')
					idTipoExc = vm.filter.tipoExcepcion.Id;

				var idMut = 0;
				if (vm.data.mutual != null)
					idMut = vm.data.mutual.Id;

				var idPracticaMedica = 0;
				if (vm.data.practica != null)
					idPracticaMedica = vm.data.practica.id_practica_medica;

				AutorizadorDataService.getAllExcepcionesByFiltro(idTipoExc, idMut, idPracticaMedica).then(function(results) {
					vm.data.excepciones = results;
					vm.filter.excepciones = vm.data.excepciones;
					getPage();
					vm.formControl.loading = false;
				})
				.catch(function(pError) {
					vm.formControl.loading = false;
					ModalService.error(pError.message);
				});
			};

			function guardarFiltrosDeBusqueda() {
				AutorizadorDataService.tipoExcepcionFiltroBusqueda = vm.filter.tipoExcepcion;							    
			    AutorizadorDataService.currentPageFiltroBusqueda = vm.paginacion.currentPage;
			    AutorizadorDataService.codigoMutualFiltroBusqueda = vm.filter.codigoMutual;
			    AutorizadorDataService.nombreMutualFiltroBusqueda = vm.filter.nombreMutual;
			    AutorizadorDataService.mutualFiltroBusqueda = vm.data.mutual;
				AutorizadorDataService.codigopracticaMedicaFiltroBusqueda = vm.filter.codigoPractica;			
				AutorizadorDataService.nombrepracticaMedicaFiltroBusqueda = vm.filter.nombrePractica;			
				AutorizadorDataService.practicaMedicaFiltroBusqueda = vm.data.practica;			
			}

			/* BUSCADOR PRACTICAS */

			function buscarPracticas() {
				SupportDataService.entidadesBuscador = AutorizadorDataService.getAllPracticaMedica();
				SupportDataService.tituloBuscador = 'Seleccionar Práctica';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Codigo';
				SupportDataService.tituloNombreBuscador = 'Práctica';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function(result) {
						vm.filter.codigoPractica = result.codigo_practica_medica;
						vm.filter.nombrePractica = result.nombre_practica_medica;
						vm.data.practica = result;
					})
					.catch(function(pError) {
						limpiarFiltroPracticas();
						return;
					});
			};

			function buscarPractica() {
				if (vm.filter.codigoPractica != null && vm.filter.codigoPractica != '') {
					AutorizadorDataService.getPracticaByCodigo(vm.filter.codigoPractica).then(function(result) {
						if (result == null) {
							limpiarFiltroPracticas();
						} else {
							vm.filter.codigoPractica = result.codigo_practica_medica;
							vm.filter.nombrePractica = result.nombre_practica_medica;
							vm.data.practica = result;
						}
					})
					.catch(function(pError) {
						ModalService.error(pError.message);
						limpiarFiltroPracticas();
					});
				} else {
					limpiarFiltroPracticas();
				}
			}

			function buscarPracticaEnter(keyEvent) {
				if (keyEvent.which === 13)
					buscarPractica();
			}

			function limpiarFiltroPracticas() {
				vm.filter.codigoPractica = '';
				vm.filter.nombrePractica = '';
				vm.data.practica = null;
			}

			/* BUSCADOR MUTUALES */

			function buscarMutuales() {
				SupportDataService.entidadesBuscador = AutorizadorDataService.getAllMutualConAutorizadorNoHijas();
				SupportDataService.tituloBuscador = 'Seleccionar Mutual';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Codigo';
				SupportDataService.tituloNombreBuscador = 'Mutual';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function(result) {
						vm.filter.codigoMutual = result.Codigo;
						vm.filter.nombreMutual = result.Nombre;
						vm.data.mutual = result;
					})
					.catch(function(pError) {
						limpiarFiltroMutuales();
						return;
					});
			};

			function buscarMutual() {
				if (vm.filter.codigoMutual != null && vm.filter.codigoMutual != '') {
					AutorizadorDataService.getMutualByCodigo(vm.filter.codigoMutual)
					.then(function(result) {
						if (result == null) {
							limpiarFiltroMutuales();
						} else {
							vm.filter.codigoMutual = result.Codigo;
							vm.filter.nombreMutual = result.Nombre;
							vm.data.mutual = result;
						}
					})
					.catch(function(pError) {
						ModalService.error(pError.message);
						limpiarFiltroMutuales();
					});
				} else {
					limpiarFiltroMutuales();
				}
			}

			function buscarMutualEnter(keyEvent) {
				if (keyEvent.which === 13)
					buscarMutual();
			}

			function limpiarFiltroMutuales() {
				vm.filter.codigoMutual = '';
				vm.filter.nombreMutual = '';
				vm.data.mutual = null;
			}

			function volver(){
				$state.go('homesistemas');
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {

				vm.formControl.loading = true;

				var _tiposExcepciones = AutorizadorDataService.getAllTipoExcepciones().then(function(results){
					vm.data.tiposExcepciones = results;
					vm.formControl.error = false;
					vm.formControl.loading = false;
					cleanFilters();
					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 10;
					vm.formControl.loading = false;

					visibilidadFiltros();

					if (AutorizadorDataService.excepcion != null) {

						if (AutorizadorDataService.tipoExcepcionFiltroBusqueda != null){
							vm.filter.tipoExcepcion = AutorizadorDataService.tipoExcepcionFiltroBusqueda;
						}
						if (AutorizadorDataService.codigoMutualFiltroBusqueda != null){
							vm.filter.codigoMutual = AutorizadorDataService.codigoMutualFiltroBusqueda;
						}
						if (AutorizadorDataService.nombreMutualFiltroBusqueda != null){
							vm.filter.nombreMutual = AutorizadorDataService.nombreMutualFiltroBusqueda;
						}
						if (AutorizadorDataService.mutualFiltroBusqueda != null){
							vm.data.mutual = AutorizadorDataService.mutualFiltroBusqueda;
						}
						if (AutorizadorDataService.codigopracticaMedicaFiltroBusqueda != null) {
							vm.filter.codigoPractica = AutorizadorDataService.codigopracticaMedicaFiltroBusqueda;
						}
						if (AutorizadorDataService.nombrepracticaMedicaFiltroBusqueda != null) {
							vm.filter.nombrePractica = AutorizadorDataService.nombrepracticaMedicaFiltroBusqueda;
						}
						if (AutorizadorDataService.practicaMedicaFiltroBusqueda != null) {
							vm.data.practica = AutorizadorDataService.practicaMedicaFiltroBusqueda;
						}
						
						vm.paginacion.currentPage = 1

						buscarExcepciones();

						if (AutorizadorDataService.currentPageFiltroBusqueda != null)
							vm.paginacion.currentPage = AutorizadorDataService.currentPageFiltroBusqueda;

						AutorizadorDataService.tipoExcepcionFiltroBusqueda = null;
						AutorizadorDataService.currentPageFiltroBusqueda = null;
						AutorizadorDataService.codigoMutualFiltroBusqueda = null;	
						AutorizadorDataService.nombreMutualFiltroBusqueda = null;	
						AutorizadorDataService.mutualFiltroBusqueda = null;	
						AutorizadorDataService.codigopracticaMedicaFiltroBusqueda = null;
						AutorizadorDataService.nombrepracticaMedicaFiltroBusqueda = null;
						AutorizadorDataService.practicaMedicaFiltroBusqueda = null;
					
						AutorizadorDataService.excepcion = null;
					}
				});
			}

			function activateError(pError) {
				ModalService.error(pError.message);
			}

		}

	};

	return module;
})();