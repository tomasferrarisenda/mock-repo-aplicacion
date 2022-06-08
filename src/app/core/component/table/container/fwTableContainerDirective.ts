/**
 * @author:			Ezequiel Mansilla
 * @description:	Contenedor de table
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableContainer', fwTableContainer);

		fwTableContainer.$inject = ['$log'];
		function fwTableContainer ($log) {
			return {
				restrict : 'E',
				link: link,
				controller: fwTableContainerController
			};

			function link () {
				// $log.debug('fwTableContainer linked');
			}
		}

		fwTableContainerController.$inject = ['Logger', '$scope', '$rootScope', '$filter', 'Table'];
		function fwTableContainerController($log, $scope, $rootScope, $filter, Table) {

			// #region /* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwTableContainerController');
			// $log.debug('ON.-');

			// #endregion

			// #region /* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			var table : any = {
				cols : Array<any>(),
				rows : [],
				data: [],
				sorting : '',
				config : '',
				pagination : '',
				filtering : ''
			};
			var data;
			var filterData;
			var vm = this;

			vm.setColumns = setColumns;
			vm.setData = setData;
			// vm.setFilterData = setFilterData;
			vm.setConfig = setConfig;
			vm.setButtonset = setButtonset;
			vm.setPagination = setPagination;
			vm.setSorting = setSorting;
			vm.setFiltering = setFiltering;
			vm.setExportation = setExportation;

			vm.getTable = getTable;
			vm.isYourTable = isYourTable;

			// #endregion

			// #region /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			// #region /* CONSTRUCTOR */

			function createTable() {
				table = Table.build(table);
			}

			// #endregion

			// #region /* SETTERS */

			function setColumns(pColumns) {
				table.cols = pColumns;
			}

			function setRows(pRows) {
				// Limpio las filas para tomar el cambio
				table.rows = [];
				// Seteo las nuevas filas 
				table.rows = pRows;
				// Renferizo tabla
				renderTable();
			}

			function setFilterData(pFilterData) {
				// almaceno datos filtrados
				filterData = pFilterData;
				// delego manejo de datos
				delegateData(pFilterData);
			}

			function setData(pData) {
				// almaceno datos originales
				data = pData;
				table.data = pData;
				setFilterData(pData);
			}

			function setConfig(pConfig) {
				table.config = pConfig;
			}

			function setButtonset(pButtonset) {
				table.cols.push(pButtonset);
			}

			// #endregion

			// #region /* DATA */

			function delegateData(pData) {
				// Por defecto se setean todos los datos como row
				setRows(pData);
				// Si hay paginación se volveran a setear los rows
				var totalItems = (pData && pData.length) ? pData.length : 0;
				$rootScope.$broadcast('fw-table-ready-to-pagination-event', {
					idTable: table.id,
					totalItems: totalItems,
					pageSize: table.pagination.pageSize
				});
			}

			// #endregion

			// #region /* SORT */

			function setSorting(pSorting) {
				if (table.isSortable()) {
					table.sorting = pSorting;
					delegateSorting();
				} else {
					$log.warn('La tabla no soporta ordenamiento');
				}
			}

			function delegateSorting() {
				// Solo se trabaja si es interna
				if (table.sorting.isInterna()) {
					if (table.sorting.isValid()) {
						setFilterData(sortData());
					} else {
						setFilterData(data);
					}
					renderTable();
				}
			}

			function sortData() {
				var dataSort = data;
				var filedsOrderby = table.sorting.getFieldsOrderBy();
				if (filedsOrderby && filedsOrderby.length) {
					dataSort = $filter('orderBy')(data, filedsOrderby);
				}
				return dataSort;
			}

			// #endregion

			// #region /* FILTER */
			
			function setFiltering(pFiltering) {
				// // $log.debug('setFiltering',pFiltering);
				if (table.isFiltrable()) {
					table.filtering = pFiltering;
					delegateFiltering();
				} else {
					$log.warn('La tabla no soporta filtrado dinámico');
				}
			}

			function delegateFiltering() {
				if (table.filtering.isValid()) {
					var filterObject = table.filtering.getFilterObject();
					// // $log.debug('filterObject',filterObject);
					var _filterData = $filter('filter')(data, filterObject);
					setFilterData(_filterData);
				} else {
					setFilterData(data);
				}
				renderTable();
			}

			// #endregion

			// #region /* EXPORTATION */

			function setExportation(pExportation) {
				if (table.isExportable()) {
					// $log.debug('setExportation',pExportation);
					table.exportation = pExportation;
				}
			}

			// #endregion

			// #region /* TABLE */

			function isYourTable(pIdTable) {
				return getTable().id === pIdTable;
			}

			function getTable() {
				createTable();

				if (!table.isValid()) return;
				return table;
			}

			function renderTable() {
				$rootScope.$broadcast('fw-table-ready-to-render-event',getTable());
			}

			// #endregion

			// #region /* PAGINATION */

			function setPagination(pPagination) {
				if (table.isPaginable()) {
					table.pagination = pPagination;
					delegatePagination();
				} else {
					$log.warn('La tabla no soporta paginación');
				}
			}

			function delegatePagination() {
				var dataToShow = filterData;

				if (table.pagination && table.pagination.isInterna()) {
					dataToShow = getPage();
				}

				setRows(dataToShow);
			}

			function getPage () {
				var begin = ((table.pagination.currentPage - 1) * table.pagination.pageSize);
				var end = begin + table.pagination.pageSize;
				return filterData.slice(begin, end);
			}

			// #endregion

			// #endregion

			// #region/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate() {
				createTable();
			}

			// #endregion
		}
	};
	return module;
})();