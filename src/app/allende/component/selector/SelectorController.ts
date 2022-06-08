/**
 * @author 			Pablo Pautasso
 * @description 	Controller para el selector generico por DataService
 */
import * as angular from 'angular';
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };
	
	module.init = function(ngModule) {

		ngModule.controller('SelectorController', SelectorController);

		// Inyección de Dependencia
		SelectorController.$inject = ['Logger', '$q', '$uibModalInstance', 'DataService', 'Metodo', 'NombreSelector',
			'IsTableBackend', 'Parametro', 'Columnas', 'AlertaService','LabelWait'
		];

		// Constructor del Controller
		function SelectorController($log, $q, $uibModalInstance, DataService, Metodo, NombreSelector,
			IsTableBackend, Parametro, Columnas, AlertaService, LabelWait) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SelectorController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.nombreSelector = NombreSelector;
			vm.parametro = Parametro;
			vm.columnas = Columnas;

			vm.dataParsed;
			
			vm.labelWait = LabelWait;

			vm.formControl = {
				error: true,
				loading: false,

				ok: selectOk,
				cancel: cancel,

				isTableBackEnd: IsTableBackend,
				selectRow: selectRow
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function selectOk() {

			}


			function cancel() {
				$uibModalInstance.dismiss("cancelar modal");
			}

			function selectRow(row) {

				$log.debug('select row', row);
				if(!angular.isUndefined(row.data))
				$uibModalInstance.close(row.data);
				else $uibModalInstance.close(row);
			}


			vm.buscarPagina = function(pPagination) {

				var currentPage = pPagination.currentPage;
				var pageSize = pPagination.pageSize || 10;

				vm.parametro.CurrentPage = currentPage;
				vm.parametro.PageSize = pageSize;

				searchSelector();

			};

			function inicializarColumnas() {

				var _columnas: Array<any> = [] ;

				angular.forEach(vm.columnas, function (columna) {
					
					_columnas.push({
						label: columna,
						field: columna
					})

				});

				vm.dataParsed = angular.copy(_columnas);

			}


			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();

			function activate() {

				searchSelector();
				inicializarColumnas();

			}


			function activateOk(pResults) {

				$log.debug('activateOk OK.-', pResults);
				// chequeamos el valor del label para el loading
				// if(vm.labelWait === false){
				// 	vm.labelWait = 'Aguarde unos segundos...';
				// }

				if(pResults.length !== 0){

					if(IsTableBackend){

						if(pResults.Rows.length !== 0){
						vm.data = angular.copy(pResults);
						}else $uibModalInstance.close(false);
						
					}else
					vm.data = angular.copy(pResults);
				}else {
					
					$uibModalInstance.close(false);
				}

			
				vm.formControl.loading = false;

			}

			function activateError(pError) {
				vm.formControl.loading = false;

			}


			function searchSelector() {

				var dataCall;
				vm.formControl.loading = true;

				if (angular.isFunction(DataService[Metodo])) {

					if (vm.parametro) {
						dataCall = DataService[Metodo].call(DataService, vm.parametro);
					}else dataCall = DataService[Metodo].call(DataService);

					dataCall.then(activateOk, activateError);
				} else {
					$log.error('Error', "El " + Metodo + " no es una funcion");
					cancel();
				}
			}

		}
	};

	return module;
})();