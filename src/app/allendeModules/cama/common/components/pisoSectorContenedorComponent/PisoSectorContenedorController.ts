/**
* @author: ppautasso
* @description: Controller para el componente contenedor de selector piso y selector sector
* @type: Controller
**/
import * as angular from 'angular';

export class PisoSectorContenedorController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	sucursal;
	piso;
	sector;
	deposito;
	mostrarDeposito;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class PisoSectorContenedorController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


	// #endregion

	// #region /* ----------------------------------------- SUPPORT ----------------------------------------- */


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class PisoSectorContenedorController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('PisoSectorContenedorController');
		this.$log.debug('ON');
	}

	$onChanges(change) {
		console.log('change', change);
		if (change.sucursal) {
			if (!change.sucursal.isFirstChange() && change.sucursal.currentValue) {

			}
			if(!change.sucursal.currentValue){
				delete this.deposito;
				delete this.sector;
				delete this.piso;
			}
		}
	}


	// #endregion
}