/**
* @author: ppautasso
* @description: controller para mostrar el detalle de un movimiento de farmacia
* @type: Controller
**/
import * as angular from 'angular';
import { IMovimientoStockIndicacionMedicaDataService } from '../../services';

export class FarmaciaVerDetalleMovimientoModalController implements angular.IController {

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
	idMovimiento;
	dataMovimiento;

	columnasList = [
		{
			label: "Producto",
			field: "Producto",
			order: 1
		},
		{
			label: "Internacion",
			field: "Internacion",
			order: 2
		},
		{
			label: "Deposito",
			field: "Deposito",
			order: 3
		},
		{
			label: "Cantidad",
			field: "Cantidad",
			order: 4
		},
		{
			label: "Origen Movimiento Detalle",
			field: "OrigenMovimientoStockDetalle",
			order: 5
		}
	];
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'MovimientoStockIndicacionMedicaDataService'];
	/**
	* @class FarmaciaVerDetalleMovimientoModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private MovimientoStockIndicacionMedicaDataService:IMovimientoStockIndicacionMedicaDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar(){
		if(this.idMovimiento){
			this.loading = true;
			this.MovimientoStockIndicacionMedicaDataService.verDetalleMovimiento(this.idMovimiento)
			.then( (pResult) => {
				this.$log.debug('pResult',pResult);
				this.dataMovimiento = pResult;

				if(this.dataMovimiento && this.dataMovimiento.Items){
					this.dataMovimiento.Items.forEach(item => {
						item.Producto = item.CodigoProducto + " - " + item.NombreProducto + " + " + item.PresentacionProducto;
					});
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});
		}
	}

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaVerDetalleMovimientoModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaVerDetalleMovimientoModalController');
		this.$log.debug('ON');

		this.idMovimiento = this.resolve.IdMovimiento;
		this.buscar();

	}
	// #endregion
}