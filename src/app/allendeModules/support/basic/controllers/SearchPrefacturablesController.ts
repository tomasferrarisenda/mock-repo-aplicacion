import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchPrefacturablesController', SearchPrefacturablesController);

		// Inyección de Dependencia
		SearchPrefacturablesController.$inject = ['$log', '$scope','$uibModalInstance', 'tipoPrefacturable',
			'FACTURACION_INFO', 'SupportDataService', 'PrefacturableDataService', 'TIPO_PREFACTURABLE', '$q', 'deshabilitarTipo'];

		// Constructor del Controller
		function SearchPrefacturablesController ($log, $scope, $uibModalInstance, tipoPrefacturable,
			FACTURACION_INFO, SupportDataService: ISupportDataService, PrefacturableDataService, TIPO_PREFACTURABLE, $q, deshabilitarTipo) {

			$log.debug('SearchPrefacturablesController: ON.-');

			/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

			var vm = this;
			vm.title = {
				module: FACTURACION_INFO.title,
				page: 'Search Prefacturables'
			};

			vm.formControl = {
				error : true,
				loading : false,
				cancel : cancel,
				filtrarPrefacturables : filtrarPrefacturables,
				prefacturableSeleccion : prefacturableSeleccion,
				//seleccionarTipoNomenclador : seleccionarTipoNomenclador,
				limpiarFiltros : limpiarFiltros
			};

			vm.data = {
				prefacturables : [],
				filtrarPrefacturable : {},
				deshabilitarTipo : false
			};

			vm.filter = {
				prefacturables : [],
				codigo : '',
				nombre : '',
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

			// function seleccionarTipoNomenclador(){
			// 	if(vm.filter.tipoPrefacturableElegido.Id == TIPO_PREFACTURABLE.CODIGO_NOMENCLADOR){
			// 		vm.data.tipoPrefacturables[TIPO_PREFACTURABLE.CODIGO_NOMENCLADOR-1].listaNomenclador[0];
			// 	}
			// }

			function getPage () {
				vm.filter.validar();
				vm.filter.prefacturables = vm.data.prefacturables;

				var cantidadRegistros = vm.filter.prefacturables.length;
				var cantidadPaginas : any = cantidadRegistros / vm.paginacion.pageSize;

				if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;	
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
		
				vm.paginacion.totalItems = vm.filter.prefacturables.length;
				vm.filter.prefacturables = vm.filter.prefacturables.slice(begin, end);
			}

			/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */

			function cargarComboTipos(){
				var def = $q.defer();
				PrefacturableDataService.obtenerPrefacturablesConNomenclador()
				.then(function (tiposPrefacturable) {
					def.resolve(tiposPrefacturable);
				}).catch(function(error){
					def.reject(error);
				});
				return def.promise;
			}

			function filtrarPrefacturables() {
				if(vm.filter.tipoPrefacturableElegido) vm.data.filtrarPrefacturable.IdTipoPrefacturable = vm.filter.tipoPrefacturableElegido.Id;
				if(vm.filter.tipoNomenclador) vm.data.filtrarPrefacturable.IdTipoNomenclador = vm.filter.tipoNomenclador.Id;
				if(vm.filter.codigo) vm.data.filtrarPrefacturable.CodigoDesde = vm.filter.codigo;
				if(vm.filter.codigo) vm.data.filtrarPrefacturable.CodigoHasta = vm.filter.codigo;
				if(vm.filter.nombre) vm.data.filtrarPrefacturable.Nombre = vm.filter.nombre;
				if(vm.filter.descripcion) vm.data.filtrarPrefacturable.Descripcion = vm.filter.descripcion;
				

				SupportDataService.ObtenerPrefacturablePorFiltro(vm.data.filtrarPrefacturable)
					.then(function (pResult) {
						vm.data.prefacturables = pResult;
						vm.filter.prefacturables = pResult;
						vm.paginacion.getPage();
					});
				vm.data.filtrarPrefacturable = {};
			}

			function validarFilters () {
				if (vm.filter.codigo == null)
					vm.filter.codigo = '';
				if (vm.filter.nombre == null)
					vm.filter.nombre = '';
			}

			function limpiarFiltros(){
				vm.filter.tipoNomenclador = null;
				vm.filter.tipoPrefacturableElegido = vm.data.tipoPrefacturables[0];
				vm.filter.codigo = '';
				vm.filter.nombre = '';
				vm.filter.descripcion = '';
			}

			function prefacturableSeleccion(prefacturable){
				$uibModalInstance.close(prefacturable);
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;

				cargarComboTipos().then(function(tiposPrefacturable){
					vm.data.tipoPrefacturables = tiposPrefacturable;
					for (let i = 0; i < vm.data.tipoPrefacturables.length; i++) {
						if(vm.data.tipoPrefacturables[i].Id === tipoPrefacturable){
							vm.filter.tipoPrefacturableElegido = vm.data.tipoPrefacturables[i];
							break;
						}
					}

					vm.data.deshabilitarTipo = deshabilitarTipo;

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 10;
					vm.paginacion.getPage();
				});
				

				vm.formControl.loading = false;
			}
		}
	};
	return module;

})();