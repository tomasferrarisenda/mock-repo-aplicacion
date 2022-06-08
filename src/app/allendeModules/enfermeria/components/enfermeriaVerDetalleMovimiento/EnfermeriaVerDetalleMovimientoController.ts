/**
* @author: ppautasso
* @description: controller para ver detalle d emovimiento
* @type: Controller
**/
import * as angular from 'angular';
import { IMovimientosStockDataService } from '../../services/movimientos';

export class EnfermeriaVerDetalleMovimientoController implements angular.IController {

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
	detalleMovimiento;

	verAuditoria: boolean = false;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'MovimientosStockDataService', 'moment'];
	/**
	* @class EnfermeriaVerDetalleMovimientoController
	* @constructor
	*/
	constructor(private $log: ILogger, private MovimientosStockDataService:IMovimientosStockDataService,
	private moment) {

	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	esAsignacion(){
		let ret = false;
		if (this.detalleMovimiento.IdTipoMovimientoStock === 3){
			ret = true;
		}
		return ret;
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaVerDetalleMovimientoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaVerDetalleMovimientoController');
		this.$log.debug('ON');
		this.loading = true;
		this.MovimientosStockDataService.verDetalleMovimientoDeDeposito(this.resolve.IdMovimiento, this.resolve.IdDeposito)
		.then((pDetalleMovimiento) => {

			this.$log.debug('verDetalleMovimientoOk', pDetalleMovimiento);
			pDetalleMovimiento.FechaParseada = angular.copy(this.moment(pDetalleMovimiento.Fecha).format('dddd DD [de] MMMM [de] YYYY'));
			pDetalleMovimiento.Hora = angular.copy(this.moment(pDetalleMovimiento.Fecha).format('HH:mm') + ' hs.');
			this.detalleMovimiento = angular.copy(pDetalleMovimiento);
			this.loading = false;
		}, (pError) =>{
			this.$log.error('verDetalleMovimientoError',pError);
			this.loading = false;
		});
	}
	// #endregion
}