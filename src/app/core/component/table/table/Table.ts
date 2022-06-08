/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de Table
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Table', Table);

		Table.$inject = ['Logger', '$filter'];
		
		function Table ($log, $filter) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('Table');
			// $log.debug('ON.-');

			class Table {
				id: any;
				data: any;
				rows: any;
				cols: any;
				config: any;
				pagination: any;
				sorting: any;
				filtering: any;
				exportation : any;

				constructor(data) {
					this.id = Table.makeid(data.id);			// Identificador para mas de una tabla por pagina
					this.rows = data.rows;				// Lista de rows (datos)
					this.cols = data.cols;				// Lista de Column (object)
					this.data = data.data;				// Todos los datos
					this.config = data.config;			// Config bool, si muestra o no la configuracion
					this.pagination = data.pagination;	// Pagination object
					this.sorting = data.sorting;		// Lista de columnas a ordenar
					this.filtering = data.filtering;	// Lista de filtros a aplicar
					this.exportation = data.exportation;// Exportador de lista
				}

				public static build (data) : Table {
					// agregar alguna validacion de creación
					return new Table(data);
				}
	
				public static makeid(id) : any {
					if (id) return id;
					
					let text = "";
					let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
					for (let i = 0; i < 5; i++)
						text += possible.charAt(Math.floor(Math.random() * possible.length));
	
					return text;
				}
	
				public isConfigurable() : boolean {
					return this.config;
				}
	
				public isExportableInternal(): boolean {
					if (!this.isExportable()) return false;
					if (this.pagination && !this.pagination.isInterna()) return false;
					return true;
				}
	
				public isExportable(): boolean {
					return this.config.exportable;
				}
	
				public haveExportation(): boolean {
					if (!this.isExportable()) return false;
					if (!this.exportation) return false;
					return true;
				}
	
				public haveFiltering(): boolean {
					if (!this.isFiltrable()) return false;
					if (!this.filtering) {
							$log.warn('Está habilitado el filtrado, pero no existe uno seteado');
						return false;
					}
	
					return true;
				}
	
				public isFiltrable(): boolean {
					// Es filtrable si esta habilitado en la configuración
					if (!this.config.filtrable) return false;
					
					// Y (solo) si la paginación es interna
					if (this.pagination && !this.pagination.isInterna()) {
						$log.warn('Esta habilitado el filtrado y esta seteado, pero la paginación es externa');
						return false;
					}
					return true;
				}
	
				public isSortable(): boolean {
					return this.config.sortable;
				}
	
				public isPaginable() : boolean{
					return this.config.paginable;
				}
	
				public isColumnConfig(): boolean {
					return this.config.columnConfig;
				}
	
				public getColsLabel(onlyVisible): any {
					return this.getColsAttribute('label', onlyVisible);
				}

				public getColsAttribute(attributeName, onlyVisible) {
					if (!attributeName) return [];
					let colsAttributes: Array<any> = [];

					let orderCors = this.getColsSortByOrder(onlyVisible);

					colsAttributes = orderCors.map(col => col[attributeName]);

					return colsAttributes;
				}

				public getColsSortByOrder(onlyVisible?) {
					let orderCors = $filter('orderBy')(this.cols, ['order']);
					let colsVisible: any[] = [];
					if (onlyVisible) {
						for (let i = 0; i < orderCors.length; i++) {
							let col: any = orderCors[i];
							if (col.isData()) {
								if (!onlyVisible) {
									colsVisible.push(col);
								} else {
									if (col.isVisible()) colsVisible.push(col);
								}
							}
						}
						return colsVisible;
					}
					return orderCors;
				}

				// public getColsField(onlyVisible): any {
				// 	return this.getColsAttribute('field', onlyVisible);
				// }

				// public getColsFormat(onlyVisible): any {
				// 	return this.getColsAttribute('format', onlyVisible);
				// }
	
				/**
				 * Retorna los datos visibles de la página
				 * @param onlyVisibleColumns 
				 */
				public getRows(onlyVisibleColumns): any {
					let _rows = [];

					_rows = this.rows.map((pRow) => {
						return this.mapRowToDataFn(pRow, onlyVisibleColumns)
					});
	
					return _rows;
				}

				// public getCellValue(row, col) {
				// 	return $filter('fwPicker')(row.data[col.field], col.format);
				// }

				/**
				 * @description Retorna el valor de una celda, por fila y columna
				 * @param row Fila
				 * @param column Columna
				 */
				public getCellValue(row, column) {
					let value = "";
					let arrayText = column.field.split('.');

					if (arrayText.length) {
						let parcialValue = row.data;

						arrayText.forEach(t => {
							parcialValue = parcialValue[t];
						});
						value = parcialValue;
					} else {
						value = row.data[column.field];
					}
					return $filter('fwPicker')(value, column.format);;
				}

				private mapRowToDataFn(row, onlyVisibleColumns) {
					let _row = {};
					let _colsVisible:any[] = [];

					_colsVisible = this.getColsSortByOrder(onlyVisibleColumns);

					for (let i = 0; i < _colsVisible.length; i++) {
						_row[_colsVisible[i].field] = this.getCellValue(row, _colsVisible[i]);
					}
					return _row;
				}

				/**
				 * Retorna todos los datos de la tabla
				 * @param onlyVisibleColumns 
				 */
				public getData(onlyVisibleColumns): any {
					let _data = [];

					_data = this.data.map((pRow) => {
						return this.mapRowToDataFn(pRow, onlyVisibleColumns)
					});
					
					return _data;
				}

				public getButtonsCol() {
					let buttonCol;

					for (let index = 0; index < this.cols.length; index++) {
						const element = this.cols[index];
						if (element.isButtonset()) {
							buttonCol = element;
							break;
						}
					}
					return buttonCol;
				}

				public getMenuOptions() {
					let buttonCol = this.getButtonsCol();
					
					let menuOptions: any[] = [];

					if (buttonCol && buttonCol.buttons) {

						buttonCol.buttons.forEach(b => {
							let option = {
								text: b.label,
								displayed: function ($itemScope, $event) {
									// console.log(`Table: displayed ${b.label} $itemScope`, $itemScope);
									// console.log(`Table: displayed ${b.label} $event`, $event);
									return b.isVisible($itemScope.row.data, 'context');
								},
								click: ($itemScope, $event, modelValue, text, $li) => {
									// console.log(`Table: click ${b.label} $itemScope`, $itemScope);
									// console.log(`Table: click ${b.label} $event`, $event);
									// console.log(`Table: click ${b.label} modelValue`, modelValue);
									// console.log(`Table: click ${b.label} text`, text);
									// console.log(`Table: click ${b.label} $li`, $li);
									b.action({ row: $itemScope.row.data });
								},
								// enabled: false
							}
							menuOptions.push(option);
						});
					} else {
						menuOptions.push({
							text: 'Sin acciones disponibles',
							click: ($itemScope, $event, modelValue, text, $li) => {
							},
							enabled: false
						});
					}

					return menuOptions;
				}
	
				public equals(data): boolean {
					// // $log.debug('Table (fw) equals',data.id, this.id);
					let flag = this.id === data.id;
					// // $log.debug('Table (fw) equals result',flag);
					return flag;
				}
	
				public isValid() : boolean {
					// if (!this.rows || !this.rows.length) {
					// 	$log.error('Las filas o datos (rows) son requeridas.', this);
					// 	return false;
					// }
	
					if (!this.cols || !this.cols.length) {
						$log.error('Las columnas (cols) son requeridas.', this);
						return false;
					}
	
					return true;
				}
			}
			return Table;
		}
	};

	return module;
})();