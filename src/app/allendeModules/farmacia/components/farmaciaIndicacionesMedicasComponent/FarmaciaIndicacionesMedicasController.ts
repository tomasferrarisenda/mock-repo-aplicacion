/**
* @author: ppautasso
* @description: controller para componente contenedor de farmacia indicaciones medicas
* @type: Controller
**/
import * as angular from 'angular';

import {FARMACIA_INDICACIONESMEDICAS_TABS} from './../../config'


export class FarmaciaIndicacionesMedicasController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	tabs = FARMACIA_INDICACIONESMEDICAS_TABS;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class FarmaciaIndicacionesMedicasController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaIndicacionesMedicasController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaIndicacionesMedicasController');
		this.$log.debug('ON');
	}
	// #endregion
}