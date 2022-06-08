/**
* @author: ppautasso
* @description: controller para barcode scann de enfermeria
* @type: Controller
**/
import * as angular from 'angular';

export class BarcodeScanModalEnfermeriaController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	titulo: string = "Scan activado";
	typeOfScan: string = "x";
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class BarcodeScanModalEnfermeriaController
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

	scanResult(resultScan){
		this.$log.debug('resultScan',resultScan);
		this.cerrar(resultScan);
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class BarcodeScanModalEnfermeriaController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('BarcodeScanModalEnfermeriaController');
		this.$log.debug('ON');

		this.titulo = this.resolve.Titulo;
		this.typeOfScan = this.resolve.TypeScan;
	}
	// #endregion
}