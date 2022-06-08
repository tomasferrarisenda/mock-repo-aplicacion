/**
* @author: ppautasso
* @description: controller para modal de edicion tipo input generico
* @type: Controller
**/
import * as angular from 'angular';

export class ModalEditInputGenericoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	nuevoInput: any;
	optionConfig: any;
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class ModalEditInputGenericoController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	guardar(){
		this.close({ $value: this.nuevoInput });
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ModalEditInputGenericoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ModalEditInputGenericoController');
		this.$log.debug('ON');
		this.optionConfig = angular.copy(this.resolve.Options);
	}
	// #endregion
}