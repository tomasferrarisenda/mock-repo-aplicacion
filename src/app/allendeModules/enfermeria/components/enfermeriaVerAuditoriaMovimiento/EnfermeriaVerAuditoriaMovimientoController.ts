/**
* @author: ppautasso
* @description: controller para componente ver auditoria de movimiento
* @type: Controller
**/
import * as angular from 'angular';
import { IMovimientosStockDataService } from '../../services/movimientos';

export class EnfermeriaVerAuditoriaMovimientoController implements angular.IController {

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
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'MovimientosStockDataService'];
	/**
	* @class EnfermeriaVerAuditoriaMovimientoController
	* @constructor
	*/
	constructor(private $log: ILogger, private MovimientosStockDataService: IMovimientosStockDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaVerAuditoriaMovimientoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaVerAuditoriaMovimientoController');
		this.$log.debug('ON');
		this.loading = true;
		
	}
	// #endregion
}