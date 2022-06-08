/**
* @author: ppautasso
* @description: controller para modal success
* @type: Controller
**/
import * as angular from 'angular';

export class ModalSuccessAnimationController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	titulo;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class ModalSuccessAnimationController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose) {
		this.close({ $value: pClose });
	}


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ModalSuccessAnimationController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ModalSuccessAnimationController');
		this.$log.debug('ON');

		this.titulo = this.resolve.Titulo;

		setTimeout( () => { 
			this.cerrar(true);
		}, 2400);

	}
	// #endregion
}