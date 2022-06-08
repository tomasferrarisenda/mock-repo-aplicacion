export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('BusquedaInternadoController', BusquedaInternadoController);

		// Inyección de Dependencia
		BusquedaInternadoController.$inject = ['$log', '$q', '$scope', '$filter','$uibModalInstance', 'DateUtils', 'ModalService',
			'AdmisionDataService'];

		// Constructor del Controller
		function BusquedaInternadoController ($log, $q, $scope, $filter, $uibModalInstance, DateUtils, ModalService,
			AdmisionDataService) {

				$log.debug('BusquedaInternadoController: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;
				vm.title = {
					// module: FACTURACION_INFO.title,
					page: 'Busqueda de Internado'
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
						apellido : '',
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
					apellido : '',
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
				    	{id: '3', tipoFecha: 'Ninguna'},
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
				// vm.sort = function(keyname){
			 //        $scope.sortKey = keyname;
			 //        $scope.reverse = !$scope.reverse;
			 //    };

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

				vm.sortBy = function(key) {
					$scope.sortKey = key;
					$scope.reverse = !$scope.reverse;
					vm.data.internados = $filter('orderBy')(vm.data.internados, key, $scope.reverse);
					getPage();
				};

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
					vm.data.filtrarInternado.apellido = vm.filter.apellido;
					vm.data.filtrarInternado.nroDocumento = vm.filter.nroDocumento;
					vm.data.filtrarInternado.tipoFecha = vm.filter.opcionComboTipoFecha.tipoFecha;

					if (vm.filter.opcionComboTipoFecha.id == 3) 
					//No filtar por fecha, ojo que a BE trae tooooodos los internados TODO
					{
						vm.data.filtrarInternado.fechaDesde = '';
						vm.data.filtrarInternado.fechaHasta = '';
					}
					else
					{
						//vm.data.filtrarInternado.fechaDesde = $filter('date')(vm.filter.fechaDesde, 'dd/MM/yyyy');
						//vm.data.filtrarInternado.fechaHasta = $filter('date')(vm.filter.fechaHasta, 'dd/MM/yyyy');
						vm.data.filtrarInternado.fechaDesde = DateUtils.parseToBeParams(vm.filter.fechaDesde);
						vm.data.filtrarInternado.fechaHasta = DateUtils.parseToBeParams(vm.filter.fechaHasta);
					}
					vm.formControl.loading = true;
					AdmisionDataService.getInternados(vm.data.filtrarInternado)
						.then(function (pResult) {
							vm.data.internados = pResult;
							vm.filter.internados = pResult;
							for (var i = 0; i < vm.data.internados.length; i++) {
								if(vm.data.internados[i].FechaAltaMedica == "0001-01-01T00:00:00")
									vm.data.internados[i].FechaAltaMedica = "";
							}
							vm.paginacion.getPage();
							vm.formControl.loading = false;
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
					if (vm.filter.apellido == null)
						vm.filter.apellido = '';
					if (vm.filter.nroDocumento == null)
						vm.filter.nroDocumento = '';
					if (vm.filter.fechaDesde == null)
						vm.filter.fechaDesde = '';
					if (vm.filter.fechaHasta == null)
						vm.filter.fechaHasta = '';
				}

				function inicializarFechas(){
					vm.filter.fechaDesde = new Date();
					vm.data.filtrarInternado.fechaDesde = vm.filter.fechaDesde;
					vm.filter.fechaHasta = vm.filter.fechaDesde;
					vm.data.filtrarInternado.fechaHasta = vm.filter.fechaHasta;
					
					// vm.data.filtrarInternado.tipoFecha = 'Alta';
				}

				function internadoSeleccion(){
					vm.formControl.internadoElegido = true;
				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();

				function activate () {
					$log.debug('BusquedaInternadoController: Inicializar ON.-');
					// vm.formControl.loading = true;

					inicializarFechas();
					vm.paginacion.currentPage = 1;
 					vm.paginacion.pageSize = 10;
					vm.paginacion.getPage();
					vm.formControl.error = false;

					// $q.all([AdmisionDataService.getInternados(vm.data.filtrarInternado)])
					// .then(activateOk, activateError);
				}

				function activateOk (pResults) {
					vm.data.internados = pResults[0];
					vm.filter.internados = vm.data.internados;

					vm.formControl.loading = false;
				}

				function activateError (pError) {
					vm.formControl.loading = false;					
					ModalService.error(pError.message);
				}
			}
	};
	return module;

})();