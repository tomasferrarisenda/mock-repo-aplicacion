/**
 * @author:			Ezequiel Mansilla
 * @description:	Módulo para integración de librerias
 * @type:			Module
 **/
import * as angular from 'angular';
import './barcode/app';
import './config/app';
import './common/app';
import './bootstrap/app';
import './calendar/app';
import './chart/app';
import './checkBox/app';
import './contextMenu/app';
import './dashboard/app';
import './export/app';
import './fileUpload/app';
import './grid/app';
import './moment/app';
import './printZebra/app';
import './router/app';
import './storage/app';
// import './signalr/app';
//import './textEditor/app';
import './toaster/app';
import './ngTree/app';

export const IntegrationModule = angular
	.module('integration', [
		'integration.barCode',
		'integration.config',
		'integration.common',
		'integration.bootstrap',
		'integration.calendar',
		'integration.chart',
		'integration.checkBox',
		'integration.contextMenu',
		'integration.dashboard',
		'integration.export',
		'integration.fileUpload',
		'integration.grid',
		'integration.moment',
		'integration.printZebra',
		'integration.router',
		'integration.storage',
		// 'integration.signalr',
		//'integration.textEditor',
		'integration.toaster',
		'integration.ngJsTree'
	])
	.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod ($log) {
	$log = $log.getInstance('Integration');
	$log.debug('ON.-');
}