/**
 * @author:			Pablo Pautasso
 * @description:	Directiva para grilla de primer turno  
 * @type:			Directive
 **/
import * as angular from 'angular';

 import saGridPrimerTurnoView = require('../templates/sa-grid-primer-turno.tpl.html');


export default (function () {
   'use strict';


	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.directive('saGridPrimerTurno', saGridPrimerTurno);

		saGridPrimerTurno.$inject = ['$log', 'uiGridConstants',  'moment'];

		function saGridPrimerTurno($log, uiGridConstants,  moment) {
			return {
				restrict: 'E',
				scope: {
					data: '=',
					titulogrid: '@?',
					multiselect: '<',

					//boton otorgar
					minRows: '<?',
					extraColumn: '=?',
					btnOtorgar: '&?',
					btnOtorgarText: '@?',
					duracionturno: '=?',
					doubleClickFunction: '&?'
				},
				template: saGridPrimerTurnoView,
				link: linkFunction
			};

			function linkFunction(scope, element, attrs) {

				scope.btnClick = btnClick;

				scope.minRows = (angular.isUndefined(scope.minRows)) ? 5 : scope.minRows;

				scope.$watch(function() {
					return scope.data;
				}, function(pNewVal) {
					scope.data = pNewVal;
					if(scope.data){
						angular.forEach(scope.data, function(row, key){
							row.IdRow = key;
						});
					}
					scope.gridOptions.data = angular.copy(scope.data);
				});

				scope.$watch(function() {
					return scope.duracionturno;
				}, function(pNewVal) {
					$log.debug('duracion turno', pNewVal);
					scope.duracionturno = pNewVal;

				});

				scope.gridOptions = {
					onRegisterApi: function(gridApi) {
						scope.gridApi = gridApi;
						gridApi.selection.on.rowSelectionChanged(scope, onRowSelectionChange);
						//gridApi.selection.on.rowSelectionChangedBatch(scope, onRowSelectionChange);
					},
					data: scope.data,
					enableSorting: false, // Habilitar orden para todas las columnas, se deshabilita por la que no se quiere
					enableGridMenu: false,
					enableColumnResizing: true,
					enableRowSelection: true,
					enableFullRowSelection: true, // Habilita seleccionar fila completa
					multiSelect: false, // Habilita multiple selecicón
					enableRowHeaderSelection: false, // Habilita columna de seleccion con check
					enableColumnMenus: false, // Habilita menu por header
					enableFiltering: false, // Habilita filtros en header
					exporterMenuPdf: false, // Habilita la opcion de exportar pdf
					minRowsToShow: scope.minRows,
					rowTemplate: rowTemplate(),
					columnDefs: [{
						name: 'Recurso',
						width: '45%',
						field: 'Recurso',
						minWidth: 80,
						//cellClass: 'text-center',
					}, {
						name: 'Fecha',
						field: 'Fecha',
						width: '30%',
						type: 'date',
						cellFilter: 'date:"dd-MM-yyyy"',
						sort: {
							direction: uiGridConstants.ASC,
							priority: 0
						}
					}, {
						name: 'Hora',
						field: 'Hora',
						width: '15%',
						sort: {
							direction: uiGridConstants.ASC,
							priority: 1
						}
						///cellClass: 'text-center',
					}, {
						name: 'Suc.',
						field: 'AbreviaturaSucursal',
						width: '10%',
						cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {


								return 'background: ' + row.entity.ColorSucursal;
							}
							//cellClass: 'text-center',
					}]
				};


				function rowTemplate() {

					var ret;

					if (scope.doubleClickFunction) {
						ret = '<div ng-dblclick="grid.appScope.rowDblClick(row)" >' +
							'  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
							'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
							'</div>';
					} else ret = false;

					return ret;
				}

				scope.rowDblClick = function(row) {


					scope.doubleClickFunction({
						pObject: row.entity
					});
				};

				// function rowDblClick(row) {
				// 	alert(JSON.stringify(row.entity));
				// }

				function btnClick() {

					var currentSelection = scope.gridApi.selection.getSelectedRows();

					scope.btnOtorgar({
						pObject: currentSelection
					});
				}

				// function onRowSelectionChange(data) {


				// 	if (scope.duracionturno) {
				// 		$log.debug('tengo duracion de turno', scope.duracionturno);
				// 		scope.gridOptions.multiSelect = true;
				// 		$log.debug('todos los turnos de la lista', scope.data);


				// 		//pregunto si la duracion del turno selected es menor que la regla
				// 		var selectedRows = scope.gridApi.selection.getSelectedRows();
				// 		var sumDuracion = 0;



				// 		angular.forEach(selectedRows, function(row, key) {
				// 			$log.debug('selection', row);
				// 			sumDuracion = sumDuracion + row.DuracionIndividual;
				// 		});

				// 		if (sumDuracion < scope.duracionturno.DuracionIndividual) {


				// 			//scope.duracionturno.DuracionIndividual desde duracion tipo regla
				// 			//comparamos con el turno seleccionado

				// 			if (data.entity.DuracionIndividual < scope.duracionturno.DuracionIndividual) {


				// 				//consulto si tiene duracion individual e turno
				// 				if (data.entity.DuracionIndividual) {

				// 					var horaTurnoProximo = moment(data.entity.Hora, 'HH:mm').
				// 					add(data.entity.DuracionIndividual, 'minutes');

				// 					//busco si el siguiente turno esta disponible
				// 					//

				// 					angular.forEach(scope.data, function(turno, key) {

				// 						if (turno.Hora === horaTurnoProximo.format('HH:mm') && turno.IdRecurso === data.entity.IdRecurso) {

				// 							scope.gridApi.selection.selectRow(scope.gridOptions.data[key]);

				// 						}

				// 					});

				// 				} else return;

				// 			}
				// 		} else {

				// 			//voy a preguntar si el seleccionado esta ya seleccionado
				// 			angular.forEach(selectedRows, function(rowT, key) {
				// 				if (data.entity.IdRow === rowT.IdRow) {
				// 					data.entity.isSelected = false;
				// 				}
				// 			});
				// 		}

				// 	} else scope.gridOptions.multiSelect = false;


				// 

				function onRowSelectionChange(data) {

					if(scope.duracionturno){

						$log.debug('click row',data);

					}else scope.gridOptions.multiSelect = false;
				}

				/* ---------------------------------------------- EXTRA COLUMN DATA------------------------------- */

				if (scope.extraColumn) {

					scope.gridOptions.columnDefs.unshift(scope.extraColumn);
				}

				scope.gridOptions.data = scope.data;
			}
		}
	};

	return module;
})();

