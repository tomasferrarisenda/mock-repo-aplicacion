/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de exportacion de table
 * @type:			Module
 **/
import * as angular from 'angular';
import Exportation from "./Exportation";
import ExportationItem from "./ExportationItem";
import fwTableExportDirective from "./fwTableExportDirective";
import fwTableExportCsvDirective from "./fwTableExportCsvDirective";
import fwTableExportCsvExtDirective from "./fwTableExportCsvExtDirective";
// import fwTableExportPdfDirective from "./fwTableExportPdfDirective";
// import fwTableExportPdfExtDirective from "./fwTableExportPdfExtDirective";
import fwTableExportInternalInitializerDirective from "./fwTableExportInternalInitializerDirective";

(function () {
	'use strict';
	/* Core.Component.Table.Exportation Module */
	const ngModule = angular.module('core.component.table.exportation',[]);

	Exportation.init(ngModule);
	ExportationItem.init(ngModule);
	fwTableExportDirective.init(ngModule);
	fwTableExportCsvDirective.init(ngModule);
	fwTableExportCsvExtDirective.init(ngModule);
	// fwTableExportPdfDirective.init(ngModule);
	// fwTableExportPdfExtDirective.init(ngModule);
	fwTableExportInternalInitializerDirective.init(ngModule);
	
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Exportation');
		// $log.debug('ON.-');
	}
})();