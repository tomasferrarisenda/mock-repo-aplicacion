/**
* @author: ppautasso
* @description: Controller para stock por piso controller
* @type: Controller
**/
import * as angular from 'angular';

export class FarmaciaStockController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class FarmaciaStockController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	public method(param1: string): void { // Desde la vista (HTML) se accede con vm.method(algo)

	}

	private method2(param1: string): void { // No se puede llamar desde la vista (HTML) por que es privada

	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaStockController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaStockController');
		this.$log.debug('ON');
	}
	// #endregion
}