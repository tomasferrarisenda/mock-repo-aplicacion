/**
* @author: emansilla / ppautasso
* @description: Carousel
* @type: Module
**/
import * as angular from 'angular';
import { CarouselComponent, CarouselItemComponent} from './components';

const modules: angular.IModule[] = [

];

const config: fw.IConfig[] = [

];

const components: fw.IComponent[] = [
	CarouselComponent,
	CarouselItemComponent
];

const services: fw.IService[] = [

];

// Se crea y exporta el módulo
export const CoreCarouselModule = angular.module('core.component.carousel', modules.map(module => module.name));

config.forEach(c => c.init(CoreCarouselModule));
components.forEach(c => c.init(CoreCarouselModule));
services.forEach(s => s.init(CoreCarouselModule));

// Run
CoreCarouselModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Core.Component.Carousel');
	$log.debug('ON.-');
}

