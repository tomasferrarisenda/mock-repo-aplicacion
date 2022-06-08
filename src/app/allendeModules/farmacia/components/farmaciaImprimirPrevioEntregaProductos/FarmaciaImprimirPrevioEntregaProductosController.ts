/**
* @author: ppautasso
* @description: Controller para el componente de imprimir hoja preparacion previo entrega
* @type: Controller
**/
import * as angular from 'angular';

export class FarmaciaImprimirPrevioEntregaProductosController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve: any;
    close: any;
	dismiss: any;
	
	data;
	sector;
	piso;
	sucursal;

	fecha = new Date();
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class FarmaciaImprimirPrevioEntregaProductosController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cerrar() {
		this.dismiss({ $value: 'cancel' });
	}

	existenMedicamentosAltoRiesgo(items){
		
		let ret = false;
		if(items.find(x => x.Producto.EsAltoRiesgo)) ret = true;
		return ret;
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaImprimirPrevioEntregaProductosController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaImprimirPrevioEntregaProductosController');
		this.$log.debug('ON');

		this.data = this.resolve.Data;
		this.sector = this.resolve.Sector;
		this.piso = this.resolve.Piso;
		this.sucursal = this.resolve.Sucursal;

		setTimeout(() => { 
			window.print();
			this.cerrar();
		}, 2500);

	}
	// #endregion
}