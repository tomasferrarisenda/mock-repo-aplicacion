/**
* @author:         emansilla
* @description:    Config de support
* @type:           Module
**/

import * as angular from 'angular';
import constants from './constants';

export const AllendeSupportConfigModule = angular.module('allende.support.config', []);

constants.init(AllendeSupportConfigModule);

AllendeSupportConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Allende.Support.Config');
	$log.debug('ON.-');
}