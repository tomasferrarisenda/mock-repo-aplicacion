/**
* @author: ppautasso emansilla
* @description: componente for carousel
* @type: Component
**/
import * as angular from 'angular';
import { CarouselController } from './CarouselController';
const CarouselTemplate = require('./CarouselComponent.html');

const component: angular.IComponentOptions = {
	template: CarouselTemplate,
	controller: CarouselController,
	controllerAs: 'vm',
	transclude: true
}

export class CarouselComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saCarousel', component);
	}
}