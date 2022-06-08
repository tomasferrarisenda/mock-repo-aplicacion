/**
* @author: ppautasso
* @description: componente para editar un item facturado en farmacia
* @type: Controller
**/
import * as angular from 'angular';
import { IFarmaciaFacturacionDataService } from '../../services';
import { FacturacionMedicamentoEdit } from '../../models/FacturacionMedicamentoEdit';

export class FarmaciaFacturacionEditarItemFacturadoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	puedeEditarPrecio: boolean = true;
	dismiss;
	close;
	resolve;
	productoFacturado: FacturacionMedicamentoEdit = {};
	today = new Date();
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'FarmaciaFacturacionDataService', 'AlertaService', 'moment'];
	/**
	* @class FarmaciaFacturacionEditarItemFacturadoController
	* @constructor
	*/
	constructor(private $log: ILogger, private FarmaciaFacturacionDataService: IFarmaciaFacturacionDataService, 
		private AlertaService: IAlertaService, private moment) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar() {
		this.close({ $value: true });
	}

	 validarCargaMedicamento(){
		var informeError = '';
		if (!this.productoFacturado.Cantidad)
			informeError += '- Debe ingresar cantidad mayor a cero \n ';

		if (this.productoFacturado.PrecioUnitario === undefined)
			informeError += '- Precio unitario incorrecto \n ';

		if (this.productoFacturado.PorcentajeAfiliado === undefined)
			informeError += '- Porcentaje afiliado incorrecto \n ';

		if (this.productoFacturado.Fecha === undefined)
			informeError += '- Fecha invalida \n ';

		return informeError;
	}


	guardar() {

		var informeError = this.validarCargaMedicamento();

		if(informeError != '')
		{
			this.AlertaService.NewError(informeError);

		}else 
		{
			this.loading = true;

			this.$log.debug('productoFacturado',this.productoFacturado);
	
			let _productoFacturado = angular.copy(this.productoFacturado);
			_productoFacturado.Fecha = this.moment(this.productoFacturado.Fecha).format("MM-DD-YYYY");
	
				this.FarmaciaFacturacionDataService.guardar(_productoFacturado)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					this.loading = false;
					if (pResult && pResult.IsOk) {
						this.AlertaService.NewSuccess("Facturación Modificada");
						this.cerrar();
					} else if(pResult.IsOk === false){
						this.AlertaService.NewError(pResult.Message);
					}
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
	
		}

	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaFacturacionEditarItemFacturadoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaFacturacionEditarItemFacturadoController');
		this.$log.debug('ON');
		this.productoFacturado = angular.copy(this.resolve.ProductoEnInternacion);
		this.puedeEditarPrecio = angular.copy(this.resolve.EditPrecio);
		this.$log.debug('productofacturado', this.productoFacturado);
	}
	// #endregion
}