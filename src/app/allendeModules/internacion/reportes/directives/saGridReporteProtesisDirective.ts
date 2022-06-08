/**
 * @author:			Ezequiel Mansilla
 * @description:	Grilla con reporte de protesis
 * @type:			Directive
 **/
import * as angular from 'angular';
import gridTemplate = require('../templates/sa-grid-reporte-protesis.tpl.html');
import subGridTemplate = require('../templates/sa-grid-sub-reporte-protesis.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saGridReporteProtesis', saGridReporteProtesis);

		saGridReporteProtesis.$inject = ['$log', 'uiGridConstants'];
		function saGridReporteProtesis ($log, uiGridConstants) {
			return {
				restrict : 'E',
				scope : {
					data : '='
				},
				template: gridTemplate,
				link: function (scope) {
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
								name : 'proveedor',
								field: 'NombreProveedor',
								pinnedLeft : true 			// Deja un espacio en los subGrid
							},
							{
								name : 'total',
								field: 'CantidadProtesis',
								enableFiltering : false,
								aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
							},
							{
								name : 'autorizadas',
								field: 'CantidadProtesisAutorizadas',
								enableFiltering : false,
								aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
							},
							{
								name : 'noAutorizadas',
								field: 'CantidadProtesisNoAutorizadas',
								enableFiltering : false,
								aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
							},
							{
								name : 'entregadas',
								field: 'CantidadProtesisEntregadas',
								enableFiltering : false,
								aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
							},
							{
								name : 'noEntregadas',
								field: 'CantidadProtesisNoEntregadas',
								enableFiltering : false,
								aggregationType: uiGridConstants.aggregationTypes.sum, // Footer
							}
						]
					};

					angular.forEach(scope.data, function(value, key){
						value.subGridOptions = {
							minRowsToShow: 2,
							columnDefs: [
								{
									name : 'Tipo',
									field: 'NombreTipo',
									pinnedLeft : true 			// Deja un espacio en los subGrid
								},
								{
									name : 'total',
									field: 'CantidadProtesis'
								},
								{
									name : 'autorizadas',
									field: 'CantidadProtesisAutorizadas'
								},
								{
									name : 'noAutorizadas',
									field: 'CantidadProtesisNoAutorizadas'
								},
								{
									name : 'entregadas',
									field: 'CantidadProtesisEntregadas'
								},
								{
									name : 'noEntregadas',
									field: 'CantidadProtesisNoEntregadas'
								}
							],
							data: [
								{
									NombreTipo : 'Primaria',
									CantidadProtesis : value.CantidadProtesisPrimarias,
									CantidadProtesisAutorizadas : value.CantidadProtesisPrimariasAutorizadas,
									CantidadProtesisNoAutorizadas : value.CantidadProtesisPrimariasNoAutorizadas,
									CantidadProtesisEntregadas : value.CantidadProtesisPrimariasEntregadas,
									CantidadProtesisNoEntregadas : value.CantidadProtesisPrimariasNoEntregadas

								},
								{
									NombreTipo : 'Secundaria',
									CantidadProtesis : value.CantidadProtesisSecundarias,
									CantidadProtesisAutorizadas : value.CantidadProtesisSecundariasAutorizadas,
									CantidadProtesisNoAutorizadas : value.CantidadProtesisSecundariasNoAutorizadas,
									CantidadProtesisEntregadas : value.CantidadProtesisSecundariasEntregadas,
									CantidadProtesisNoEntregadas : value.CantidadProtesisSecundariasNoEntregadas

								}
							]
						};
					});
					scope.gridOptions.data = scope.data;
					scope.gridOptions.minRowsToShow = scope.data.length * 2;
					$log.debug('Data', scope.gridOptions.data);

				}
			};
		}
	};

	return module;

})();