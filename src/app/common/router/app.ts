/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo para rutas basicas
 * @type:			Module
 **/
import * as angular from 'angular';
import StateHelperService from "./services/StateHelperService";
import "./config/app";

export const CommonRouterModule = angular.module('common.router',[
			'common.router.config'
		])
		.run(runMethod);

		StateHelperService.init(CommonRouterModule);

runMethod.$inject = ['Logger'];
function runMethod ($log) {
	$log = $log.getInstance('Common.Router');
	$log.debug('ON.-');
}