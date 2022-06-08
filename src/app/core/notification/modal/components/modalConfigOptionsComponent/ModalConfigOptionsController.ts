/**
* @author: ppautasso
* @description: Controller para el modal de configuracion
* @type: Controller
**/
import * as angular from 'angular';

export class ModalConfigOptionsController implements angular.IController {

	resolve;
	dismiss;
	close;
	loading: boolean = false;
	opcionesConfig: any;
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
	* @class ModalConfigOptionsController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	guardar(){
		this.close({ $value: this.opcionesConfig });
	}
	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ModalConfigOptionsController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ModalConfigOptionsController');
		this.$log.debug('ON');

		this.opcionesConfig = angular.copy(this.resolve.Options);
	}
	// #endregion
}