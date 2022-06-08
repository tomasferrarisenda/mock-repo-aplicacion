/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Service
 **/
import * as angular from 'angular';
export class Column {
	label : string;
	field : string;
	classCol : string;
	classCell : string;
	tooltip : string;
	type : string;
	format : string;
	precision : string;
	order : number;
	visible : boolean;
	hide : boolean;
	sortable : boolean;
	sortType : string;

	// var possibleTypes = ['data', 'buttons'];
	private possibleDataTypes : Array<string> = ['number', 'text', 'date', 'buttons', 'boolean'];
	private possibleDataFormats : Array<string> = ['integer', 'decimal', 'currency', 'date', 'datetime', 'time', 'capitalize', 'uppercase', 'boolean','html', 'longtext'];
	// var possibleSortType = ['SIN', 'ASC', 'DESC'];

	constructor(data) {
		this.label = data.label;			// [String value]	Nombre que figura en la cabecera de la columna
		this.field = data.field;			// [String value]	Campo al que corresponde del objeto
		this.classCol = data.classCol;	// [String value]	Texto que corresponde a una clase ("text-center", ..)
		this.classCell = data.classCell;	// [String value]	Nombre del campo que contiene la clase de la celda
		this.tooltip = data.tooltip;		// [String value]	Nombre del campo que contiene el tooltip de la celda
		
		this.type = data.type;			// [String value]	Tipo de campo ("number", "text", "date")
		this.format = data.format;		// [String value]	Formato para aplicar un filtro en la vista
		this.precision = data.precision;	// [String value]	Detalle del formato a aplicar (Ej. cant. decimales)
		this.order = data.order;			// [Bool]			Número de orden en que aparecen las columnas
		this.visible = data.visible;		// [Bool]			Si la columna es visible o no
		this.hide = data.hide;			// [Bool]			Si la columna es oculto para configurar o no

		this.sortable = data.sortable; 	// [Bool]			Si la columna es ordenable o  no
		this.sortType = data.sortType; 	// [String value]	Tipo de ordenamiento que tiene.
		// col.sortClass = data.sortClass 	// [String value]	Clase para icono
	}

	public static mapFromBe(pData) : any {
		var data :any = {};
		data.label = pData.label || pData.Label;
		data.tooltip = pData.tooltip || pData.ToolTip;
		data.field = pData.field || pData.Field;
		data.classCol = pData.classCol || pData.ClassCol;
		data.classCell = pData.classCell || pData.ClassCell;
		data.type = pData.type || pData.Type;
		data.format = pData.format || pData.Format;
		data.order = pData.order || pData.Order;
		data.visible = angular.isUndefined(pData.visible) ? pData.Visible : pData.visible;
		data.hide = angular.isUndefined(pData.hide) ? pData.Hide : pData.hide;
		data.precision = pData.precision || pData.Precision;
		data.sortable = pData.sortable || pData.Sorteable;
		return data;
	}

	public static build (pData, order) {
		var data = Column.mapFromBe(pData);

		// Si no viene definido label, le seteo el valor del field (campo)
		data.label = (angular.isUndefined(data.label)) ? data.field : data.label;
		// Si no viene definido la visibilidad se setea en true
		data.visible = (angular.isUndefined(data.visible)) ? true : data.visible;
		// Si no viene definido la  configurabilidad se setea en false
		data.hide = (angular.isUndefined(data.hide)) ? false : data.hide;
		// Si no viene definido el tipo se setea en text
		data.type = (angular.isUndefined(data.type)) ? "text" : data.type;

		data.order = (angular.isUndefined(data.order)) ? order : data.order;

		data.sortable = (angular.isUndefined(data.sortable)) ? true : data.sortable;

		return new Column(data);
	}
	
	/**
	* Private function
	*/
	private checkDataType(pType) {
		return this.possibleDataTypes.indexOf(pType) !== -1;
	}

	/**
	* Private function
	*/
	private checkDataFormats(pFormat) {
		return this.possibleDataFormats.indexOf(pFormat) !== -1;
	}

	/**
	* Private function
	*/
	// function checkSortType(pType) {
	// 	return possibleSortType.indexOf(pType) !== -1;
	// }

	public getSortClass() : string {
		var bool = this.isSortable();
		return this.getSortClassBySortType(this.sortType, bool);
	}

	public getSortClassBySortType(pSortType, pSortable) : string {
		if (!pSortable) return '';

		if (!pSortType) return 'SORT';

		if (pSortType === 'ASC') return 'TRIANGLE';

		if (pSortType === 'DESC') return 'TRIANGLE_DOWN';

		return '';
	}

	public isReverse() : boolean {
		return (this.sortType === 'DESC') ? true : false;
	}

	public getOrderFieldName() {
		var sign = (this.sortType === 'DESC') ? '-' : '';
		var orderFieldName = 'data.' + this.field;
		return sign + orderFieldName;
	}

	public getFieldName() : string {
		return 'data.' + this.field;
	}

	public isSorted() : boolean {
		return (this.sortType) ? true : false;
	}

	public isLongText(): boolean {
		return (this.format === 'longtext' || this.format ==='html');
	}

	public nextSortType() {
		// Si no tiene orden, le seteo ascendente
		if (!this.sortType) {
			this.sortType = 'ASC';
			return;
		}
		// Si el orden es ascendente le seteo descendente
		if (this.sortType === 'ASC') {
			this.sortType = 'DESC';
			return;
		}
		// si es descendente u otra cosa, le saco el ordenamiento
		this.sortType = '';
		// y si es ordenable le seteo el icono de ordenable
	}

	

	/**
	 * Dice si la columna es visible o no
	 * @return {Boolean}
	 */
	public isVisible() : boolean {
		var col = this;
		return col.visible;
	}

	/**
	 * Dice si la columna se puede ordenar o no
	 * @return {Boolean}
	 */
	public isSortable(): boolean  {
		return this.sortable;
	}

	public isData() : boolean {
		if (this.isHtml()) return false;
		return true;
	}

	public isButtonset() : boolean {
		return false;
	}

	public isHtml() : boolean {
		return this.format ==='html';
	}

	public equals(pCol) : boolean {
		if (pCol) {
			return (this.field === pCol.field);
		}
		return false;
	}

	/**
	 * Valida una columna
	 * @param  {Column}  pCol
	 * @return {Boolean}      True si es valido
	 */
	public isValid() : boolean {
		var col = this;

		// Valido field
		if (angular.isUndefined(col.field)) {
			console.error('El atributo "field" es requerido.',col);
			return false;
		}

		// Valido type
		if (angular.isUndefined(col.type)) {
			console.error('El atributo "type" es requerido.',col);
			return false;
		}

		if (!this.checkDataType(col.type)) {
			console.warn('El atributo tipo (type) no corresponde a ninguno elegible', col, this.possibleDataTypes);
			return false;
		}

		// Valido format
		if (col.format) {
			if (!this.checkDataFormats(col.format)) {
				console.warn('El atributo formato (format) no corresponde a a ninguno elegible', col, this.possibleDataFormats);
				return false;
			}
		}

		return true;
	}
}
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Column', ColumnService);

		ColumnService.$inject = ['Logger'];
		function ColumnService($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('Column');
			// $log.debug('ON.-');

			

			return Column;
		}
	};

	return module;
})();