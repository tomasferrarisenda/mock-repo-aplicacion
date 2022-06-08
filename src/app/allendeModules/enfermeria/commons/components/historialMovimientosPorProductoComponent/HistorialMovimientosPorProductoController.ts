/**
* @author: ppautasso
* @description: controller para mostrar historial de movimientos por producto
* @type: Controller
**/
import * as angular from 'angular';
import { IMovimientosStockDataService } from '../../../services/movimientos';

export class HistorialMovimientosPorProductoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
    dismiss;
	close;
	producto;
	idDeposito;
	loading: boolean = false;
	movimientosHistoricos;

	fechaDesde = new Date();
	fechaHasta = new Date();

	columnasTabla = [
		{
			label: "Fecha",
			field: "Fecha",
			order: 1,
			format: 'datetime',
		},
		{
			label: "Usuario",
			field: "Usuario",
			order: 2
		},
		{
			label: "Tipo Movimiento",
			field: "TipoMovimiento",
			order: 3
		},
		{
			label: "Estado Movimiento",
			field: "EstadoMovimiento",
			order: 4
		},
		{
			label: "Cantidad",
			field: "Cantidad",
			order: 6,
			classCell: 'ColorCantidad'
		},
		{
			label: "Stock Anterior",
			field: "StockAnterior",
			order: 5,
			
		},
		{
			label: "Stock",
			field: "Stock",
			order: 7
		},
		{
			label: "Destinatario",
			field: "Destinatario",
			order: 8
		},
		{
			label: "Origen",
			field: "Origen",
			order: 8
		},
		{
			label: "Internacion",
			field: "Internacion",
			order: 10
		},
		{
			label: "Observacion",
			field: "Observacion",
			order: 11
		}];
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'moment','MovimientosStockDataService', 'AlertaService'];
	/**
	* @class HistorialMovimientosPorProductoController
	* @constructor
	*/
	constructor(private $log: ILogger, private moment, private MovimientosStockDataService:IMovimientosStockDataService,
	private AlertaService:IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
    }

	buscar(){

		this.loading = true;
		let _fechaDesde = angular.copy(this.moment(this.fechaDesde).format('MM-DD-YYYY'));
        let _fechaHasta = angular.copy(this.moment(this.fechaHasta).format('MM-DD-YYYY'));

		this.MovimientosStockDataService.verHistorialMovimientos(_fechaDesde, _fechaHasta, this.idDeposito, 
			this.producto.IdTipoStockeable, this.producto.IdStockeable)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.loading = false;
			this.movimientosHistoricos = angular.copy(pResult);
			angular.forEach(this.movimientosHistoricos, (movimiento) => {
				if(movimiento.Cantidad < 0) movimiento.ColorCantidad = 'color-rojo-turno';
				else if(movimiento.Cantidad > 0) movimiento.ColorCantidad = 'color-verde-turno';
			})
			if(this.movimientosHistoricos && this.movimientosHistoricos.length == 0) this.AlertaService.NewWarning("No existen registros para la busqueda");
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
		
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class HistorialMovimientosPorProductoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('HistorialMovimientosPorProductoController');
		this.$log.debug('ON');
		this.producto = angular.copy(this.resolve.Producto);
		this.idDeposito = angular.copy(this.resolve.IdDeposito);
		this.fechaDesde.setDate(this.fechaHasta.getDate() - 4);
		this.buscar();
	}
	// #endregion
}