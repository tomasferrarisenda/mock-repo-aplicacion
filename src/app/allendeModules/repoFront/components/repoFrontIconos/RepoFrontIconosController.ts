/**
* @author: ppautasso
* @description: controller para mostrar iconos en front tipo modal
* @type: Controller
**/
import * as angular from 'angular';

export class RepoFrontIconosController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	iconos;
	// #endregion
	resolve: any;
    dismiss: any; // lo usamos para Cancelar el Plugin
    close: any;
	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'ICON_LIST'];
	/**
	* @class RepoFrontIconosController
	* @constructor
	*/
	constructor(private $log: ILogger, private ICON_LIST) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
        this.dismiss({ $value: 'cancel' });
    }

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RepoFrontIconosController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RepoFrontIconosController');
		this.$log.debug('ON');

		this.$log.debug('listIConos',this.ICON_LIST);
		this.iconos = this.ICON_LIST;
	}
	// #endregion
}