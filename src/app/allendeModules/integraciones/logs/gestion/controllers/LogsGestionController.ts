import * as angular from 'angular';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('LogsGestionController', LogsGestionController);

		// Inyección de Dependencia
		LogsGestionController.$inject = ['$log', '$q', '$filter', '$scope','$state', 'ModalService', 'SupportLogicService', 'User', 
			'uiGridConstants', 'LogsGestionDataService', 'LogsGestionLogicService'];

		// Constructor del Controller
		function LogsGestionController ($log, $q, $filter, $scope, $state, ModalService, SupportLogicService, User, 
			uiGridConstants, LogsGestionDataService, LogsGestionLogicService) {

				$log.debug('LogsGestionController: ON.-');
				
				var vm = this;

				vm.user = User;
				vm.title = {
					module: 'INTEGRACIONES',
					page: 'Lista de Bandejas'
				};	

				vm.data = {
					itemsBandeja: [],
					tiposBandeja: [],
					tiposOrigen: [],
					subtiposOrigen: [],
					estadosBandeja: []
				};

				vm.filter = {
					itemsBandeja : [], 
					tipoBandeja : '',
					tipoOrigen : '',
					subtipoOrigen : '',
					estadoBandeja : '',
					idOrigen : '',
					origen : '',
					fecActualD : new Date(),
					fecActualH : new Date(),
					checkAll : false,
					clean : cleanFilters,
					validar : validarFilters
				};

				vm.paginacion = {
					currentPage: 0,
					pageSize: 100,
					totalItems: 0,
					pageChanged : pageChanged
				};	

				vm.formControl = {
					error: true,
					loading: false,
					reloadPage: activate,
					verDetalle: verDetalle,
					buscar: buscar,
					reenviar : reenviar,
					reenviarItems: reenviarItems,
					cmbTipoOrigenChange : cmbTipoOrigenChange,
					checkItems : checkItems,
					volver : volver
				};

				function cmbTipoOrigenChange(){
					if (vm.filter.tipoOrigen != null && vm.filter.tipoOrigen != '') {
						vm.data.subtiposOrigen = vm.filter.tipoOrigen.SubTipos;		
					}
					else {
						vm.data.subtiposOrigen = [];
					}

				}
				
				function checkItems(){
				 	for (var i = vm.filter.itemsBandeja.length - 1; i >= 0; i--) {
				 		if(vm.filter.itemsBandeja[i].PuedeReenviar) {
				 			vm.filter.itemsBandeja[i].Seleccionado = vm.filter.checkAll;
				 		}	
				 	}
				}

				function reenviar(pId) {
					var idtipoBandeja = 0;
					if (vm.filter.tipoBandeja != null && vm.filter.tipoBandeja != '')
						idtipoBandeja = vm.filter.tipoBandeja.Id;


					ModalService.confirm('¿Desea reprocesar el item?',
					function (pResult) {
						if (pResult) {
							LogsGestionDataService.reenviar(idtipoBandeja, pId)
								.then(function (result) {
									buscar();
								})
								.catch(function (pError) {
									ModalService.error(pError.message);
									return;
								});	
						}		
					});	
 				}
 				
 				function reenviarItems() {
 					var idtipoBandeja = 0;
					if (vm.filter.tipoBandeja != null && vm.filter.tipoBandeja != '')
						idtipoBandeja = vm.filter.tipoBandeja.Id;

 					var ids = '';
 					for (var i = vm.filter.itemsBandeja.length - 1; i >= 0; i--) {
				 		if(vm.filter.itemsBandeja[i].Seleccionado == true) {
				 			if(ids == '') { 
				 				ids = vm.filter.itemsBandeja[i].Id;
				 			}
				 			else {
				 				ids = ids + ',' + vm.filter.itemsBandeja[i].Id;	
				 			}	
				 		}	
				 	}

				 	if(ids == '') {
				 		ModalService.info('Debe seleccionar al menos un item.');
				 		return;
				 	}

					ModalService.confirm('¿Desea reprocesar los items seleccionados?',
					function (pResult) {
						if (pResult) {
							LogsGestionDataService.reenviarItems(idtipoBandeja, ids)
								.then(function (result) {
									buscar();
								}, function (pError) {
									ModalService.error(pError.message);
									return;
								});	
						}		
					});	
 				}

				function verDetalle(pId) {
					var idtipoBandeja = 0;
					if (vm.filter.tipoBandeja != null && vm.filter.tipoBandeja != '')
						idtipoBandeja = vm.filter.tipoBandeja.Id;

					LogsGestionDataService.itemView = null;
					LogsGestionDataService.getItemPorIdParaView(idtipoBandeja, pId)
						.then(function (result) {
							LogsGestionDataService.itemView = result;

							LogsGestionLogicService.viewItem()
		 						.then(function (argument) {
		 							activate();
		 						})
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
							return;
						});	
 				}	

 				vm.sort = function(keyname){
			        $scope.sortKey = keyname;   //set the sortKey to the param passed
			        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
			    }

 				/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

 				function inicializarVariables () {					
					vm.data.itemsBandeja = [];
					vm.data.tiposBandeja = [];					
					vm.data.tiposOrigen = [];
					vm.data.subtiposOrigen = [];
					vm.data.estadosBandeja = [];
				}

 				/* PAGINACIÓN */

 				function cleanFilters () {
					vm.filter.itemsBandeja = ''; 
					vm.filter.tipoBandeja = '';				
					vm.filter.tipoOrigen = '';
					vm.filter.subtipoOrigen = '';
					vm.filter.estadoBandeja = '';
					vm.filter.idOrigen = '';
					vm.filter.origen = '';

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageChanged();
 				}

 				function validarFilters () {
 					if (vm.filter.tipoBandeja == null)
						vm.filter.tipoBandeja = '';
					if (vm.filter.tipoOrigen == null)
						vm.filter.tipoOrigen = '';
					if (vm.filter.subtipoOrigen == null)
						vm.filter.subtipoOrigen = '';
					if (vm.filter.estadoBandeja == null)
						vm.filter.estadoBandeja = '';
 				}

 				function pageChanged (pPage) {
 					if(!angular.isUndefined(pPage) && pPage != null) {
						vm.paginacion.currentPage = pPage;
						buscar();
					}
				}

				function getFormattedDate(fecha) {
				  var date = new Date(fecha);
				  var year = date.getFullYear();
				  var month = (1 + date.getMonth()).toString();
				  month = month.length > 1 ? month : '0' + month;
				  var day = date.getDate().toString();
				  day = day.length > 1 ? day : '0' + day;
				  return   year + '-' +  month + '-' + day;
				}

				function buscar() {

					vm.formControl.loading = true;

					var fechaD : any = new Date();
					if(vm.filter.fecActualD != null) {
						fechaD = getFormattedDate(vm.filter.fecActualD);
					}
					else {
						if (vm.filter.fecActualD.value!= '') {
							fechaD = vm.filter.fecActualD.value;
						}	
					}									
					
					var fechaH : any = new Date();					
					if(vm.filter.fecActualH != null) {
						fechaH = getFormattedDate(vm.filter.fecActualH);
					} else {
						if (vm.filter.fecActualH.value!= '')
							fechaH = vm.filter.fecActualD.value;	
					}									

					var idtipoBandeja = 0;
					if (vm.filter.tipoBandeja != null && vm.filter.tipoBandeja != '')
						idtipoBandeja = vm.filter.tipoBandeja.Id;

					var idtipoOrigen = 0;
					if (vm.filter.tipoOrigen != null && vm.filter.tipoOrigen != '')
						idtipoOrigen = vm.filter.tipoOrigen.Id;

					var idsubtipoOrigen = 0;
					if (vm.filter.subtipoOrigen != null && vm.filter.subtipoOrigen != '')
						idsubtipoOrigen = vm.filter.subtipoOrigen.Id;

					var idestadoBandeja = 0;
					if (vm.filter.estadoBandeja != null && vm.filter.estadoBandeja != '')
						idestadoBandeja = vm.filter.estadoBandeja.Id;

					var _idOrigen = 0; 
					if (vm.filter.idOrigen != null && vm.filter.idOrigen != '')
						_idOrigen = vm.filter.idOrigen;

					var _origen = ' ';
					if(vm.filter.origen != null && vm.filter.origen != '')
						_origen = vm.filter.origen;

					if(_origen == null || _origen == '' || angular.isUndefined(_origen))
						_origen = ' ';

					$log.debug('origen', _origen);

					var currentPage = 0;
					if (!angular.isUndefined(vm.paginacion.currentPage) && vm.paginacion.currentPage > 0) {
						currentPage = vm.paginacion.currentPage - 1;	
					}

					var _items = LogsGestionDataService.obtenerPorFiltro(idtipoBandeja, fechaD, fechaH, idtipoOrigen, idsubtipoOrigen, _idOrigen, 
							idestadoBandeja, _origen, currentPage, vm.paginacion.pageSize);

					$q.all([_items])
						.then(function (result) {								
								vm.data.itemsBandeja = result[0].Result;	
								vm.filter.itemsBandeja = vm.data.itemsBandeja;									
				 				vm.paginacion.pageSize = result[0].PageSize;
				 				vm.paginacion.totalItems = result[0].TotalCount;
								vm.formControl.loading = false;
							}
						)
						.catch(function (pError) {
								vm.formControl.loading = false;
								ModalService.error(pError.message);
							}
						);
				}
				
				function volver(){
					$state.go('homesistemas');
				}

				/* ---------------------------------------- ACTIVATE ---------------------------------------- */

 				activate();

				function activate () {
					vm.formControl.loading = true;

					var _tiposBandeja = LogsGestionDataService.getAllTiposBandeja();					
					var _tiposOrigen = LogsGestionDataService.getAllTiposOrigen();
					var _estadosBandeja = LogsGestionDataService.getAllEstadosBandeja();

					$q.all([_tiposBandeja, _tiposOrigen, _estadosBandeja])
					.then(activateOk, activateError);					
				}

				function activateOk (results) {
					vm.filter.checkAll = false;

					vm.data.tiposBandeja = results[0];
					vm.data.tiposOrigen = results[1];	
					vm.data.estadosBandeja = results[2];	

					vm.filter.tipoBandeja = vm.data.tiposBandeja[3];															
					vm.filter.tipoOrigen = vm.data.tiposOrigen[0];
					
					cmbTipoOrigenChange();

					vm.formControl.error = false;
					vm.formControl.loading = false;

					//cleanFilters();
					
					vm.paginacion.currentPage = 0;
				}

				function activateError (pError) {
					vm.formControl.loading = false;
					ModalService.error(pError.message);
				}

		}

	};

	return module;

})();