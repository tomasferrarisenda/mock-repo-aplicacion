import { ISupportDataService } from '../../../support/basic/services';
import { IProfesionalesDataService } from '../../../profesionales';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('HomologacionViewController', HomologacionViewController);

		// Inyección de Dependencia
		HomologacionViewController.$inject = ['$scope', '$log', '$q', '$filter','$state', '$location', 'ModalService',
			'SupportDataService','SupportLogicService', 'User', 'ProfesionalesDataService',
			'HomologacionesDataService', 'HomologacionesAuthService', 'SecurityLogicService'];

		// Constructor del Controller
		function HomologacionViewController ($scope, $log, $q, $filter, $state, $location, ModalService,
			SupportDataService: ISupportDataService, SupportLogicService, User, ProfesionalesDataService: IProfesionalesDataService,
			HomologacionesDataService, HomologacionesAuthService ,  SecurityLogicService) {

			//$log.debug('HomologacionViewController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */
			
			var vm = this;
			
			vm.title = {
				module: "HOMOLOGACIONES",
				page: 'Editar Homologación'
			};

			vm.data = {
				homologacion: '',
				tipoHomologacion: [],
				sucursales: [],
				tiposDocumentos: [],
				mutual: [],
				organizacion: [],
				servicios: [],
				profesional: [],
				practica: [],
				valor: ''
			};

			vm.filter = {
				sucursal : '',
				tipoDocumento : '',
				servicio : '',
				tipoHomologacion : '',
				matriculaProfesional : '',
				nombreProfesional : '' ,
				codigoPractica : '',					
				nombrePractica : '',
				codigoOrganizacion : '',					
				nombreOrganizacion : '',
				codigoMutual : '',					
				nombreMutual : '',
				visibleProfesional : true,
				visiblePractica : true,
				visibleServicio : true,
				visibleTipoDocumento : true
			};


			vm.formControl = {
				error: true,
				loading: false,
				validarError: validarError,
				reloadPage: activate,
				cancel : cancel,
				ok: guardarEntidad,	

				buscarProfesionales : buscarProfesionales,
				buscarProfesional : buscarProfesional,
				buscarProfesionalEnter : buscarProfesionalEnter,
				/*PRACTICA*/
				buscarPracticas : buscarPracticas,
				buscarPractica : buscarPractica,
				buscarPracticaEnter : buscarPracticaEnter,
				/*ORGANIZACION*/
				buscarOrganizaciones : buscarOrganizaciones,
				buscarOrganizacion : buscarOrganizacion,
				buscarOrganizacionEnter : buscarOrganizacionEnter,
				/*MUTUAL*/
				buscarMutuales : buscarMutuales,
				buscarMutual : buscarMutual,
				buscarMutualEnter : buscarMutualEnter,

				validarForm : validarForm
			};

			$scope.validar = {
				error: validarError
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function validarError (pBool) {
				if(!pBool) {
					return 'error';
				}
				return '';
			}


			function validarForm () { 	
				var _flag = false;

				//if (angular.isUndefined(vm.data.mutual)) {
				
				//Organizacion requerida
				if (vm.filter.codigoOrganizacion == null || vm.filter.codigoOrganizacion == '') {
					_flag = true;
				}

				//valor requerido
				if (vm.data.valor == null || vm.data.valor == '') {
					_flag = true;
				}

				/*Codigo Nomenclador*/
				if (vm.data.tipoHomologacion.Id == 1) {
					if (vm.filter.codigoPractica == null || vm.filter.codigoPractica == '') {
						_flag = true;
					}						
				}

				/*Tipo Documento*/
				if (vm.data.tipoHomologacion.Id == 2) {
					if (vm.filter.tipoDocumento == null || vm.filter.tipoDocumento == '') {
						_flag = true;
					}						
				}

				/*Codigo Servicio*/
				if (vm.data.tipoHomologacion.Id == 4) {
					if (vm.filter.servicio == null || vm.filter.servicio == '') {
						_flag = true;
					}	
				}

				/*Codigo Servicio*/
				if (vm.data.tipoHomologacion.Id == 5) {
					if (vm.filter.servicio == null || vm.filter.servicio == '') {
						_flag = true;
					}	
				}

				/*Codigo Emisor Autorizador*/
				if (vm.data.tipoHomologacion.Id == 6) {
					if (vm.filter.sucursal == null || vm.filter.sucursal == '') {
						_flag = true;
					}	
				}	

				/*Codigo Sucursal*/
				if (vm.data.tipoHomologacion.Id == 7) {
					if (vm.filter.sucursal == null || vm.filter.sucursal == '') {
						_flag = true;
					}	
				}	

				/*Nombre Sucursalr*/
				if (vm.data.tipoHomologacion.Id == 8) {
					if (vm.filter.sucursal == null || vm.filter.sucursal == '') {
						_flag = true;
					}	
				}	

				return _flag;				
			}

			function guardarEntidad () { 						
				//setear objecto homologacion
				setearHomologacion();		
				//validaciones
				HomologacionesDataService.validarGuardar(vm.data.homologacion)
					.then(function (result) {
						if (result.IsOk == false) {
							ModalService.error(result.Message);	
							return;
						}
						else {
							//guardar	
							HomologacionesDataService.guardarHomologacion(vm.data.homologacion)
								.then(function (result) {
									$state.go('financiadores.homologaciones.list');
								})
								.catch(function (pError) {
									ModalService.error(pError.message);
									return;
								});	
						}
					})
					.catch(function (pError) {
						ModalService.error(pError.message);
						return;
					});				
			}

			function setearHomologacion() {
				vm.data.homologacion.IdTipoHomologacion = vm.data.tipoHomologacion.Id;

				if (vm.data.organizacion != null) 
					vm.data.homologacion.IdOrganizacion = vm.data.organizacion.Id;
				else 
					vm.data.homologacion.IdOrganizacion = 0;	

				if (vm.data.mutual != null) 
					vm.data.homologacion.IdMutual = vm.data.mutual.Id;
				else 
					vm.data.homologacion.IdMutual = 0;	

				if (vm.filter.sucursal != null && vm.filter.sucursal != '')	
					vm.data.homologacion.IdSucursal = vm.filter.sucursal.Id;
				else 
					vm.data.homologacion.IdSucursal = 0;	

				if (vm.filter.servicio != null && vm.filter.servicio != '')
					vm.data.homologacion.IdServicio = vm.filter.servicio.Id;
				else 
					vm.data.homologacion.IdServicio = 0;	

				if (vm.data.profesional != null) 
					vm.data.homologacion.MatProfesional = vm.data.profesional.numero_matricula;
				else 
					vm.data.homologacion.MatProfesional = 0;	

				if (vm.data.practica != null) 
					vm.data.homologacion.IdPracticaMedica = vm.data.practica.id_practica_medica;
				else 
					vm.data.homologacion.IdPracticaMedica = 0;	

				if (vm.filter.tipoDocumento != null) 					
					vm.data.homologacion.IdTipoDocumento = vm.filter.tipoDocumento.Id;
				else 
					vm.data.homologacion.IdTipoDocumento = 0;	

				vm.data.homologacion.Valor = $.trim(vm.data.valor);	

				if (vm.data.homologacion.Valor == null)
					vm.data.homologacion.Valor = '';				
			}

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables () {
				vm.data.homologacion = [];
				vm.data.tipoHomologacion = [];
				vm.data.sucursales = [];
				vm.data.tiposDocumentos = [];
				vm.data.servicios = [];
				vm.data.profesional = [];
				vm.data.practica = [];
				vm.data.mutual = [];
				vm.data.organizacion = [];
				vm.data.valor = '';
			}

			function cancel () {
				$state.go('financiadores.homologaciones.list');
			}
			
			function visibilidadFiltros() {		
				vm.filter.visibleProfesional = false;
				vm.filter.visiblePractica = false;
				vm.filter.visibleServicio = false;
				vm.filter.visibleTipoDocumento = false;	

		  		/*Codigo Nomenclador*/
				if (vm.data.tipoHomologacion.Id == 1) {
					vm.filter.visiblePractica = true;
					vm.filter.visibleServicio = true;
				}
				/*Tipo Documento*/
				if (vm.data.tipoHomologacion.Id == 2) {
					vm.filter.visibleTipoDocumento = true;	
				}
				/*Matricula Profesional*/
				if (vm.data.tipoHomologacion.Id == 3) {
					vm.filter.visibleProfesional = true;
					vm.filter.visibleServicio = true;						
				}
				/*Codigo Servicio*/
				if (vm.data.tipoHomologacion.Id == 4) {
					vm.filter.visibleServicio = true;
				}
				/*Nombre Servicio*/
				if (vm.data.tipoHomologacion.Id == 5) {
					vm.filter.visibleServicio = true;
				}					
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
				SupportDataService.tituloNombreBuscador = 'Profesional'; 
				SupportDataService.tituloDescripcionBuscador = '';				
				SupportLogicService.openSelectorBase()
					.then(function (result) {
							vm.filter.matriculaProfesional = result.numero_matricula;
							vm.filter.nombreProfesional = result.nombre_completo;	
							vm.data.profesional = result;
						})
					.catch(function (pError) {
							limpiarFiltroProfesionales();
					});	
			};

			function buscarProfesional() {
				if (vm.filter.matriculaProfesional != null && vm.filter.matriculaProfesional != '') {
					var _profesional = ProfesionalesDataService.getProfesionalByMatricula(vm.filter.matriculaProfesional);
					$q.all([_profesional])
						.then(function (result) {
							if (result[0] == null) {
								limpiarFiltroProfesionales();
							}
							else{			
								vm.filter.matriculaProfesional = result[0].numero_matricula;
								vm.filter.nombreProfesional = result[0].nombre_completo;
								vm.data.profesional = result[0];		
							}
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
							limpiarFiltroProfesionales();;
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

			/* BUSCADOR PRACTICAS */

			function buscarPracticas(){		
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
					.then(function (result) {
						vm.filter.codigoPractica = result.codigo_practica_medica;			
						vm.filter.nombrePractica = result.nombre_practica_medica;	
						vm.data.practica = result;	
					})
					.catch(function (pError) {
						limpiarFiltroPracticas();
						return;
					});					
			};

			function buscarPractica(){
				if (vm.filter.codigoPractica != null && vm.filter.codigoPractica != '') {
					var _practica = HomologacionesDataService.getPracticaByCodigo(vm.filter.codigoPractica);						
					
					$q.all([_practica])
						.then(function (result) {
							if (result[0] == null) {
								limpiarFiltroPracticas();
							}
							else {			
								vm.filter.codigoPractica = result[0].codigo_practica_medica;
								vm.filter.nombrePractica = result[0].nombre_practica_medica;
								vm.data.practica = result[0];		
							}
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
							limpiarFiltroPracticas();
						});	
				}
				else {
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

			function buscarOrganizaciones(){		
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
					var _organizacion = HomologacionesDataService.getOrganizacionByCodigo(vm.filter.codigoOrganizacion);						
					$q.all([_organizacion])
						.then(function (result) {
							if (result[0] == null) {
								limpiarFiltroOrganizaciones();
							}
							else {			
								vm.filter.codigoOrganizacion = result[0].Codigo;
								vm.filter.nombreOrganizacion = result[0].Nombre;
								vm.data.organizacion = result[0];
							}
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
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

			/* BUSCADOR MUTUALES */

			function buscarMutuales(){		
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
					.then(function (result) {
						vm.filter.codigoMutual = result.Codigo;			
						vm.filter.nombreMutual = result.Nombre;	
						vm.data.mutual = result;																						
					})
					.catch(function (pError) {
						limpiarFiltroMutuales();
						return;
					});	
			};

			function buscarMutual(){
				if (vm.filter.codigoMutual != null && vm.filter.codigoMutual != '') {
					var _mutual = HomologacionesDataService.getMutualByCodigo(vm.filter.codigoMutual);						
					$q.all([_mutual])
						.then(function (result) {
							if (result[0] == null) {
								limpiarFiltroMutuales();
							}
							else {			
								vm.filter.codigoMutual = result[0].Codigo;
								vm.filter.nombreMutual = result[0].Nombre;
								vm.data.mutual = result[0];
							}
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
							limpiarFiltroMutuales();
						});	
				}
				else {
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


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate () {

				inicializarVariables();
				
				var _tiposDocumentos = HomologacionesDataService.getAllTipoDocumento();

				$q.all([_tiposDocumentos])
				.then(activateOk, activateError);					
			}

			function activateOk (results) {
				vm.data.sucursales = User.sucursales;
				vm.data.servicios = User.servicios;	

				vm.data.tiposDocumentos = results[0];	

				vm.data.homologacion = HomologacionesDataService.homologacion;
				vm.data.tipoHomologacion = HomologacionesDataService.tipoHomologacion;
				
				vm.filter.tipoHomologacion = vm.data.tipoHomologacion.Nombre;

				visibilidadFiltros();

				if (vm.data.homologacion != null) {
					//organizacion
					vm.filter.codigoOrganizacion = vm.data.homologacion.CodigoOrganizacion;
					buscarOrganizacion();
					//mutual
					if(vm.data.homologacion.CodigoMutual > 0) {
						vm.filter.codigoMutual = vm.data.homologacion.CodigoMutual;
						buscarMutual();
					}
					//profesional
					if(vm.data.homologacion.MatProfesional > 0) {
						vm.filter.matriculaProfesional = vm.data.homologacion.MatProfesional;
						buscarProfesional();					
					}
					//practica
					if(vm.data.homologacion.CodigoPracticaMedica > 0 ) {
						vm.filter.codigoPractica = vm.data.homologacion.CodigoPracticaMedica;					
						buscarPractica();
					}
						
					//sucursal
					for (var i = 0; i < vm.data.sucursales.length; i++) {
						if (vm.data.sucursales[i].Id == vm.data.homologacion.IdSucursal) {
							vm.filter.sucursal = vm.data.sucursales[i];		
						}
					}
					//tipo Documento
					for (var i = 0; i < vm.data.tiposDocumentos.length; i++) {
						if (vm.data.tiposDocumentos[i].Id == vm.data.homologacion.IdTipoDocumento) {
							vm.filter.tipoDocumento = vm.data.tiposDocumentos[i];		
						}
					}					
					//servicio
					for (var i = 0; i < vm.data.servicios.length; i++) {
						if (vm.data.servicios[i].Id == vm.data.homologacion.IdServicio) {
							vm.filter.servicio = vm.data.servicios[i];		
						}
					}

					vm.data.valor = vm.data.homologacion.Valor;
				}
				
				vm.formControl.loading = false;
			}

			function activateError (pError) {
				vm.formControl.loading = false;
				vm.formControl.error = true;
			}

		};
	};

	return module;
})();