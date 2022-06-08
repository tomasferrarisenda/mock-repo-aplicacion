/**
* @author: 
* @description: controller para el item del carousel
* @type: Controller
**/
import * as angular from 'angular';
import { CarouselItem } from '../../models';

export class CarouselItemController implements angular.IController {

	parent;
	componentNombre;
	componentHtml;
	// ID
	static $inject: Array<string> = ['Logger'];
	// Constructor
	constructor(private $log: ILogger) {

	}


	$onInit() {
		this.$log = this.$log.getInstance('CarouselItemController');
		this.$log.debug('ON');
		if (this.parent) {
			//agrego un item

			this.parent.addCarouselItem(this.crearItem());

		} else {
			this.$log.debug('No se encuentra el parent');
		}
	}

	crearItem(): CarouselItem {
		let _item: CarouselItem = {};
		//_item.component = this.componentNombre;
		_item.componentHtml = this.componentHtml;
		return _item;
	}
}