/**
* @author: ppautasso
* @description: controller para modal info with callback
* @type: Controller
**/
import * as angular from 'angular';

export class ModalInfoWithCallbackController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	titulo;
	mensaje;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class ModalInfoWithCallbackController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose) {
		this.close({ $value: pClose });
	}


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ModalInfoWithCallbackController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ModalInfoWithCallbackController');
		this.$log.debug('ON');

		this.titulo = this.resolve.Titulo;
		this.mensaje = this.resolve.Mensaje;

		this.$log.debug('Titulo+Mensaje', this.titulo + " - " + this.mensaje);

	}
	// #endregion
}