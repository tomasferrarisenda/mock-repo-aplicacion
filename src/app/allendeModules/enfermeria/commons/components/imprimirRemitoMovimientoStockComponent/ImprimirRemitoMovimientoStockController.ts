/**
* @author: ppautasso
* @description: controller para el componente e impimir el remito de movimiento stock farmacia/enfermeria
* @type: Controller
**/
import * as angular from 'angular';
import { IMovimientosStockDataService } from '../../../services/movimientos';

export class ImprimirRemitoMovimientoStockController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	data;
	dataSinAltoRiesgo;
	dataAltoRiesgo;
	loading: boolean = false;
	totalCantidadItemsSinAltoRiesgo;
	totalCantidadItemsConAltoRiesgo;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'MovimientosStockDataService'];
	/**
	* @class ImprimirRemitoMovimientoStockController
	* @constructor
	*/
	constructor(private $log: ILogger, private MovimientosStockDataService: IMovimientosStockDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	buscarMovmiento() {

		this.loading = true;
		this.MovimientosStockDataService.verDetalleMovimientoDeDeposito(this.resolve.IdMovimiento, this.resolve.IdDeposito)
			.then((pResultDetalleMovimiento) => {
				this.$log.debug('pResultDetalleMovimiento', pResultDetalleMovimiento);
				this.data = angular.copy(pResultDetalleMovimiento);
				if (pResultDetalleMovimiento.Items && pResultDetalleMovimiento.Items.length) {
					// agrego los medicamentos sin alto riesgo
					this.dataSinAltoRiesgo = angular.copy(pResultDetalleMovimiento.Items.filter(x => !x.EsAltoRiesgo))
					this.dataAltoRiesgo = angular.copy(pResultDetalleMovimiento.Items.filter(x => x.EsAltoRiesgo))
				 }
				
				this.totalCantidadItemsSinAltoRiesgo = 0;
				this.dataSinAltoRiesgo.forEach(item => {
					this.totalCantidadItemsSinAltoRiesgo = this.totalCantidadItemsSinAltoRiesgo + item.Cantidad;
				});

				this.totalCantidadItemsConAltoRiesgo = 0;
				this.dataAltoRiesgo.forEach(item => {
					this.totalCantidadItemsConAltoRiesgo = this.totalCantidadItemsConAltoRiesgo + item.Cantidad;
				});

				this.loading = false;
				setTimeout(() => { 
					window.print(); 
					this.cancel();
				}, 300);
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ImprimirRemitoMovimientoStockController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ImprimirRemitoMovimientoStockController');
		this.$log.debug('ON');

		this.buscarMovmiento();
	}
	// #endregion
}
