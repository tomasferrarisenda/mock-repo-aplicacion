/**
 * @author:			Ezequiel Mansilla
 * @description:	Módulo de configuración de toda la aplicacion
 * @type:			Module
 **/
import * as angular from 'angular';
import {DebugConfig} from './debugConfig';
import './router/app';

/* Common Module */
export const CommonModule = angular.module('common', [
	'common.router'
])
.run(runMethod)
.config(DebugConfig);

runMethod.$inject = ['Logger'];
function runMethod($log){
	$log = $log.getInstance('Common');
	$log.info('ON.-');
}