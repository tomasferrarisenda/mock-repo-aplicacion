/**
* @author: ppautasso
* @description: Controller para el selector sector component
* @type: Controller
**/
import * as angular from 'angular';
import { ISectorDeInternacionDataService } from '../../../../support/basic/services';

export class SectorSelectorController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	sector;
	piso;
	loading;
	sectorsList;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'SectorDeInternacionDataService'];
	/**
	* @class SectorSelectorController
	* @constructor
	*/
	constructor(private $log: ILogger, private SectorDeInternacionDataService: ISectorDeInternacionDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscarSectorPorPiso(){
		this.loading = true;
		this.SectorDeInternacionDataService.obtenerPorPisoConDeposito(this.piso.Id)
			.then((pResponseSector) => {

				this.$log.debug('obtenerPorPisoOk', pResponseSector);
				this.sectorsList = angular.copy(pResponseSector);
				this.loading = false;

			}, (pErrorPisos) => {
				this.$log.error('obtenerPorPisoError', pErrorPisos);
				this.loading = false;
			})
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class SectorSelectorController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('SectorSelectorController');
		this.$log.debug('ON');
	}

	$onChanges(change) {
		console.log('change', change);
		if (change.piso) {

			if (!change.piso.isFirstChange() && change.piso.currentValue) {
				this.buscarSectorPorPiso();
			}
		}

	}
	// #endregion
}