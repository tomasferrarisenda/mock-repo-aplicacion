/**
* @author: ppautasso
* @description: controller para el componente de indicaciones medicas de enfermeria
* @type: Controller
**/
import * as angular from 'angular';
import { ENFERMERIA_INDICACIONESMEDICAS_TABS } from '../../config';

export class EnfermeriaIndicacionesMedicasController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	
	tabs = ENFERMERIA_INDICACIONESMEDICAS_TABS;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class EnfermeriaIndicacionesMedicasController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaIndicacionesMedicasController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaIndicacionesMedicasController');
		this.$log.debug('ON');
	}
	// #endregion
}