/**
* @author: ppautasso
* @description: controller para editar stock normal de un producto en deposito
* @type: Controller
**/
import * as angular from 'angular';
import { IDepositoDataService } from '../../../enfermeria/services';

export class FarmaciaEditarStockNormalDeProductoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	deposito;
	producto;
	stockNormalNuevo;
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'AlertaService', 'DepositoDataService'];
	/**
	* @class FarmaciaEditarStockNormalDeProductoController
	* @constructor
	*/
	constructor(private $log: ILogger, private AlertaService:IAlertaService, private DepositoDataService:IDepositoDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}
	
	cerrar(val){
		this.close({ $value: val });
	}

	guardar(){
		if(this.stockNormalNuevo){
			this.loading = true;
			this.DepositoDataService.editarStockNormalProducto(this.producto.Id, this.stockNormalNuevo)
			.then( (pResult) => {
				this.$log.debug('pResult',pResult);
				if(pResult && pResult.IsOk){
					this.AlertaService.NewSuccess("Stock Normal Editado Correctamente");
					this.cerrar(true);
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});

		}else this.AlertaService.NewWarning("Debe ingresar un Nuevo Stock Normal")
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaEditarStockNormalDeProductoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaEditarStockNormalDeProductoController');
		this.$log.debug('ON');
		this.producto = angular.copy(this.resolve.Producto);
		this.deposito = angular.copy(this.resolve.Deposito);
		this.$log.debug('this resolve',this.resolve);
		
	}
	// #endregion
}