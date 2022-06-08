/**
 * @author 			emansilla
 * @description 	Modulo con funcionalidad básica
 */
import * as angular from 'angular';
import "./config/app";
import "./exception/app";
import "./component/app";
import "./http/app";
import "./logger/app";
import "./modal/app";
//import "./menu/app";
import "./notification/app";
import "./security/app";
import "./styling/app";
import "./util/app";
import "./validator/app";

export const CoreModule = angular.module('core', [
	'core.config',
	'core.exception',
	'core.component',
	'core.http',
	'core.logger',
	'core.modal',
	// 'core.menu',
	'core.notification',
	'core.security',
	'core.styling',
	'core.util',
	'core.validator',
])
.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod ($log) {
	$log = $log.getInstance('Core');
	$log.info('ON.-');
}