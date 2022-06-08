import * as angular from 'angular';
import { ISupportDataService } from '../../../support/basic/services';
import { IProfesionalesDataService } from '../../../profesionales';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('HomologacionesListController', HomologacionesListController);

		// Inyección de Dependencia
		HomologacionesListController.$inject = ['$log', '$q', '$filter', '$scope', '$state', 'ModalService',
			'SupportDataService', 'SupportLogicService', 'User', 'ProfesionalesDataService',
			'uiGridConstants', 'HomologacionesDataService', 'HomologacionesLogicService', 'HomologacionesAuthService','AlertaService'
		];

		// Constructor del Controller
		function HomologacionesListController($log, $q, $filter, $scope, $state, ModalService,
			SupportDataService: ISupportDataService, SupportLogicService, User, ProfesionalesDataService: IProfesionalesDataService,
			uiGridConstants, HomologacionesDataService, HomologacionesLogicService, HomologacionesAuthService,AlertaService
		) {

			//$log.debug('HomologacionesListController: ON.-');

			// En this va lo que se modifica de la vista (VM: ViewModel)				
			var vm = this;

			vm.user = User;
			vm.title = {
				module: "HOMOLOGACIONES",
				page: 'Lista Homologaciones'
			};

			vm.data = {
				homologaciones: [],
				sucursales: [],
				tiposDocumentos: [],
				mutual: '',
				organizacion: '',
				servicios: [],
				tiposHomologaciones: [],
				profesional: '',
				practica: ''
			};

			vm.filter = {
				homologaciones: [],
				sucursal: '',
				tipoDocumento: '',
				servicio: '',
				tipoHomologacion: '',
				matriculaProfesional: '',
				nombreProfesional: '',
				codigoPractica: '',
				nombrePractica: '',
				codigoOrganizacion: '',
				nombreOrganizacion: '',
				codigoMutual: '',
				nombreMutual: '',
				clean: cleanFilters,
				validar: validarFilters,
				visibleProfesional: true,
				visiblePractica: true,
				visibleServicio: true,
				visibleTipoDocumento: true
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 100,
				totalItems: 0,
				pageChanged: pageChanged
				//getPage: getPage
			};

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate,
				editarHomologacion: editarHomologacion,
				eliminarHomologacion: eliminarHomologacion,

				buscarHomologaciones: buscarHomologaciones,
				/*PROFESIONAL*/
				buscarProfesionales: buscarProfesionales,
				buscarProfesional: buscarProfesional,
				buscarProfesionalEnter: buscarProfesionalEnter,
				/*PRACTICA*/
				buscarPracticas: buscarPracticas,
				buscarPractica: buscarPractica,
				buscarPracticaEnter: buscarPracticaEnter,
				/*ORGANIZACION*/
				buscarOrganizaciones: buscarOrganizaciones,
				buscarOrganizacion: buscarOrganizacion,
				buscarOrganizacionEnter: buscarOrganizacionEnter,
				/*MUTUAL*/
				buscarMutuales: buscarMutuales,
				buscarMutual: buscarMutual,
				buscarMutualEnter: buscarMutualEnter,

				visibilidadFiltros: visibilidadFiltros,
				changeTipoHomologacion: changeTipoHomologacion
			};

			vm.validar = {
				puedeAgregar: validarPuedeEditar,
				puedeEditar: validarPuedeEditar,
				puedeEliminar: validarPuedeEditar
			};

			function editarHomologacion(pIdHomologacion) {
				guardarFiltrosDeBusqueda();

				HomologacionesDataService.tipoHomologacion = vm.filter.tipoHomologacion;
				if (HomologacionesAuthService.puedeEditarHomologacion(User)) {
					if (pIdHomologacion == null) {
						HomologacionesDataService.newHomologacion()
							.then(function(result) {
								HomologacionesDataService.homologacion = result;
								$state.go('financiadores.homologaciones.editar');
							})
							.catch(function(pError) {
								ModalService.error(pError.message);
								return;
							});
					} else {
						HomologacionesDataService.getHomologacionById(pIdHomologacion)
							.then(function(result) {
								HomologacionesDataService.homologacion = result;
								$state.go('financiadores.homologaciones.editar');
							})
							.catch(function(pError) {
								ModalService.error(pError.message);
								return;
							});
					}
				} else {

					AlertaService.NewWarning("Sin permiso", "Atencion, usted no tiene permiso para realizar esta accion");
				}
			}

			vm.sort = function(keyname) {
				$scope.sortKey = keyname; //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			}

			function changeTipoHomologacion() {
				cleanFilters();
				visibilidadFiltros();
			}

			function eliminarHomologacion(pIdHomologacion) {				
				if (HomologacionesAuthService.puedeEditarHomologacion(User)) {
					ModalService.confirm('¿Está seguro que desea eliminar el registro seleccionado?',
						function(pResult) {
							if (pResult) {
								HomologacionesDataService.deleteHomologacion(pIdHomologacion)
									.then(function(result) {
										buscarHomologaciones();
									})
									.catch(function(pError) {
										ModalService.error(pError.message);
										return;
									});
							}
						});
				}
			}

			function visibilidadFiltros() {				
				vm.filter.visibleProfesional = false;
				vm.filter.visiblePractica = false;
				vm.filter.visibleServicio = false;
				vm.filter.visibleTipoDocumento = false;

				/*Codigo Nomenclador*/
				if (vm.filter.tipoHomologacion.Id == 1) {
					vm.filter.visiblePractica = true;
					vm.filter.visibleServicio = true;
				}
				/*Tipo Documento*/
				if (vm.filter.tipoHomologacion.Id == 2) {
					vm.filter.visibleTipoDocumento = true;
				}
				/*Matricula Profesional*/
				if (vm.filter.tipoHomologacion.Id == 3) {
					vm.filter.visibleProfesional = true;
					vm.filter.visibleServicio = true;
				}
				/*Codigo Servicio*/
				if (vm.filter.tipoHomologacion.Id == 4) {
					vm.filter.visibleServicio = true;
				}
				/*Nombre Servicio*/
				if (vm.filter.tipoHomologacion.Id == 5) {
					vm.filter.visibleServicio = true;
				}
				// /*Codigo Emisor Autorizador*/
				// if (vm.filter.tipoHomologacion.Id == 6) {
				// }
				// /*Codigo Sucursal*/
				// if (vm.filter.tipoHomologacion.Id == 7) {
				// }
				// /*Nombre Sucursal*/
				// if (vm.filter.tipoHomologacion.Id == 8) {
				// }
			}

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function validarPuedeEditar() {
				return HomologacionesAuthService.puedeEditarHomologacion(User);
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				vm.filter.sucursal = '';
				vm.filter.servicio = '';
				/*PROFESIONAL*/
				vm.filter.matriculaProfesional = '';
				vm.filter.nombreProfesional = '';
				/*PRACTICA*/
				vm.filter.codigoPractica = '';
				vm.filter.nombrePractica = '';
				/*ORGANIZACION*/
				vm.filter.codigoOrganizacion = '';
				vm.filter.nombreOrganizacion = '';
				/*MUTUAL*/
				vm.filter.codigoMutual = '';
				vm.filter.nombreMutual = '';

				vm.filter.tipoDocumento = '';

				vm.data.profesional = null;
				vm.data.practica = null;
				vm.data.mutual = null;
				vm.data.organizacion = null;
				vm.filter.tipoDocumento = '';
				/*HOMOLOGACIONES*/
				delete vm.filter.homologaciones;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.sucursal == null)
					vm.filter.sucursal = '';
				if (vm.filter.servicio == null)
					vm.filter.servicio = '';
				/*PROFESIONAL*/
				if (vm.filter.matriculaProfesional == null)
					vm.filter.matriculaProfesional = '';
				if (vm.filter.nombreProfesional == null)
					vm.filter.nombreProfesional = '';
				/*PRACTICA*/
				if (vm.filter.codigoPractica == null)
					vm.filter.codigoPractica = '';
				if (vm.filter.nombrePractica == null)
					vm.filter.nombrePractica = '';
				/*ORGANIZACION*/
				if (vm.filter.codigoOrganizacion == null)
					vm.filter.codigoOrganizacion = '';
				if (vm.filter.nombreOrganizacion == null)
					vm.filter.nombreOrganizacion = '';
				/*MUTUAL*/
				if (vm.filter.codigoMutual == null)
					vm.filter.codigoMutual = '';
				if (vm.filter.nombreMutual == null)
					vm.filter.nombreMutual = '';
				if (vm.filter.tipoDocumento == null)
					vm.filter.tipoDocumento = '';
			}

			function pageChanged (pPage) {
				if(!angular.isUndefined(pPage) && pPage != null) {
					vm.paginacion.currentPage = pPage;
					buscarHomologaciones();
				}				
			}

			function guardarFiltrosDeBusqueda() {
				HomologacionesDataService.tipoHomologacionFiltroBusqueda = vm.filter.tipoHomologacion;				
			    HomologacionesDataService.tipoDocumentoFiltroBusqueda = vm.filter.tipoDocumento;
				HomologacionesDataService.sucursalFiltroBusqueda = vm.filter.sucursal;
				HomologacionesDataService.servicioFiltroBusqueda = vm.filter.servicio;
				
				HomologacionesDataService.codigoOrganizacionFiltroBusqueda = vm.filter.codigoOrganizacion;
				HomologacionesDataService.nombreOrganizacionFiltroBusqueda = vm.filter.nombreOrganizacion;
				HomologacionesDataService.organizacionFiltroBusqueda = vm.data.organizacion;
				
				HomologacionesDataService.matriculaProfesionalFiltroBusqueda = vm.filter.matriculaProfesional;
				HomologacionesDataService.nombreProfesionalFiltroBusqueda = vm.filter.nombreProfesional;
				HomologacionesDataService.profesionalFiltroBusqueda = vm.data.profesional;				
				
				HomologacionesDataService.currentPageFiltroBusqueda = vm.paginacion.currentPage;
				
				HomologacionesDataService.codigopracticaMedicaFiltroBusqueda = vm.filter.codigoPractica;
				HomologacionesDataService.nombrepracticaMedicaFiltroBusqueda = vm.filter.nombrePractica;
				HomologacionesDataService.practicaMedicaFiltroBusqueda = vm.data.practica;

				HomologacionesDataService.codigoMutualFiltroBusqueda = vm.filter.codigoMutual;
				HomologacionesDataService.nombreMutualFiltroBusqueda = vm.filter.nombreMutual;
				HomologacionesDataService.mutualFiltroBusqueda = vm.data.mutual;				
			}

			/* BUSCADOR HOMOLOGACIONES */

			function buscarHomologaciones() {

				vm.formControl.loading = true;

				var idMut = 0;
				if (vm.data.mutual != null && vm.data.mutual != '')
					idMut = vm.data.mutual.Id;

				var idOrg = 0;
				if (vm.data.organizacion != null)
					idOrg = vm.data.organizacion.Id;

				var idSuc = 0;
				if (vm.filter.sucursal != null && vm.filter.sucursal != '')
					idSuc = vm.filter.sucursal.Id;

				var idServ = 0;
				if (vm.filter.servicio != null && vm.filter.servicio != '')
					idServ = vm.filter.servicio.Id;

				var nroMatricula = 0;
				if (vm.data.profesional != null && vm.data.profesional != '')
					nroMatricula = vm.filter.matriculaProfesional;

				var idPracticaMedica = 0;
				if (vm.data.practica != null && vm.data.practica != '')
					idPracticaMedica = vm.data.practica.id_practica_medica;

				var idTipoDoc = 0;
				if (vm.filter.tipoDocumento != null && vm.filter.tipoDocumento != '')
					idTipoDoc = vm.filter.tipoDocumento.Id;

				var currentPage = 0;
				if (!angular.isUndefined(vm.paginacion.currentPage) && vm.paginacion.currentPage > 0) {
					currentPage = vm.paginacion.currentPage - 1;	
				}

				var _homologaciones = HomologacionesDataService.getAllHomologacionesByFiltro(vm.filter.tipoHomologacion.Id, idOrg, idMut, idSuc, idServ, 
					nroMatricula, idPracticaMedica, idTipoDoc, currentPage, vm.paginacion.pageSize);

				$q.all([_homologaciones])
					.then(function(results) {

						vm.data.homologaciones = results[0].Result;	
						vm.filter.homologaciones = vm.data.homologaciones;	
		 				vm.paginacion.pageSize = results[0].PageSize;
		 				vm.paginacion.totalItems = results[0].TotalCount;
						vm.formControl.loading = false;	
					})
					.catch(function(pError) {
						vm.formControl.loading = false;
						ModalService.error(pError.message);
					});
			};

			/* BUSCADOR PROFESIONALES */

			function buscarProfesionales() {
				SupportDataService.entidadesBuscador = ProfesionalesDataService.getAllProfesional();
				SupportDataService.tituloBuscador = 'Seleccionar Profesional';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Matricula';
				SupportDataService.tituloNombreBuscador = 'Profesional';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function(result) {
						vm.filter.matriculaProfesional = result.numero_matricula;
						vm.filter.nombreProfesional = result.nombre_completo;
						vm.data.profesional = result;
					})
					.catch(function(pError) {
						limpiarFiltroProfesionales();
					});
			};

			function buscarProfesional() {
				if (vm.filter.matriculaProfesional != null && vm.filter.matriculaProfesional != '') {
					var _profesional = ProfesionalesDataService.ProfesionalObtenerPorMatricula(vm.filter.matriculaProfesional);
					$q.all([_profesional])
						.then(function(result) {
							if (result[0] == null) {
								limpiarFiltroProfesionales();
							} else {
								vm.filter.matriculaProfesional = result[0].Matricula;
								vm.filter.nombreProfesional = result[0].Nombre;
								vm.data.profesional = result[0];
							}
						})
						.catch(function(pError) {
							ModalService.error(pError.message);
							limpiarFiltroProfesionales();;
						});
				} else {
					limpiarFiltroProfesionales();
				}
			}

			function buscarProfesionalEnter(keyEvent) {
				if (keyEvent.which === 13)
					buscarProfesional();
			}

			function limpiarFiltroProfesionales() {
				vm.filter.matriculaProfesional = '';
				vm.filter.nombreProfesional = '';
				vm.data.profesional = null;
			}

			/* BUSCADOR PRACTICAS */

			function buscarPracticas() {
				SupportDataService.entidadesBuscador = HomologacionesDataService.getAllPracticaMedica();
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
					var _practica = HomologacionesDataService.getPracticaByCodigo(vm.filter.codigoPractica);

					$q.all([_practica])
						.then(function(result) {
							if (result[0] == null) {
								limpiarFiltroPracticas();
							} else {
								vm.filter.codigoPractica = result[0].codigo_practica_medica;
								vm.filter.nombrePractica = result[0].nombre_practica_medica;
								vm.data.practica = result[0];
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

			/* BUSCADOR ORGANIZACION */

			function buscarOrganizaciones() {
				SupportDataService.entidadesBuscador = HomologacionesDataService.getAllOrganizacion();
				SupportDataService.tituloBuscador = 'Seleccionar Organización';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Codigo';
				SupportDataService.tituloNombreBuscador = 'Organización';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function(result) {
						vm.filter.codigoOrganizacion = result.Codigo;
						vm.filter.nombreOrganizacion = result.Nombre;
						vm.data.organizacion = result;
					})
					.catch(function(pError) {
						limpiarFiltroOrganizaciones();
						return;
					});
			};

			function buscarOrganizacion() {
				if (vm.filter.codigoOrganizacion != null && vm.filter.codigoOrganizacion != '') {
					var _organizacion = HomologacionesDataService.getOrganizacionByCodigo(vm.filter.codigoOrganizacion);
					$q.all([_organizacion])
						.then(function(result) {
							if (result[0] == null) {
								limpiarFiltroOrganizaciones();
							} else {
								vm.filter.codigoOrganizacion = result[0].Codigo;
								vm.filter.nombreOrganizacion = result[0].Nombre;
								vm.data.organizacion = result[0];
							}
						})
						.catch(function(pError) {
							ModalService.error(pError.message);
							limpiarFiltroOrganizaciones();
						});
				} else {
					limpiarFiltroOrganizaciones();
				}
			}

			function buscarOrganizacionEnter(keyEvent) {
				if (keyEvent.which === 13)
					buscarOrganizacion();
			}

			function limpiarFiltroOrganizaciones() {
				vm.filter.codigoOrganizacion = '';
				vm.filter.nombreOrganizacion = '';
				vm.data.organizacion = null;
			}


			/* BUSCADOR MUTUALES */

			function buscarMutuales() {
				SupportDataService.entidadesBuscador = HomologacionesDataService.getAllMutual();
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
					var _mutual = HomologacionesDataService.getMutualByCodigo(vm.filter.codigoMutual);
					$q.all([_mutual])
						.then(function(result) {
							if (result[0] == null) {
								limpiarFiltroMutuales();
							} else {
								vm.filter.codigoMutual = result[0].Codigo;
								vm.filter.nombreMutual = result[0].Nombre;
								vm.data.mutual = result[0];
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

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {

				vm.formControl.loading = true;

				var _tiposHomologaciones = HomologacionesDataService.getAllTipoHomologaciones();
				
				var _tiposDocumentos = HomologacionesDataService.getAllTipoDocumento();

				$q.all([_tiposHomologaciones, _tiposDocumentos])
					.then(activateOk, activateError);
			}

			function activateOk(results) {
				vm.data.sucursales = User.sucursales;
				vm.data.servicios = User.servicios;
				
				vm.data.tiposHomologaciones = results[0];
				vm.filter.tipoHomologacion = vm.data.tiposHomologaciones[1];

				
				vm.data.tiposDocumentos = results[1];

				vm.formControl.error = false;
				vm.formControl.loading = false;

				cleanFilters();

				//vm.paginacion.currentPage = 1;
				//vm.paginacion.pageSize = 100;

				if(HomologacionesDataService.homologacion != null) {

					if (HomologacionesDataService.sucursalFiltroBusqueda != null)
						vm.filter.sucursal = HomologacionesDataService.sucursalFiltroBusqueda;
					if (HomologacionesDataService.servicioFiltroBusqueda != null) 
						vm.filter.servicio = HomologacionesDataService.servicioFiltroBusqueda;
					if (HomologacionesDataService.tipoHomologacionFiltroBusqueda != null) 
						vm.filter.tipoHomologacion = HomologacionesDataService.tipoHomologacionFiltroBusqueda;									
					if (HomologacionesDataService.tipoDocumentoFiltroBusqueda != null) 
						vm.filter.tipoDocumento = HomologacionesDataService.tipoDocumentoFiltroBusqueda;				

					if (HomologacionesDataService.codigoOrganizacionFiltroBusqueda != null) 
						vm.filter.codigoOrganizacion = HomologacionesDataService.codigoOrganizacionFiltroBusqueda;
					if (HomologacionesDataService.nombreOrganizacionFiltroBusqueda != null) 
						vm.filter.nombreOrganizacion = HomologacionesDataService.nombreOrganizacionFiltroBusqueda;
					if (HomologacionesDataService.organizacionFiltroBusqueda != null) 
						vm.data.organizacion = HomologacionesDataService.organizacionFiltroBusqueda;

					if (HomologacionesDataService.matriculaProfesionalFiltroBusqueda != null)
						vm.filter.matriculaProfesional = HomologacionesDataService.matriculaProfesionalFiltroBusqueda;
					if (HomologacionesDataService.nombreProfesionalFiltroBusqueda != null) 
						vm.filter.nombreProfesional = HomologacionesDataService.nombreProfesionalFiltroBusqueda;
					if (HomologacionesDataService.profesionalFiltroBusqueda != null) 
						vm.data.profesional = HomologacionesDataService.profesionalFiltroBusqueda;
					
					// if (HomologacionesDataService.currentPageFiltroBusqueda != null) {
					// 	if (vm.paginacion.currentPage != HomologacionesDataService.currentPageFiltroBusqueda)
					// 		vm.paginacion.currentPage = HomologacionesDataService.currentPageFiltroBusqueda;
					// }
					// else
					// 	vm.paginacion.currentPage = 1;

					if (HomologacionesDataService.codigopracticaMedicaFiltroBusqueda != null) 
						vm.filter.codigoPractica = HomologacionesDataService.codigopracticaMedicaFiltroBusqueda;
					if (HomologacionesDataService.nombrepracticaMedicaFiltroBusqueda != null) 
						vm.filter.nombrePractica = HomologacionesDataService.nombrepracticaMedicaFiltroBusqueda;
					if(HomologacionesDataService.practicaMedicaFiltroBusqueda != null) 
				 		vm.data.practica = HomologacionesDataService.practicaMedicaFiltroBusqueda;

				 	if (HomologacionesDataService.codigoMutualFiltroBusqueda != null) 
						vm.filter.codigoMutual = HomologacionesDataService.codigoMutualFiltroBusqueda;
					if (HomologacionesDataService.nombreMutualFiltroBusqueda != null) 
						vm.filter.nombreMutual = HomologacionesDataService.nombreMutualFiltroBusqueda;
					if(HomologacionesDataService.mutualFiltroBusqueda != null) 
				 		vm.data.mutual = HomologacionesDataService.mutualFiltroBusqueda;
					
					visibilidadFiltros();
					
					HomologacionesDataService.sucursalFiltroBusqueda = null;
					HomologacionesDataService.servicioFiltroBusqueda = null;
					HomologacionesDataService.tipoHomologacionFiltroBusqueda = null;
					HomologacionesDataService.tipoDocumentoFiltroBusqueda = null;
					
					HomologacionesDataService.codigoOrganizacionFiltroBusqueda = null;
					HomologacionesDataService.nombreOrganizacionFiltroBusqueda = null;
					HomologacionesDataService.organizacionFiltroBusqueda = null;
					
					HomologacionesDataService.matriculaProfesionalFiltroBusqueda = null;
					HomologacionesDataService.nombreProfesionalFiltroBusqueda = null;				
					HomologacionesDataService.profesionalFiltroBusqueda = null;				
					
					HomologacionesDataService.codigopracticaMedicaFiltroBusqueda = null;
					HomologacionesDataService.nombrepracticaMedicaFiltroBusqueda = null;
					HomologacionesDataService.practicaMedicaFiltroBusqueda = null;
					
					HomologacionesDataService.currentPageFiltroBusqueda = null;

					HomologacionesDataService.codigoMutualFiltroBusqueda = null;
					HomologacionesDataService.nombreMutualFiltroBusqueda = null;
					HomologacionesDataService.mutualFiltroBusqueda = null;

					buscarHomologaciones();

					HomologacionesDataService.homologacion = null;
				}
				
				vm.formControl.loading = false;
			}

			function activateError(pError) {
				ModalService.error(pError.message);
			}

		}

	};

	return module;
})();