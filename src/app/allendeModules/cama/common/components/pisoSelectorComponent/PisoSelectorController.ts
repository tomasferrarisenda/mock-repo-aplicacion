/**
* @author: ppautasso
* @description: controller para el componente de selectro piso
* @type: Controller
**/
import * as angular from 'angular';
import { IPisoDelEdificioDataService } from '../../../../support/basic/services';

export class PisoSelectorController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..

	piso;
	sucursal;
	loading;
	pisosList;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'PisoDelEdificioDataService'];
	/**
	* @class PisoSelectorController
	* @constructor
	*/
	constructor(private $log: ILogger, private PisoDelEdificioDataService:IPisoDelEdificioDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscarPisoPorSucursal(){

		this.loading = true;
		this.PisoDelEdificioDataService.obtenerPisosPorSucursalHabilitadosAlUsuario(this.sucursal.Id)
		.then((pResponsePiso) => {
			
			this.$log.debug('obtenerPisosPorSucursalHabilitadosAlUsuarioOk', pResponsePiso);
			this.pisosList = angular.copy(pResponsePiso);
			this.loading = false;

		}, (pErrorPisos) => {
			this.$log.error('obtenerPisosPorSucursalHabilitadosAlUsuarioError', pErrorPisos);
			this.loading = false;
		})
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class PisoSelectorController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('PisoSelectorController');
		this.$log.debug('ON');
	}

	$onChanges(change){
		console.log('change', change);
		if (change.sucursal) {

			if (!change.sucursal.isFirstChange() && change.sucursal.currentValue) {
				this.buscarPisoPorSucursal();
			}
		}
	
	}
	// #endregion
}