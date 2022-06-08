/**
* @author: ppautasso
* @description: controller para modulo de success animation
* @type: Controller
**/
import * as angular from 'angular';

export class SuccessAnimationController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	mensaje: string = "";
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class SuccessAnimationController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class SuccessAnimationController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('SuccessAnimationController');
		this.$log.debug('ON');

		var animation: any = document.getElementById('successAnimation');

		// setTimeout(() => {
		// 	if(animation){
		// 		animation.classList.remove('animated');
		// 		if(animation && animation.parentNode && animation.parentNode.offsetWidth){
		// 			void animation.parentNode.offsetWidth;
		// 		}
		// 		  animation.classList.add('animated');
		// 	}
			
		// }, 5000);

		this.$log.debug('mensaje',this.mensaje);

	}
	// #endregion
}