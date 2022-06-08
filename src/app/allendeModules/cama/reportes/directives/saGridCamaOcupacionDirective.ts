/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para grilla de ocupacion de cama 
 * @type:			Directive
 **/
import * as angular from 'angular';

import grisTemplate = require('../templates/sa-grid-cama-ocupacion.tpl.html');
import subGridTemplate = require('../templates/sa-grid-sub-cama-ocupacion.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saGridCamaOcupacion', saGridCamaOcupacion);

		saGridCamaOcupacion.$inject = ['$log', 'uiGridConstants', '$timeout'];
		function saGridCamaOcupacion ($log, uiGridConstants, $timeout) {
			return {
				restrict : 'E',
				scope : {
					data : '='
				},
				template: grisTemplate,
				link : linkFunction
			};

			function linkFunction (scope, element, attrs) {

				scope.expandAll = expandAll;

				scope.gridOptions = {
					data : scope.data,
					onRegisterApi : function(gridApi){
						scope.gridApi = gridApi;

						gridApi.expandable.on.rowExpandedStateChanged(scope,function(row){
							row.expandedRowHeight = (row.entity.subGridOptions.data.length * 30) + 50;
						});
					},
					enableSorting: true, 				// Orden para todas las columnas(se reconfigura por columna dsp)
					//showGridFooter: true,				// Habilita footer
					showColumnFooter: true,				// Footer por columna
					enableGridMenu: true,
					enableRowSelection: true,
					enableFullRowSelection: true,		// Habilita seleccionar fila completa
					multiSelect: false,					// Habilita multiple selecicón
					enableRowHeaderSelection: false, 	// Habilita columna de seleccion con check
					enableColumnMenus: true,			// Habilita menu por header
					enableFiltering: false,				// Habilita filtros en header
					exporterMenuPdf: false,				// Habilita la opcion de exportar pdf
					expandableRowTemplate: subGridTemplate,
					expandableRowScope: {
						subGridVariable: 'subGridScopeVariable'
					},
					columnDefs: [
						{
							name : 'categoriaHabitacion',
							field: 'NombreCategoriaHabitacion'
						},
						{
							name : 'total',
							field: 'CantidadCamasTotal',
							aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
						},
						{
							name : 'ocupadas',
							field: 'CantidadCamasOcupadas',
							aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
						},
						{
							name : 'disponibles',
							field: 'CantidadCamasDisponibles',
							aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
						},
						{
							name : 'enLimpieza',
							field: 'CantidadCamasEnLimpieza',
							aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
						},
						{
							name : 'enMantenimiento',
							field: 'CantidadCamasEnMantenimiento',
							aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
						}
					]
				};

				function initReporte() {
					var minRow = scope.data.length;
					angular.forEach(scope.data, function(dataItem){

						var minRowChild = dataItem.TiposHabitacion.length;
						// Sumo la cabecera del detalle
						minRow = minRow + minRowChild + 1;

						dataItem.subGridOptions = {
							minRowsToShow: minRowChild,
							columnDefs: [
								{
									name : 'Tipo',
									field: 'NombreTipoHabitacion',
									// pinnedLeft : true 			// Deja un espacio en los subGrid
								},
								{
									name : 'total',
									field: 'CantidadCamasTotal'
								},
								{
									name : 'ocupadas',
									field: 'CantidadCamasOcupadas'
								},
								{
									name : 'disponibles',
									field: 'CantidadCamasDisponibles'
								},
								{
									name : 'enLimpieza',
									field: 'CantidadCamasEnLimpieza'
								},
								{
									name : 'enMantenimiento',
									field: 'CantidadCamasEnMantenimiento'
								}
							],
							data: dataItem.TiposHabitacion
						};
					});

					return minRow;
				}

				function expandAll() {
					scope.gridApi.expandable.expandAllRows();
				}

				activate();

				function activate() {
					scope.gridOptions.minRowsToShow = initReporte();
					scope.gridOptions.data = scope.data;

					$timeout(expandAll,100);
				}

			}
		}
	};

	return module;

})();