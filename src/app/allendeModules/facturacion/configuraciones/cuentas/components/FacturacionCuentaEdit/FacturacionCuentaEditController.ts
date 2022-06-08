/**
* @author: Crusso
* @description: Editar Modal de Cuentas de Facturación
* @type: Controller
**/
import * as angular from 'angular';
import { ICuentaDataService } from '../../services';
import { CuentaDto } from '../../../../common';

// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

export class FacturacionCuentaEditController implements angular.IController  {
	
	title = {
		name: 'Editar Cuenta de Facturación', // Desde la vista (HTML) se accede con vm.title.name
		icon: 'EDIT' // Desde la vista (HTML) se accede con vm.title.icon
	};

	resolve : any;
	dismiss : any;
	close : any;
	cuenta : CuentaDto = {};
	
	
	// ID
	static $inject: Array<string> = ['Logger', 'CuentaDataService', 'ModalService'];
	// Constructor
		constructor(
		private $log: ILogger,
		private CuentaDataService: ICuentaDataService,
		private ModalService: IModalService
	) {	}

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	private method2(param1: string): void {
	}

	guardar() {
		this.CuentaDataService.guardar(this.cuenta).then((result) => {
			if (result.IsOk) {
				this.ModalService.success("Se ha guardado la cuenta.");
				this.close({ $value: result });
			}
			else {
				this.ModalService.warning("Verifique por favor. " + result.Message);
			}
		});
	}

	/**
	* @class FacturacionCuentaEditController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('facturacionCuentasEditController');
		this.$log.debug('ON');
		this.obtenerCuenta();
	}

	obtenerCuenta() {
		this.CuentaDataService.obtenerPorId(this.resolve.idCuenta).then((result) => {
			this.cuenta = result;
			// console.log("resultado", result);
		});
	}
}