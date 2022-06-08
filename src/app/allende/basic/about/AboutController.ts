/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export class AboutController implements angular.IController {
	static $inject : Array<string> = ['Logger', 'APP_INFO'];
	private info;
	private nombrePagina : string;

	constructor(private $log: ILogger, APP_INFO){
		this.info = APP_INFO;
		this.nombrePagina = "Acerca de " + APP_INFO.title;
	}

	$onInit() {
		this.$log = this.$log.getInstance('AboutController');
		this.$log.debug('ON');
	}

}