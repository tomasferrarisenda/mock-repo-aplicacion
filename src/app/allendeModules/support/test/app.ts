/**
* @author: emansilla
* @description: Modulo para pruebas
* @type: Module
**/
import * as angular from 'angular';

import states from "./states";
import TestController from "./TestController";
import TestDataService from "./TestDataService";

const modules: angular.IModule[] = [

];

const config: fw.IConfig[] = [
	states
];

const components: fw.IComponent[] = [
	TestController
];

const services: fw.IService[] = [
	TestDataService
];

// Se crea y exporta el módulo
export const TestModule = angular.module('allende.support.test', modules.map(module => module.name));

TestModule.directive('dynamic', function ($compile) {
	return {
		restrict: 'A',
		replace: true,
		scope: { dynamic: '=dynamic' },
		link: function postLink(scope, element, attrs) {
			scope.$watch('dynamic', function (html: any) {
				element.html(html);
				$compile(element.contents())(scope);
			});
		}
	}});
	
config.forEach(c => c.init(TestModule));
components.forEach(c => c.init(TestModule));
services.forEach(s => s.init(TestModule));

// Run
TestModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Allende.Support.Test');
	$log.debug('ON.-');
}