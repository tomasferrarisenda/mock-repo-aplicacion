/**
* @author: ppautasso
* @description: controller para componente para imprimir remito de entrega productos
* @type: Controller
**/
import * as angular from 'angular';

export class FarmaciaImprimirRemitoEntregaProductosController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	loading: boolean = false;
	data: any;
	totalCantidadItems = 0;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class FarmaciaImprimirRemitoEntregaProductosController
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
	* @class FarmaciaImprimirRemitoEntregaProductosController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaImprimirRemitoEntregaProductosController');
		this.$log.debug('ON');
		this.data = this.resolve.Data;

		if(this.data.Detalle && this.data.Detalle.length > 0){
			this.data.Detalle.forEach(detalle => {
				this.totalCantidadItems = this.totalCantidadItems + detalle.Cantidad;
			});
		}

		setTimeout( ()  => { 
			window.print();
			this.cancel() 
		}, 200);
	}
	// #endregion
}