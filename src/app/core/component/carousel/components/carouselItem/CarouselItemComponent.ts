/**
* @author: pautasso mansilla
* @description: component para caruselitem
* @type: Component
**/
import * as angular from 'angular';
import { CarouselItemController } from './CarouselItemController';

const component: angular.IComponentOptions = {
	// template: CarouselItemTemplate,
	controller: CarouselItemController,
	controllerAs: 'vm',
	require: {
		parent: '?^saCarousel'
	},
	bindings: {
		componentHtml: '<'
	}

}

export class CarouselItemComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saCarouselItem', component);
	}
}