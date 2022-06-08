/**
 * @author:			Ezequiel Mansilla
 * @description:	Módulo de integracion para ui.bootrstrap
 * @type:			Module
 **/
import * as angular from 'angular';
import DatePickerController from './controller/DatePickerController';
import 'bootstrap';
import 'angular-ui-bootstrap';
import 'angular-bootstrap-datetimepicker';
import './config/app';
import './dateTimePicker/datetimepicker.scss';
// import from "./dateTimePicker/app;
	
/* CIntegration.Bootstrap Modules */
const ngModule = angular.module('integration.bootstrap', [
		'ui.bootstrap',
		'integration.bootstrap.config',
		'ui.bootstrap.datetimepicker'
	]);

DatePickerController.init(ngModule);

ngModule.run(['Logger', function ($log) {
	$log = $log.getInstance('Integration.Bootstrap');
	$log.debug('ON.-');
}]);
