/**
* @author: ppautasso
* @description: Success Animation Component
* @type: Module
**/
import * as angular from 'angular';
import { SuccessAnimationComponent} from './components';

const modules: angular.IModule[] = [

];

const config: fw.IConfig[] = [

];

const components: fw.IComponent[] = [
	SuccessAnimationComponent
];

const services: fw.IService[] = [

];

// Se crea y exporta el módulo
export const CoreSuccessAnimationModule = angular.module('core.component.successAnimation', modules.map(module => module.name));

config.forEach(c => c.init(CoreSuccessAnimationModule));
components.forEach(c => c.init(CoreSuccessAnimationModule));
services.forEach(s => s.init(CoreSuccessAnimationModule));

// Run
CoreSuccessAnimationModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Core.Component.SuccessAnimation');
	$log.debug('ON.-');
}

