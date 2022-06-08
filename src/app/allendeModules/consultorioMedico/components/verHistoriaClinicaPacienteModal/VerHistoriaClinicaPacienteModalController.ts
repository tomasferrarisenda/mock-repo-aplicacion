/**
* @author: ppautasso
* @description: controller para el modal de ver pacienta historia clinica
* @type: Controller
**/
import * as angular from 'angular';

export class VerHistoriaClinicaPacienteModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	loading: boolean = false;
	dismiss;
	close;
	resolve;
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class VerHistoriaClinicaPacienteModalController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class VerHistoriaClinicaPacienteModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('VerHistoriaClinicaPacienteModalController');
		this.$log.debug('ON');
	}
	// #endregion
}