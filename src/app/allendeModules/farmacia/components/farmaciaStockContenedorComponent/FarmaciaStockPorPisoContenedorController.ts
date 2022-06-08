/**
* @author: ppautasso
* @description: controller para componente de stock por piso de farmacia component
* @type: Controller
**/
import * as angular from 'angular';

import {FARMACIA_HOME_TABS} from './../../config'

export class FarmaciaStockPorPisoContenedorController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	tabs = FARMACIA_HOME_TABS;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class FarmaciaStockPorPisoContenedorController
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
	* @class FarmaciaStockPorPisoContenedorController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaStockPorPisoContenedorController');
		this.$log.debug('ON');
	}
	// #endregion
}