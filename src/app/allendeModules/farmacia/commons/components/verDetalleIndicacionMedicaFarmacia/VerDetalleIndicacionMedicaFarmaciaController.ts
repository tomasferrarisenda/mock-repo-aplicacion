/**
* @author: ppautasso
* @description: controller para ver detalle indicacion medica controller
* @type: Controller
**/
import * as angular from 'angular';
import { IIndicacionMedicaDataService } from '../../../services';
import { IIndicacionMedica, IIndicacionMedicaView } from '../../../models';

export class VerDetalleIndicacionMedicaFarmaciaController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	loading: boolean = false;

	indicacionMedica: IIndicacionMedica = {};
	indicacionMedicaView: IIndicacionMedicaView = {};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'IndicacionMedicaDataService'];
	/**
	* @class VerDetalleIndicacionMedicaFarmaciaController
	* @constructor
	*/
	constructor(private $log: ILogger, private IndicacionMedicaDataService: IIndicacionMedicaDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	buscar() {

		if (this.indicacionMedica.Id && this.indicacionMedica.IdSucursal && this.indicacionMedica.IdTipoIndicacion) {
			this.loading = true;
			this.IndicacionMedicaDataService.obtenerPorId(this.indicacionMedica.Id, this.indicacionMedica.IdSucursal, this.indicacionMedica.IdTipoIndicacion)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					this.indicacionMedicaView = Object.assign({},pResult);
					if(this.indicacionMedicaView && this.indicacionMedicaView.FechaSuspension){

						if(this.indicacionMedicaView.FechaSuspension.includes("0001"))  this.indicacionMedicaView.FechaSuspension = "-";
					}
					this.loading = false
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false
				});
		}
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class VerDetalleIndicacionMedicaFarmaciaController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('VerDetalleIndicacionMedicaFarmaciaController');
		this.indicacionMedica = angular.copy(this.resolve.IndicacionMedica);
		this.$log.debug('ON', this.indicacionMedica);
		this.buscar();

	}
	// #endregion
}