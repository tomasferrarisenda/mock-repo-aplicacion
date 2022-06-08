/**
* @author: ppautasso
* @description: controller para ver detalle de item facturao en farmacia por internado
* @type: Controller
**/
import * as angular from 'angular';
import { IFarmaciaFacturacionDataService } from '../../services';

export class FarmaciaVerDetalleProductoFacturadoDeInternadoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	productoFacturado: any;
	detalleProducto: any;
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'FarmaciaFacturacionDataService'];
	/**
	* @class FarmaciaVerDetalleProductoFacturadoDeInternadoController
	* @constructor
	*/
	constructor(private $log: ILogger, private FarmaciaFacturacionDataService: IFarmaciaFacturacionDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar() {
		this.close({ $value: true });
	}	

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaVerDetalleProductoFacturadoDeInternadoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaVerDetalleProductoFacturadoDeInternadoController');
		this.$log.debug('ON');
		this.productoFacturado = angular.copy(this.resolve.ProductoInternado);
		this.FarmaciaFacturacionDataService.obtenerAuditoriaInternacion(this.productoFacturado.Id, this.productoFacturado.IdSucursal)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.loading = false;
				this.detalleProducto = pResult;				
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});

		// this.loading = true;


	}
	// #endregion
}