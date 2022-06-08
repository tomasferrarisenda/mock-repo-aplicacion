/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export default class {

	public static init(ngModule : angular.IModule) {
		
		ngModule.controller('AdmisionListController', AdmisionListController2);
		
		AdmisionListController2.$inject = [
			'$filter', '$location', 'Logger', '$q', '$state', '$stateParams',
			'AdmisionDataService', 'ModalService', 'AdmisionAuthService',
			// Injectado por state
			'Solicitudes',
			'User'
		];
		
		function AdmisionListController2 (
			$filter, $location, $log, $q, $state, $stateParams,
			AdmisionDataService, ModalService, AdmisionAuthService,
			// Injectado por state
			Solicitudes,
			User) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */
		
			$log = $log.getInstance('AdmisionListController');
			$log.debug('ON.-');
		
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
		
			var vm = this;
			vm.title = {
				page : $state.current.data.title,
				icon : $state.current.data.icon
			};
		
			vm.data = {
				internaciones: []
			};
		
			vm.formControl = {
				loading: false,
				error: false,
				reloadPage: reloadPage
			};
		
			vm.filter = {
				internaciones : [],
				numeroSolicitud : '',
				tipoDocumento : '',
				numeroDocumento : '',
				nombreCompletoPaciente : '',
				sucursal : '',
				clean : cleanFilters
			};
			
			vm.paginacion = {
				currentPage : 0,
				pageSize : 0,
				totalItems : 0,
				pageChanged : pageChanged
				// getPage : getPage
			};
		
			vm.validar = {
				puedeAdmitir : validarPuedeAdmitir
			};
		
			vm.internacion = {
				new : newAdmision,
				buscar : buscarSolicitudes
			};
		
			vm.admitir = admitirPaciente;
		
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------ */
		
			function reloadPage() {
				$state.reload();
			}
			/* VALIDACIONES */
		
			function validarPuedeAdmitir () {
				return AdmisionAuthService.puedeAdmitir(User);
			}
		
			function buscarSolicitudes () {
				var idSucursal = 0;
				if (vm.filter.sucursal && vm.filter.sucursal.id_sucursal) {
					idSucursal = vm.filter.sucursal.id_sucursal;
				}
		
				$state.go('admision.list', {
					idSolicitud : vm.filter.numeroSolicitud,
					numeroDocumento : vm.filter.numeroDocumento,
					nombrePaciente : vm.filter.nombreCompletoPaciente,
					idSucursal : idSucursal,
					page : 0
				});
			}
		
			/* PAGINACIÓN */
		
			function cleanFilters () {
				vm.filter.tipoDocumento = '';
				vm.filter.numeroDocumento = '';
				vm.filter.nombreCompletoPaciente = '';
				vm.filter.numeroSolicitud = '';
				vm.filter.sucursal = '';
				buscarSolicitudes();
				// getPage();
			}
		
			function pageChanged (pPage) {
				$state.go('admision.list', {page:pPage -1});
			}
			/* INTERNACION */
		
			function newAdmision () {
				var _id : any = '';
				ModalService.prompt('Ingrese el número de solicitud de internación','',
					function (pIdInternacion) {
						if (pIdInternacion) {
							_id = parseInt(pIdInternacion);
							if (_id) {
								AdmisionDataService.existeParaAdmitir(_id)
								.then(function (pResponse) {
									if (pResponse) {
										admitirPaciente(_id);
									} else {
										ModalService.info('El número de solicitud ingresado no existe o ya fué ingresado.');
									}
								});
							} else {
								ModalService.warn('No es un número válido.');
							}
						}
					});
			}
		
			function admitirPaciente (pIdInternacion) {
				if (validarPuedeAdmitir()) {
					$state.go('admision.new', {idSolicitud:pIdInternacion});					
				}
			}
		
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
		
			activate();
		
			function activate () {
				$log.debug('Inicializar OK.-');
				vm.filter.internaciones = Solicitudes.Result;
				vm.paginacion.currentPage = $stateParams.page + 1;
				 vm.paginacion.pageSize = Solicitudes.PageSize;
				 vm.paginacion.totalItems = Solicitudes.TotalCount;
				 vm.filter.numeroSolicitud = $stateParams.idSolicitud || '';
				 vm.filter.nombreCompletoPaciente = $stateParams.nombrePaciente || '';
				 vm.filter.numeroDocumento = $stateParams.numeroDocumento || '';
				 if ($stateParams.idSucursal) {
					 $log.debug('idSucursal',parseInt($stateParams.idSucursal));
					 vm.filter.sucursal = {
						 id_sucursal : parseInt($stateParams.idSucursal)
					 };
						 
				 }
				 else 
					 vm.filter.sucursal = '';
				 // getPage();
			 }
		}
	}
}