/**
* @author: ppautasso
* @description: controller para componente select de sucursal
* @type: Controller
**/
import * as angular from 'angular';
import { ISucursalDataService } from '../../../../allendeModules/support/basic/services';

export class SucursalSelectController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	ifLabel: boolean = true;
	sucursal;
	todasOption: boolean = false;
	sucursales;
	disabled: boolean = false;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'SucursalDataService'];
	/**
	* @class SucursalSelectController
	* @constructor
	*/
	constructor(private $log: ILogger, private SucursalDataService:ISucursalDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscarSucursales(){
		this.SucursalDataService.getAllSucursalesConFiltro()
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.sucursales = angular.copy(pResult);
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class SucursalSelectController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('SucursalSelectController');
		this.$log.debug('ON');
		this.buscarSucursales();
	}
	// #endregion
}