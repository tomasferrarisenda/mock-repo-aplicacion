import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchInternadosController', SearchInternadosController);

		// Inyección de Dependencia
		SearchInternadosController.$inject = ['$log', '$scope', '$filter','$uibModalInstance', 'User',
			'FACTURACION_INFO', 'SupportDataService'];

		// Constructor del Controller
		function SearchInternadosController ($log, $scope, $filter, $uibModalInstance, User,
			FACTURACION_INFO, SupportDataService: ISupportDataService) {

				$log.debug('SearchInternadosController: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;
				vm.user = User;
				vm.title = {
					module: FACTURACION_INFO.title,
					page: 'Search Internados'
				};

				vm.formData = {
					internadoSeleccionado : null,
					returnInternado : returnInternado
				};

				vm.formControl = {
					error : true,
					loading : false,
					replicarCodigo : replicarCodigo,
					cancel : cancel,
					internadoSeleccion : internadoSeleccion,
					internadoElegido : false
				};

				vm.data = {
					internados : [],
					internadoSeleccionado : '',
					filtrarInternado : {
						codigoDesde : '',
						codigoHasta : '',
						nombre : '',
						nroDocumento : '',
						fechaDesde : '',
						fechaHasta : '',
						tipoFecha : '',
					},
					hoy : ''
				};

				vm.filter = {
					internados : [],
					codigoDesde : '',
					codigoHasta : '',
					nombre : '',
					nroDocumento : '',
					fechaDesde : '',
					fechaHasta : '',
					tipoFecha : '',
					comboTipoFecha: 
					[
				    	{id: '1', tipoFecha: 'Alta'},
				        {id: '2', tipoFecha: 'Ingreso'},
				        {id: '3', tipoFecha: 'Ninguna'},
				    ],
				    opcionComboTipoFecha:
				    	{id: '1', tipoFecha: 'Alta'},
				    filtrarInternados : filtrarInternados,
				    validar : validarFilters
				};

				vm.paginacion = {
					currentPage: 0,
					pageSize: 10,
					totalItems: 0,
					pageChanged : getPage,
					getPage: getPage
				};
				/* ---------------------------------------- Paginacion --------------------------------------------- */
				vm.sort = function(keyname){
			        $scope.sortKey = keyname;
			        $scope.reverse = !$scope.reverse;
			    };

				function getPage () { 	
 					vm.filter.validar();
					vm.filter.internados = vm.data.internados;

 					var cantidadRegistros = vm.filter.internados.length;
 					var cantidadPaginas : any = cantidadRegistros / vm.paginacion.pageSize;

 					if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
 						cantidadPaginas = cantidadPaginas + 1;

 					if (cantidadPaginas < vm.paginacion.currentPage) {
 						vm.paginacion.currentPage = 1;	
 					}

					var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;					
			
					vm.paginacion.totalItems = vm.filter.internados.length;					
					vm.filter.internados = vm.filter.internados.slice(begin, end);		                        
				}

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function replicarCodigo() {
					vm.filter.codigoHasta = vm.filter.codigoDesde;					
				}

				function filtrarInternados() {
					validarFilters();
					vm.data.filtrarInternado.codigoDesde = vm.filter.codigoDesde;
					vm.data.filtrarInternado.codigoHasta = vm.filter.codigoHasta;
					vm.data.filtrarInternado.nombre = vm.filter.nombre;
					vm.data.filtrarInternado.nroDocumento = vm.filter.nroDocumento;
					vm.data.filtrarInternado.tipoFecha = vm.filter.opcionComboTipoFecha.tipoFecha;

					if (vm.filter.opcionComboTipoFecha.id == 3) //No filtar por fecha, ojo que a BE trae tooooodos los internados TODO
					{
						vm.data.filtrarInternado.fechaDesde = '';
						vm.data.filtrarInternado.fechaHasta = '';
					}
					else
					{
						vm.data.filtrarInternado.fechaDesde = $filter('date')(vm.filter.fechaDesde, 'dd/MM/yyyy');
						vm.data.filtrarInternado.fechaHasta = $filter('date')(vm.filter.fechaHasta, 'dd/MM/yyyy');
					}
					
					SupportDataService.getInternados(vm.data.filtrarInternado)
						.then(function (pResult) {
							$log.debug('Message', pResult);
							vm.data.internados = pResult;
							vm.filter.internados = pResult;
							$log.debug('Message', vm.filter.internados);
							vm.paginacion.getPage();
						});
				}

				function returnInternado () {
 					$uibModalInstance.close(vm.formData.internadoSeleccionado);
 				}

 				//Comentado para futuro uso si es que amerita
				// function formatearFecha(date) {
				//     var pDia = new Date(date),

				//         mes = '' + (pDia.getMonth() + 1),
				//         dia = '' + pDia.getDate(),
				//         anio = pDia.getFullYear();
				//     if (mes.length < 2) mes = '0' + mes;
				//     if (dia.length < 2) dia = '0' + dia;

				//     return [dia, mes, anio].join('/');
				// }

				function validarFilters () {
 					if (vm.filter.codigoDesde == null)
						vm.filter.codigoDesde = '';
					if (vm.filter.codigoHasta == null)
						vm.filter.codigoHasta = '';
					if (vm.filter.nombre == null)
						vm.filter.nombre = '';
					if (vm.filter.nroDocumento == null)
						vm.filter.nroDocumento = '';
					if (vm.filter.fechaDesde == null)
						vm.filter.fechaDesde = '';
					if (vm.filter.fechaHasta == null)
						vm.filter.fechaHasta = '';
				}

				function inicializarFechas(){
					vm.filter.fechaDesde = new Date();
					vm.data.filtrarInternado.fechaDesde = new Date();;


					vm.data.hoy = new Date();
					vm.filter.fechaHasta = new Date();
					vm.data.filtrarInternado.fechaHasta = new Date();
					
					vm.data.filtrarInternado.tipoFecha = 'Alta';
				}

				function internadoSeleccion(){
					vm.formControl.internadoElegido = true;
				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();

				function activate () {
					$log.debug('SearchInternadosController: Inicializar ON.-');
					vm.formControl.loading = true;

					inicializarFechas();

					SupportDataService.getInternados(vm.data.filtrarInternado)
					.then(activateOk, activateError);
				}

				function activateOk (pResults) {
					vm.data.internados = pResults;
					vm.filter.internados = vm.data.internados;
					$log.debug('Message',vm.filter.internados);

					vm.formControl.error = false;
					vm.formControl.loading = false;
					vm.paginacion.currentPage = 1;
 					vm.paginacion.pageSize = 10;
					vm.paginacion.getPage();
				}

				function activateError (pError) {
					vm.formControl.loading = false;
				}
			}
	};
	return module;

})();