/**
 * @author 			pferrer
 * @description 	description
 */
import * as angular from 'angular';
import { ISupportDataService } from '../../../support/basic/services';
import { IProfesionalesDataService } from '../../../profesionales';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AutorizacionesListController', AutorizacionesListController);

		// Inyección de Dependencia
		AutorizacionesListController.$inject = ['$log', '$q', '$scope','$state', 'ModalService',
			'SupportDataService', 'SupportLogicService', 'User', 'ProfesionalesDataService',
			'AutorizadorDataService', 'AutorizadorLogicService', 'DateUtils'];

		// Constructor del Controller
		function AutorizacionesListController ($log, $q, $scope, $state, ModalService : IModalService,
			SupportDataService: ISupportDataService, SupportLogicService, User, ProfesionalesDataService: IProfesionalesDataService,
			AutorizadorDataService, AutorizadorLogicService, DateUtils : IDateUtils) {

			//$log.debug('AutorizacionesListController: ON.-');

			// En this va lo que se modifica de la vista (VM: ViewModel)
			var vm = this;

			vm.user = User;
			vm.title = {
				name: 'Listado de Autorizaciones',
				icon: 'LIST'
			};	

			vm.data = {
				autorizaciones: [],
				sucursales: [],					
				servicios: [],
				estadoAutorizacion: [],
				estadoCodigoRespuestaAutorizacion: [],
				tipoMensajeAutorizador: [],
				organizacion: '',
				profesional: ''
			};

			vm.filter = {
				autorizaciones : [], 
				sucursal : '',
				servicio : '',
				estadoAutorizacion : '',
				estadoCodigoRespuesta : '',
				tipoMensaje : '',
				//ORGANIZACION
				codigoOrganizacion : '',
				nombreOrganizacion : '',
				//PACIENTE	
				idPaciente: 0,
				//PROFESIONAL	
				matriculaProfesional : '',
				nombreProfesional : '',
				nroSolicitud : '',
				practica : '',
				numeroPaciente : '',

				fecActualD : new Date(),
				fecActualH : new Date(),

				checkAll : false,
				//customPageSize : 10,

				clean : cleanFilters,
				validar : validarFilters
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 100,
				totalItems: 0,
				pageChanged : pageChanged
				//getPage: getPage
			};	

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate,
				verDetalle: verDetalle,
				buscarAutorizaciones: buscarAutorizaciones,
				verItemsDetalle: verItemsDetalle,
				verHijos: verHijos,
				agregarAutorizacion : agregarAutorizacion,
				/*ORGANIZACION*/
				buscarOrganizaciones : buscarOrganizaciones,
				buscarOrganizacion : buscarOrganizacion,
				buscarOrganizacionEnter : buscarOrganizacionEnter,
				/*PROFESIONAL*/
				buscarProfesionales : buscarProfesionales,
				buscarProfesional : buscarProfesional,
				buscarProfesionalEnter : buscarProfesionalEnter,

				reenviarAutorizacion : reenviarAutorizacion,
				reenviarAutorizaciones: reenviarAutorizaciones,
				consultarAutorizacion : consultarAutorizacion,
				anularAutorizacion : anularAutorizacion,
				editarAutorizacion : editarAutorizacion,
				imprimirOrden : imprimirOrden,

				//preseleccionarSucursal : preseleccionarSucursal,

				checkItems : checkItems,
				volver : volver
			};
			


			function checkItems(){
				for (var i = vm.filter.autorizaciones.length - 1; i >= 0; i--) {
					if(vm.filter.autorizaciones[i].PuedeReenviar) {
						vm.filter.autorizaciones[i].Seleccionado = vm.filter.checkAll;
					}
				}
			}

			function reenviarAutorizacion(pIdAutorizacion) {
				ModalService.confirm('¿Desea reprocesar la autorización?',
				function (pResult) {
					if (pResult) {
						AutorizadorDataService.reenviarAutorizacion(pIdAutorizacion)
							.then(function (result) {
								buscarAutorizaciones();
							});	
					}		
				});	
			}
			
			function reenviarAutorizaciones() {

				var ids = '';
				for (var i = vm.filter.autorizaciones.length - 1; i >= 0; i--) {
					if(vm.filter.autorizaciones[i].Seleccionado == true) {
						if(ids == '') { 
							ids = vm.filter.autorizaciones[i].Id;
						}
						else {
							ids = ids + ',' + vm.filter.autorizaciones[i].Id;	
						}	
					}	
				}

				if(ids == '') {
					ModalService.info('Debe seleccionar al menos una autorización.');
					return;
				}

				ModalService.confirm('¿Desea reprocesar las autorizaciones seleccionadas?',
				function (pResult) {
					if (pResult) {
						AutorizadorDataService.reenviarAutorizaciones(ids)
						.then(function (result) {
							buscarAutorizaciones();
						});
					}
				});
			}


			function imprimirOrden(pIdAutorizacion) {
				AutorizadorDataService.ordenPractica = null;

				AutorizadorLogicService.selectPrint(vm.user)
					.then(function(result) {	
						if(result.Id == 19) {
							AutorizadorDataService.getOrdenPractica(pIdAutorizacion)
								.then(function (result) {
									AutorizadorDataService.ordenPractica = result;
									AutorizadorLogicService.printOrdenPractica();
								});		
						} else {
							AutorizadorDataService.getOrdenPracticaPaciente(pIdAutorizacion)
								.then(function (result) {
									AutorizadorDataService.ordenPractica = result;
									AutorizadorLogicService.printOrdenPractica();
								});
						}
					}
				);								
			}

			function consultarAutorizacion(pIdAutorizacion) {
				ModalService.confirm('¿Desea consultar la autorización?',
				function (pResult) {
					if (pResult) {
						AutorizadorDataService.consultarAutorizacion(pIdAutorizacion)
							.then(function (result) {
								buscarAutorizaciones();
							});	
					}		
				});		
			}

			function anularAutorizacion(pIdAutorizacion) {
				ModalService.confirm('¿Desea anular la autorización?',
				function (pResult) {
					if (pResult) {
						AutorizadorDataService.anularAutorizacion(pIdAutorizacion)
							.then(function (result) {
								buscarAutorizaciones();
							});	
					}		
				});	
			}

			function guardarFiltrosDeBusqueda() {
				var idPac = vm.filter.idPaciente;
				if(vm.filter.idPaciente == null) {
					idPac = 0;
				}

				if (angular.isUndefined(idPac)) {
					idPac = 0;	
				}
					
				AutorizadorDataService.sucursalFiltroBusqueda = vm.filter.sucursal;
				AutorizadorDataService.servicioFiltroBusqueda = vm.filter.servicio;
				AutorizadorDataService.estadoAutorizacionFiltroBusqueda = vm.filter.estadoAutorizacion;
				AutorizadorDataService.estadoCodigoRespuestaFiltroBusqueda = vm.filter.estadoCodigoRespuesta;
				AutorizadorDataService.tipoMensajeFiltroBusqueda = vm.filter.tipoMensaje;
				AutorizadorDataService.codigoOrganizacionFiltroBusqueda = vm.filter.codigoOrganizacion;
				AutorizadorDataService.nombreOrganizacionFiltroBusqueda = vm.filter.nombreOrganizacion;
				AutorizadorDataService.idPacienteFiltroBusqueda = idPac;
				AutorizadorDataService.matriculaProfesionalFiltroBusqueda = vm.filter.matriculaProfesional;
				AutorizadorDataService.nombreProfesionalFiltroBusqueda = vm.filter.nombreProfesional;
				AutorizadorDataService.profesionalFiltroBusqueda = vm.data.profesional;
				AutorizadorDataService.organizacionFiltroBusqueda = vm.data.organizacion;
				AutorizadorDataService.currentPageFiltroBusqueda = vm.paginacion.currentPage;
				AutorizadorDataService.fechaDesdeFiltroBusqueda = vm.filter.fecActualD;
				AutorizadorDataService.fechaHastaFiltroBusqueda = vm.filter.fecActualH;
				AutorizadorDataService.nroSolicitudFiltroBusqueda = vm.filter.nroSolicitud;		
				AutorizadorDataService.practicaMedicaFiltroBusqueda = vm.filter.practica;
				AutorizadorDataService.nroPacienteFiltroBusqueda = vm.filter.numeroPaciente;
			}


			function editarAutorizacion(pIdAutorizacion) {
				AutorizadorDataService.autorizacion = null;

				//guardo los filtros de busqueda
				guardarFiltrosDeBusqueda();

				AutorizadorDataService.getAutorizacionById(pIdAutorizacion)
					.then(function (result) {
						AutorizadorDataService.autorizacion = result;
						$state.go('facturacion.autorizador.autorizaciones.editar');
					});	
			
			}

			function verDetalle(pIdAutorizacion) {
				AutorizadorDataService.autorizacionView = null;					
				AutorizadorDataService.getAutorizacionPorIdParaView(pIdAutorizacion)
					.then(function (result) {
						AutorizadorDataService.autorizacionView = result;

						AutorizadorLogicService.viewAutorizacion()
							.then(function (argument) {
								activate();
							})
					});	
			}	

			function agregarAutorizacion() {	
				//guardo los filtros de busqueda
				guardarFiltrosDeBusqueda();

				AutorizadorDataService.newAutorizacion()
					.then(function (result) {
						AutorizadorDataService.autorizacion = result;
						$state.go('facturacion.autorizador.autorizaciones.editar');
					});		
			}

			vm.sort = function(keyname){
				$scope.sortKey = keyname;   //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			}

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function inicializarVariables () {
				vm.data.autorizaciones = [];
				vm.data.sucursales = [];
				vm.data.servicios = [];
				vm.data.estadoAutorizacion = [];
				vm.data.estadoCodigoRespuestaAutorizacion = [];
				vm.data.tipoMensajeAutorizador = [];
				vm.data.organizacion = null;
				vm.data.profesional = null;
			}

			/* PAGINACIÓN */

			function cleanFilters () {
				vm.filter.fecActualD = new Date();
				vm.filter.fecActualH = new Date();
				vm.filter.sucursal = '';
				vm.filter.servicio = '';
				vm.filter.estadoAutorizacion = '';
				vm.filter.estadoCodigoRespuesta = '';
				vm.filter.tipoMensaje = '';

				/*ORGANIZACION*/
				vm.filter.codigoOrganizacion = '';				
				vm.filter.nombreOrganizacion = '';
				vm.filter.idPaciente = null;

				/*PROFESIONAL*/
				vm.filter.matriculaProfesional = '';
				vm.filter.nombreProfesional = '';
				vm.filter.nroSolicitud = '';
				vm.filter.practica = '';
				vm.filter.numeroPaciente = '';

				vm.data.mutual = null;
				vm.data.paciente = null;
				vm.data.organizacion = null;
				vm.data.profesional = null;

				vm.paginacion.currentPage = 1;
				vm.paginacion.pageChanged();
			}

			function validarFilters () {
				if (vm.filter.sucursal == null)
					vm.filter.sucursal = '';
				if (vm.filter.servicio == null)
					vm.filter.servicio = '';
				if (vm.filter.estadoAutorizacion == null)
					vm.filter.estadoAutorizacion = '';
				if (vm.filter.estadoCodigoRespuesta == null)
					vm.filter.estadoCodigoRespuesta = '';
				if (vm.filter.tipoMensaje == null)
					vm.filter.tipoMensaje = '';
				/*ORGANIZACION*/
				if (vm.filter.codigoOrganizacion == null)
					vm.filter.codigoOrganizacion = '';
				if (vm.filter.nombreOrganizacion == null)
					vm.filter.nombreOrganizacion = '';
				/*PROFESIONAL*/
				if (vm.filter.matriculaProfesional == null)
					vm.filter.matriculaProfesional = '';
				if (vm.filter.nombreProfesional == null)
					vm.filter.nombreProfesional = '';
			}

			function pageChanged (pPage) {
				if(!angular.isUndefined(pPage) && pPage != null) {
					vm.paginacion.currentPage = pPage;
					buscarAutorizaciones();
				}
			}

 			// 	function getPage () { 	
 			// 		vm.filter.checkAll = false;
 			// 		for (var i = vm.filter.autorizaciones.length - 1; i >= 0; i--) {
 			// 			vm.filter.autorizaciones[i].VerItems = false;
 			// 			vm.filter.autorizaciones[i].Seleccionado = false;
 			// 		}

 			// 		vm.filter.autorizaciones =vm.data.autorizaciones;

 			// 		var cantidadRegistros = vm.filter.autorizaciones.length;
 			// 		var cantidadPaginas = cantidadRegistros / vm.paginacion.pageSize;

 			// 		if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
 			// 			cantidadPaginas = cantidadPaginas + 1;

 			// 		if (cantidadPaginas < vm.paginacion.currentPage) {
 			// 			vm.paginacion.currentPage = 1;	
 			// 		}

				// 	var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				// 	var end = begin + vm.paginacion.pageSize;
					
				// 	vm.filter.validar();
					
				// 	vm.paginacion.totalItems = vm.filter.autorizaciones.length;					
				// 	vm.filter.autorizaciones = vm.filter.autorizaciones.slice(begin, end);					
				// }	

			function getFormattedDate(fecha) {
				var date = new Date(fecha);
				var year = date.getFullYear();
				var month = (1 + date.getMonth()).toString();
				month = month.length > 1 ? month : '0' + month;
				var day = date.getDate().toString();
				day = day.length > 1 ? day : '0' + day;
				return   year + '-' +  month + '-' + day;
			}

			function buscarAutorizaciones() {
				vm.formControl.loading = true;

				var fechaD = DateUtils.parseToBeParams(vm.filter.fecActualD ? vm.filter.fecActualD : new Date());
				var fechaH = DateUtils.parseToBeParams(vm.filter.fecActualH ? vm.filter.fecActualH : new Date());

				var idSuc = 0;
				if (vm.filter.sucursal != null && vm.filter.sucursal != '')
					idSuc = vm.filter.sucursal.Id;

				var idOrg = 0;
				if (vm.data.organizacion != null)
					idOrg = vm.data.organizacion.Id;

				if (angular.isUndefined(idOrg)) {
					idOrg = 0;	
				}

				var idMut = 0;
				
				var idPac = vm.filter.idPaciente;
				if(vm.filter.idPaciente == null) {
					idPac = 0;
				}

				if (angular.isUndefined(idPac)) {
					idPac = 0;	
				}

				var idProf = 0;
				if (vm.data.profesional != null)
					idProf = vm.data.profesional.numero_matricula;

				if (angular.isUndefined(idProf)) {
					idProf = 0;	
				}					

				var idServ = 0;
				if (vm.filter.servicio != null && vm.filter.servicio != '')
					idServ = vm.filter.servicio.Id;	

				var idEstAut = 0;
				if (vm.filter.estadoAutorizacion != null && vm.filter.estadoAutorizacion != '')
					idEstAut = vm.filter.estadoAutorizacion.Id;	

				var idEstCodigoResp = 0;
				if (vm.filter.estadoCodigoRespuesta != null && vm.filter.estadoCodigoRespuesta!= '')
					idEstCodigoResp = vm.filter.estadoCodigoRespuesta.Id;

				var idTipoMsj = 0;
				if (vm.filter.tipoMensaje != null && vm.filter.tipoMensaje != '')
					idTipoMsj = vm.filter.tipoMensaje.Id;

				var nroSolicitud = 0; 
				if (vm.filter.nroSolicitud != null && vm.filter.nroSolicitud != '')
					nroSolicitud = vm.filter.nroSolicitud;

				var practica = 0;
				if(vm.filter.practica != null && vm.filter.practica != '')
					practica = vm.filter.practica;

				var nroPaciente = 0;
				if(vm.filter.numeroPaciente != null && vm.filter.numeroPaciente != '')
					nroPaciente = vm.filter.numeroPaciente;

				//$log.debug('vm.paginacion.currentPage', vm.paginacion.currentPage);
				var currentPage = 0;
				if (!angular.isUndefined(vm.paginacion.currentPage) && vm.paginacion.currentPage > 0) {
					currentPage = vm.paginacion.currentPage - 1;	
				}

				AutorizadorDataService.getAllAutorizacionesByFiltro(fechaD, fechaH, idSuc, idOrg, idMut, 
					idPac, idProf, idServ, idEstAut, idEstCodigoResp, idTipoMsj, nroSolicitud, practica, nroPaciente, currentPage, vm.paginacion.pageSize)
				.then(function (result) {
					vm.data.autorizaciones = result.Result;
				
					vm.data.autorizaciones.forEach(item => {
						switch(item.IdTipoMsj){
							case 1:
								item.TipoMensajeAbreviadoAutorizador = 'AUT';
								break;
							case 2:
								item.TipoMensajeAbreviadoAutorizador = 'ANUL';
								break;	
							case 3:
								item.TipoMensajeAbreviadoAutorizador = 'CONSUL';
								break;
							case 4:
								item.TipoMensajeAbreviadoAutorizador = 'ELEG';
								break;
						}

						item.EstadoAutorizacion = vm.data.estadoAutorizacion.find(x => x.Id == item.IdEstadoAut).Nombre;
						item.EstadoAutorizacionColor = vm.data.estadoAutorizacion.find(x => x.Id == item.IdEstadoAut).Color;
						
						item.Hijos.forEach(hijo => {
							switch(hijo.IdTipoMsj){
								case 1:
									hijo.TipoMensajeAbreviadoAutorizador = 'AUT';
									break;
								case 2:
									hijo.TipoMensajeAbreviadoAutorizador = 'ANUL';
									break;	
								case 3:
									hijo.TipoMensajeAbreviadoAutorizador = 'CONSUL';
									break;
								case 4:
									hijo.TipoMensajeAbreviadoAutorizador = 'ELEG';
									break;
							}

							hijo.EstadoAutorizacion = vm.data.estadoAutorizacion.find(x => x.Id == hijo.IdEstadoAut).Nombre;
        					hijo.EstadoAutorizacionColor = vm.data.estadoAutorizacion.find(x => x.Id == hijo.IdEstadoAut).Color;
						});	
						
					});

					vm.filter.autorizaciones = vm.data.autorizaciones;	
					vm.paginacion.pageSize = result.PageSize;
					vm.paginacion.totalItems = result.TotalCount;
					vm.formControl.loading = false;
				})
				.catch(function (pError) {
						vm.formControl.loading = false;
					}
				);
			}

			function verItemsDetalle(pIdAutorizacion) {			
				for (var i = vm.filter.autorizaciones.length - 1; i >= 0; i--) {
					if (vm.filter.autorizaciones[i].Id == pIdAutorizacion) {
						vm.filter.autorizaciones[i].VerItems = !vm.filter.autorizaciones[i].VerItems
						return;
					}

					for (var j = vm.filter.autorizaciones[i].Hijos.length - 1; j >= 0; j--) {
						if (vm.filter.autorizaciones[i].Hijos[j].Id == pIdAutorizacion) {
							vm.filter.autorizaciones[i].Hijos[j].VerItems = !vm.filter.autorizaciones[i].Hijos[j].VerItems
							return;
						}							
					}	
				}					
			}	

			function verHijos(pIdAutorizacion) {			
				for (var i = vm.filter.autorizaciones.length - 1; i >= 0; i--) {
					if (vm.filter.autorizaciones[i].Id == pIdAutorizacion) {
						vm.filter.autorizaciones[i].VerHijos = !vm.filter.autorizaciones[i].VerHijos
					}	
				}	
			}	

			/* BUSCADOR ORGANIZACION */

			function buscarOrganizaciones(){		
				SupportDataService.entidadesBuscador = AutorizadorDataService.getAllOrganizacionConAutorizador(); 
				SupportDataService.tituloBuscador = 'Seleccionar Organización'; 
				SupportDataService.mostrarIdBuscador = false; 
				SupportDataService.mostrarCodigoBuscador = true; 
				SupportDataService.mostrarNombreBuscador = true; 
				SupportDataService.mostrarDescripcionBuscador = false; 
				SupportDataService.tituloIdBuscador = ''; 
				SupportDataService.tituloCodigoBuscador = 'Código'; 
				SupportDataService.tituloNombreBuscador = 'Organización'; 
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function (result) {
						vm.filter.codigoOrganizacion = result.Codigo;
						vm.filter.nombreOrganizacion = result.Nombre;	
						vm.data.organizacion = result;
					})
					.catch(function (pError) {
						limpiarFiltroOrganizaciones();
						return;
					});
			};

			function buscarOrganizacion(){
				if (vm.filter.codigoOrganizacion != null && vm.filter.codigoOrganizacion != '') {
					AutorizadorDataService.getOrganizacionByCodigo(vm.filter.codigoOrganizacion).then(function (result) {
						if (result == null) {
							limpiarFiltroOrganizaciones();
						}
						else {
							vm.filter.codigoOrganizacion = result.Codigo;
							vm.filter.nombreOrganizacion = result.Nombre;
							vm.data.organizacion = result;
						}
					})
					.catch(function (pError) {
						limpiarFiltroOrganizaciones();
					});	
				}
				else {
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

			/* BUSCADOR PROFESIONALES */

			function buscarProfesionales(){		
				SupportDataService.entidadesBuscador = ProfesionalesDataService.getAllProfesional(); 
				SupportDataService.tituloBuscador = 'Seleccionar Profesional'; 
				SupportDataService.mostrarIdBuscador = false; 
				SupportDataService.mostrarCodigoBuscador = true; 
				SupportDataService.mostrarNombreBuscador = true; 
				SupportDataService.mostrarDescripcionBuscador = false; 
				SupportDataService.tituloIdBuscador = ''; 
				SupportDataService.tituloCodigoBuscador = 'Matricula'; 
				SupportDataService.tituloNombreBuscador = 'Nombre'; 
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function (result) {
						vm.filter.matriculaProfesional = result.numero_matricula;
						vm.filter.nombreProfesional = result.nombre_completo;	
						vm.data.profesional = result;
					})
					.catch(function (pError) {
						limpiarFiltroProfesionales();
						return;
					});	
			};

			function buscarProfesional(){
				if (vm.filter.matriculaProfesional != null && vm.filter.matriculaProfesional != '') {
					ProfesionalesDataService.getProfesionalByMatricula(vm.filter.matriculaProfesional).then(function (result) {
						if (!result) {
							limpiarFiltroProfesionales();
						}
						else {			
							vm.filter.matriculaProfesional = result.numero_matricula;
							vm.filter.nombreProfesional = result.nombre_completo;
							vm.data.profesional = result;
						}
					})
					.catch(function (pError) {
						limpiarFiltroProfesionales();
					});	
				}
				else {
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

			function volver() {
				$state.go('homesistemas');
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate () {
				
				vm.formControl.loading = true;
				AutorizadorDataService.idAutorizacion = 0;

				var _estadoAutorizaciones = AutorizadorDataService.getAllEstadoAutorizacion();
				var _estadoCodigoRespuesta = AutorizadorDataService.getAllEstadoCodigoRespuestaAutorizacion();
				var _tipoMensaje = AutorizadorDataService.getAllTipoMensajeAutorizador();

				$q.all([_estadoAutorizaciones, _estadoCodigoRespuesta, _tipoMensaje])
				.then(activateOk, activateError);
			}

			function activateOk (results) {
				vm.filter.checkAll = false;
				vm.data.sucursales = User.sucursales;
				vm.data.servicios = User.servicios;

				vm.data.estadoAutorizacion = results[0];
				vm.data.estadoCodigoRespuestaAutorizacion = results[1];
				vm.data.tipoMensajeAutorizador = results[2];

				vm.formControl.error = false;
				vm.formControl.loading = false;

				cleanFilters();
				
				vm.paginacion.currentPage = 0;

				if(AutorizadorDataService.autorizacion != null) {
					if (AutorizadorDataService.sucursalFiltroBusqueda != null)
						vm.filter.sucursal = AutorizadorDataService.sucursalFiltroBusqueda;
					if (AutorizadorDataService.servicioFiltroBusqueda != null)
						vm.filter.servicio = AutorizadorDataService.servicioFiltroBusqueda;
					if (AutorizadorDataService.estadoAutorizacionFiltroBusqueda != null)
						vm.filter.estadoAutorizacion = AutorizadorDataService.estadoAutorizacionFiltroBusqueda;
					if (AutorizadorDataService.estadoCodigoRespuestaFiltroBusqueda != null)
						vm.filter.estadoCodigoRespuesta = AutorizadorDataService.estadoCodigoRespuestaFiltroBusqueda;
					if (AutorizadorDataService.tipoMensajeFiltroBusqueda != null)
						vm.filter.tipoMensaje = AutorizadorDataService.tipoMensajeFiltroBusqueda;
					
					if (AutorizadorDataService.codigoOrganizacionFiltroBusqueda != null)
						vm.filter.codigoOrganizacion = AutorizadorDataService.codigoOrganizacionFiltroBusqueda;
					if (AutorizadorDataService.nombreOrganizacionFiltroBusqueda != null)
						vm.filter.nombreOrganizacion = AutorizadorDataService.nombreOrganizacionFiltroBusqueda;
					if (AutorizadorDataService.organizacionFiltroBusqueda != null)
						vm.data.organizacion = AutorizadorDataService.organizacionFiltroBusqueda;

					if (AutorizadorDataService.idPacienteFiltroBusqueda != null)
						vm.filter.idPaciente = AutorizadorDataService.idPacienteFiltroBusqueda;
					
					if (AutorizadorDataService.matriculaProfesionalFiltroBusqueda != null)
						vm.filter.matriculaProfesional = AutorizadorDataService.matriculaProfesionalFiltroBusqueda;
					if (AutorizadorDataService.nombreProfesionalFiltroBusqueda != null)
						vm.filter.nombreProfesional = AutorizadorDataService.nombreProfesionalFiltroBusqueda;
					if (AutorizadorDataService.profesionalFiltroBusqueda != null)
						vm.data.profesional = AutorizadorDataService.profesionalFiltroBusqueda;
					
					if (AutorizadorDataService.nroSolicitudFiltroBusqueda != null)
						vm.filter.nroSolicitud = AutorizadorDataService.nroSolicitudFiltroBusqueda;
					if (AutorizadorDataService.currentPageFiltroBusqueda != null)
						vm.paginacion.currentPage = AutorizadorDataService.currentPageFiltroBusqueda;
					else
						vm.paginacion.currentPage = 1;
					if(AutorizadorDataService.fechaDesdeFiltroBusqueda != null) 		
						vm.filter.fecActualD = AutorizadorDataService.fechaDesdeFiltroBusqueda;
					if(AutorizadorDataService.fechaHastaFiltroBusqueda != null) 
						vm.filter.fecActualH = AutorizadorDataService.fechaHastaFiltroBusqueda;
						if(AutorizadorDataService.practicaMedicaFiltroBusqueda != null)
						vm.filter.practica = AutorizadorDataService.practicaMedicaFiltroBusqueda;
						if(AutorizadorDataService.nroPacienteFiltroBusqueda != null)
						vm.filter.numeroPaciente = AutorizadorDataService.nroPacienteFiltroBusqueda;

					AutorizadorDataService.sucursalFiltroBusqueda = null;
					AutorizadorDataService.servicioFiltroBusqueda = null;
					AutorizadorDataService.estadoAutorizacionFiltroBusqueda = null;
					AutorizadorDataService.estadoCodigoRespuestaFiltroBusqueda = null;
					AutorizadorDataService.tipoMensajeFiltroBusqueda = null;
					AutorizadorDataService.codigoOrganizacionFiltroBusqueda = null;
					AutorizadorDataService.nombreOrganizacionFiltroBusqueda = null;
					AutorizadorDataService.organizacionFiltroBusqueda = null;
					AutorizadorDataService.idPacienteFiltroBusqueda = null;
					AutorizadorDataService.matriculaProfesionalFiltroBusqueda != null;
					AutorizadorDataService.nombreProfesionalFiltroBusqueda = null;
					AutorizadorDataService.profesionalFiltroBusqueda = null;
					AutorizadorDataService.nroSolicitudFiltroBusqueda = null;
					AutorizadorDataService.currentPageFiltroBusqueda = null;
					AutorizadorDataService.cantidadRegistrosFiltroBusqueda = null;
					AutorizadorDataService.fechaDesdeFiltroBusqueda = new Date();
					AutorizadorDataService.fechaHastaFiltroBusqueda = new Date();
					AutorizadorDataService.practicaMedicaFiltroBusqueda = null;
					AutorizadorDataService.nroPacienteFiltroBusqueda = null;
					
					buscarAutorizaciones();

					AutorizadorDataService.autorizacion = null;
				}
			}

			function activateError (pError) {
				vm.formControl.loading = false;
			}

		}

	};

	return module;
})();