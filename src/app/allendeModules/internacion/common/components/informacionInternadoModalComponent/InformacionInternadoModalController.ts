/**
* @author: ppautasso
* @description: controller para el modal para ver informacion del internado
* @type: Controller
**/
import * as angular from 'angular';

export class InformacionInternadoModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	dismiss;
	close;
	resolve;

	internado;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class InformacionInternadoModalController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel(){
		this.dismiss({ $value: 'cancel' });
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class InformacionInternadoModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('InformacionInternadoModalController');
		this.$log.debug('ON');

		this.internado = angular.copy(this.resolve.Informacion);
		if(this.internado.FechaAltaMedica.includes("0001")) this.internado.FechaAltaMedica = "-";
		this.$log.debug('informacion del internado',this.internado);
	}
	// #endregion
}