/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de ExportationItem
 * @type:			Service
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('ExportationItem', ExportationItem);

		ExportationItem.$inject = ['Logger'];
		
		function ExportationItem ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('ExportationItem');
			// $log.debug('ON.-');

			class ExportationItem {
				label : string;
				status : boolean;
				type : string;
				format : string;
				action : Function;
				data: string;

				private static possibleTypes = ['interna', 'externa'];
				private static possibleFormats = ['csv', 'pdf'];
				private static possibleData = ['page', 'all'];

				constructor(data) {
					this.label = data.label;				// [String]		a
					this.status = data.status;				// [Boolean]	Estado de exportacion
					this.type = data.type;					// [String]		Tipo de exportacion (interna, externa)
					this.format = data.format;				// [String]		Formatos de exportacion (csv, pdf, --)
					this.action = data.action;				// [Function]	Funcion de cambio
					this.data = data.data;					// [String]		Datos a exportar
				}

				public static build (data) {
					data.label = angular.isUndefined(data.label) ? 'Exportar visible' : data.label;
					data.type = angular.isUndefined(data.type) ? 'interna' : data.type;
					data.data = angular.isUndefined(data.data) ? 'page' : data.data;
					data.status = angular.isUndefined(data.status) ? false : data.status;
	
					return new ExportationItem(data);
				}
	
				public isValid() : boolean {
					
					return true;
				}
	
				public isInterna() : boolean {
					return this.type === 'interna';
				}
	
				public isExterna() : boolean {
					return this.type === 'externa';
				}

				public isExportPage() : boolean {
					return this.data === 'page';
				}

				public isExportAll(): boolean {
					return this.data === 'all';
				}
	
				public isCsv() : boolean {
					return this.format === 'csv';
				}

				private checkTypes(pType) : boolean {
					return ExportationItem.possibleTypes.indexOf(pType) !== -1;
				}
	
				private checkFormats(pFormats) : boolean {
					return ExportationItem.possibleFormats.indexOf(pFormats) !== -1;
				}

				private checkData(pData): boolean {
					return ExportationItem.possibleData.indexOf(pData) !== -1;
				}
				
			}

			return ExportationItem;
		}
	};

	return module;
})();