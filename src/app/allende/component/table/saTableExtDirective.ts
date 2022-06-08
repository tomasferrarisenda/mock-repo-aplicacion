/**
 * @author:			Ezequiel Mansilla
 * @description:	Tabla de allende
 * @type:			Directive
 **/
import * as angular from 'angular';
import tableTemplate = require("./saTableExtTemplate.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [Directive] Tabla genérica adaptada al back-end.
		ngModule.directive('saTableExt', saTableExt);

		saTableExt.$inject = ['$log', 'ButtonService'];
		function saTableExt ($log, ButtonService) {
			return {
				restrict : 'E',
				scope : {
					data : '<',					// Datos traidos desde el back-end
					config : '<?',				// Configuracion
					pageChange: '&?',			// Método de cambio de página. Recibe pagina a buscar
					sortChange: '&?',			// Método de cambio de ordenamiento. Recibe columnas a buscar
					export: '&?',			// Método de exportacion. Recibe tipo

					btnNewClick : '&?',			// Accion de boton new.
					btnNewIf : '=?',			// Condicion de boton new.

					btnEditClick : '&?',		// Accion de boton edit.
					btnEditIf : '=?',			// Condicion de boton edit.

					btnPrintClick : '&?',		// Accion de boton print.
					btnPrintIf : '=?',			// Condicion de boton print.

					btnDeleteClick : '&?',		// Accion de boton delete.
					btnDeleteIf : '=?',			// Condicion de boton delete.

					btnViewClick : '&?',		// Accion de boton view.
					btnViewIf : '=?',			// Condicion de boton view.

					btnIdElement: '@?',			//id de los botones

					btnPersonalizadoClick: '&?',		// Accion de boton generico.
					btnPersonalizadoIf: '=?',			// Condicion de boton generico.
					btnPersonalizadoIcon: '=?',		// Icono de boton generico.
					btnPersonalizadoLabel: '=?',		// Nombre de boton generico.

					clickAction : '&?'
				},
				template : tableTemplate,
				link: link
			};

			function link (scope, element, attrs) {
				if (!scope.data) return;

				scope.pagination = !angular.isUndefined(attrs.pageChange);
				scope.sorting = !angular.isUndefined(attrs.sortChange);
				scope.exportation = !angular.isUndefined(attrs.export);

				if (!angular.isUndefined(attrs.config)) {
					scope.pagination = (angular.isUndefined(scope.config.paginable)) ? true : scope.config.paginable;
					scope.sorting = (angular.isUndefined(scope.config.sortable)) ? true : scope.config.sortable;
					scope.columnConfig = (angular.isUndefined(scope.config.columnConfig)) ? true : scope.config.columnConfig;
					scope.exportation = (angular.isUndefined(scope.config.exportable)) ? true : scope.config.exportable;
				}

				ButtonService.validarButtons(scope);

				// scope.colButtonsIf = (scope.btnNewIf || scope.btnEditIf || scope.btnPrintIf || scope.btnDeleteIf);

				// scope.btnNewIf = angular.isUndefined(attrs.btnNewIf) ? true : scope.btnNewIf;
				// scope.btnEditIf = angular.isUndefined(attrs.btnEditIf) ? true : scope.btnEditIf;
				// scope.btnPrintIf = angular.isUndefined(attrs.btnPrintIf) ? true : scope.btnPrintIf;
				// scope.btnDeleteIf = angular.isUndefined(attrs.btnDeleteIf) ? true : scope.btnDeleteIf;

				scope.pageChangeInternal = pageChangeInternal;
				scope.sortChangeInternal = sortChangeInternal;
				scope.exportEventInternal = exportEventInternal;

				function pageChangeInternal(pPagination) {
					if (scope.pagination) {
						return scope.pageChange({pagination:pPagination});
					}
				}

				function getSortColumnsToBe(pCols) {
					var colsReturn : Array<any> = [];
					if (pCols && pCols.length) {
						for (var i = 0; i < pCols.length; i++) {
							colsReturn.push({
								Name : pCols[i].field,
								Descending : pCols[i].isReverse()
							});
						}
					}

					return colsReturn;
				}

				function sortChangeInternal(pSorting) {
					if (scope.sorting) {
						var sort = {
							SortedColumns : getSortColumnsToBe(pSorting.cols)
						};
						return scope.sortChange({sorting : sort});
					}
				}

				function exportEventInternal(pExportation) {
					if (scope.exportation) {
						return scope.export({exportation:pExportation});
					}
				}

				function updateData(pData: GridViewDto<any>) {
					if (pData) {
						scope.rows = pData.Rows;
						scope.cols = pData.Columns;
						scope.pageSize = pData.PageSize;
						scope.totalItems = pData.RowCount;
						scope.currentPage = pData.CurrentPage;
						// scope.sortColums = pData.SortColumns;
						scope.columnConfig = angular.isUndefined(pData.ShowColumnsFilter) ? true : pData.ShowColumnsFilter;
					} else {
						scope.rows = [];
						// scope.cols = [];
						scope.pageSize = 0;
						scope.totalItems = 0;
						scope.currentPage = 0;
						// scope.sortColums = [];
					}
				}

				scope.$watch(function () {
					return scope.data;
				}, updateData, true);
			}
		}

		/**
		 * Ejemplo:
		 * <sa-table-ext
		 * 		data="vm.data"
		 * 		page-change="vm.buscarPagina(pagination)" 
		 * 		btn-new-click="vm.crear(row)"
		 * 		btn-edit-click="vm.editar(row)"
		 * 		btn-edit-if="vm.puedeEditar"
		 * 		btn-print-click="vm.imprimir(row)"
		 * 		btn-delete-click="vm.borrar(row)">
		 * </sa-table-ext>
		 * 
		 *
		 * En el controller debe existir el metodo buscarPagina
		 *
		 * vm.buscarPagina = function(pCurrentPage) {
		 * 	// llamada al dataService.
		 * }
		 */
	};

	return module;
})();