/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva de grilla para flujo de camas
 * @type:			Directive
 **/
import * as angular from 'angular';

import gridTemplate = require('../templates/sa-grid-reporte-flujo-camas.tpl.html');
import subGridTemplate = require('../templates/sa-grid-sub-reporte-protesis.tpl.html');

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saGridReporteFlujoCamas', saGridReporteFlujoCamas);

		saGridReporteFlujoCamas.$inject = ['$log', 'uiGridConstants', '$filter'];
		function saGridReporteFlujoCamas ($log, uiGridConstants, $filter) {
			return {
				restrict : 'E',
				scope : {
					data : '='
				},
				template: gridTemplate,
				link: function (scope, element) {

					scope.reporte = [];

					scope.nombresTiposInternacion = [];

					scope.gridOptions = {
						data : scope.data,
						enableSorting: true, 				// Orden para todas las columnas(se reconfigura por columna dsp)
						//showGridFooter: true,				// Habilita footer
						showColumnFooter: true,				// Footer por columna
						enableGridMenu: true,
						enableRowSelection: true,
						enableFullRowSelection: true,		// Habilita seleccionar fila completa
						multiSelect: false,					// Habilita multiple selecicón
						enableRowHeaderSelection: false, 	// Habilita columna de seleccion con check
						enableColumnMenus: true,			// Habilita menu por header
						enableFiltering: true,				// Habilita filtros en header
						exporterMenuPdf: false,				// Habilita la opcion de exportar pdf
						minRowsToShow: 10,
						expandableRowTemplate: subGridTemplate,
						expandableRowScope: {
							subGridVariable: 'subGridScopeVariable'
						},
						columnDefs: [
							{
								name : 'categoriaHabitacion',
								field: 'nombreCategoriaHabitacion'
							},
							{
								name : 'ingresosReales',
								field: 'cantidadTotal',
								enableFiltering : false,
								aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
							}
						]
					};

					function initGrid() {

						for (var i = scope.data.length - 1; i >= 0; i--) {
							
							for (var j = scope.data[i].Cantidades.length - 1; j >= 0; j--) {
								var cantidadItem = scope.data[i].Cantidades[j];

								var nombreTipoInternacion = getNombreTipoInternacion(cantidadItem.NombreTipoInternacion);
								scope.nombresTiposInternacion.push(nombreTipoInternacion);

								var col = {
									name : nombreTipoInternacion,
									field: getNombreCantidadTipoInternacion(nombreTipoInternacion),
									enableFiltering : false,
									aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
								};
								scope.gridOptions.columnDefs.push(col);
							}

							break;
						}
					}

					function getItemReporte (dataItem) {
						var reporteItem = {
							nombreCategoriaHabitacion: dataItem.NombreCategoriaHabitacion,
							cantidadTotal : 0
						};

						angular.forEach(dataItem.Cantidades, function (cantidadItem) {
							// Relleno los tipo de internacion por categoria
							reporteItem[getNombreCantidadTipoInternacion(cantidadItem.NombreTipoInternacion)] = cantidadItem.Cantidad;
							// Calculo el total por categoria
							reporteItem.cantidadTotal += cantidadItem.Cantidad;
						});

						return reporteItem;
					}

					function getNombreTipoInternacion (pNombreTipoInternacion) {
						return $filter('saCapitalize')(pNombreTipoInternacion, true);
					}

					function getNombreCantidadTipoInternacion (pNombreTipoInternacion) {
						return 'cantidad' + getNombreTipoInternacion(pNombreTipoInternacion);
					}

					function getSubitemReporte (tipoHabitacion) {
						var reporteSubitem = {
							nombreTipoHabitacion : tipoHabitacion.NombreTipoHabitacion,
							cantidadTotal : 0
						};

						angular.forEach(tipoHabitacion.Cantidades, function (cantidadItem) {
							// Relleno los tipo de internacion por categoria
							reporteSubitem[getNombreCantidadTipoInternacion(cantidadItem.NombreTipoInternacion)] = cantidadItem.Cantidad;
							// Calculo el total por categoria
							reporteSubitem.cantidadTotal += cantidadItem.Cantidad;
						});

						return reporteSubitem;
					}

					function initSubGrid() {
						var subGridOptions = {
							minRowsToShow: 2,
							columnDefs: [
							{
								name : 'tipoHabitacion',
								field: 'nombreTipoHabitacion'
							},
							{
								name : 'ingresosReales',
								field: 'cantidadTotal',
								enableFiltering : false
							}
							],
							data: []
						};

						angular.forEach(scope.nombresTiposInternacion, function(nombreTipoInternacion){
							var col = {
								name : getNombreTipoInternacion(nombreTipoInternacion),
								field: getNombreCantidadTipoInternacion(nombreTipoInternacion)
							};
							subGridOptions.columnDefs.push(col);
						});

						return subGridOptions;
					}

					function initReporte() {
						angular.forEach(scope.data, function(dataItem){

							var reporteItem : any = getItemReporte(dataItem);

							reporteItem.subGridOptions = initSubGrid();
							reporteItem.subGridOptions.minRowsToShow = dataItem.TiposHabitacion.length;

							angular.forEach(dataItem.TiposHabitacion, function(tipoHabitacion){

								// Armo la data del subgrid
								var reporteSubitem = getSubitemReporte(tipoHabitacion);

								reporteItem.subGridOptions.data.push(reporteSubitem);
							});

							scope.reporte.push(reporteItem);
						});
					}

					activate();
					function activate() {
						initGrid();
						initReporte();
						scope.gridOptions.data = scope.reporte;
						scope.gridOptions.minRowsToShow = scope.data.length + 1;
						$log.debug('Reporte', scope.reporte);
					}


				}
			};
		}
	};

	return module;

})();