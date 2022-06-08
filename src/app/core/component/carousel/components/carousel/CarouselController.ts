/**
* @author: ppautasso emansilla
* @description: Controller para carousel
* @type: Controller
**/
import * as angular from 'angular';
import { CarouselItem } from '../../models';
import carouselTemplate = require('./CarouselTemplate.html');


export class CarouselController implements angular.IController {

	slides: Array<CarouselItem> = []
	template: any;
	active = 0;
	carouselTemplate = carouselTemplate;
	// ID
	static $inject: Array<string> = ['Logger', '$scope', '$compile'];
	// Constructor
	constructor(private $log: ILogger, private $scope, private $compile) {
	}

	addCarouselItem(carouselItem: CarouselItem){

		this.$log.debug('CarouselParent: agregando item...', carouselItem);
		// carouselItem.component = this.$compile(carouselItem.componentHtml)(this.$scope);
		this.slides.push(carouselItem);
	}

	$onInit() {
		this.$log = this.$log.getInstance('CarouselController');
		this.$log.debug('ON');
		this.template = carouselTemplate;
	}
}