/**
* @author: ppautasso
* @description: controller para modal de ocntrolar suero de enfermeria
* @type: Controller
**/
import * as angular from 'angular';
import { IIndicacionMedicaEnfermeriaDataService } from '../../services';
import { IInfusionParaColocarSueroDto } from '../../models';

export class EnfermeriaColocarSueroModalController implements angular.IController {

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
	infusion: IInfusionParaColocarSueroDto = {};
	tipoDocumentoInternado: string = "";
	numeroDocumentoInternado: string = "";
	modoEdicion: boolean = false;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger',
		'IndicacionMedicaEnfermeriaDataService',
		'AlertaService'];
	/**
	* @class EnfermeriaColocarSueroModalController
	* @constructor
	*/
	constructor(private $log: ILogger,
		private IndicacionMedicaEnfermeriaDataService: IIndicacionMedicaEnfermeriaDataService,
		private AlertaService: IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(val) {
		this.close({ $value: val });
	}

	obtenerInfusion() {

		this.loading = true;
		if (this.resolve.InfusionId && this.resolve.SucursalId) {

			this.loading = true;
			this.IndicacionMedicaEnfermeriaDataService.obtenerInfusionParaColocarSuero(this.resolve.InfusionId, this.resolve.SucursalId)
				.then((pResultInfusion) => {
					this.$log.debug('pResultInfusion', pResultInfusion);
					this.infusion = pResultInfusion;
					this.infusion.ColocacionesRealizadas;

					this.tipoDocumentoInternado = this.resolve.TipoDocumento;
					this.numeroDocumentoInternado = this.resolve.NumeroDocumento;
					
					this.loading = false;
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
		}
	}

	guardar() {

		if (this.infusion.NuevaColocacion && this.infusion.NuevaColocacion.Colocado) {

			this.loading = true;
			this.IndicacionMedicaEnfermeriaDataService.colocarSuero(this.infusion)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					this.loading = false;
					this.AlertaService.NewSuccess("Nueva Colocación Correcta");
					this.cerrar(true);
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
		} else {
			this.AlertaService.NewWarning("Debe marcar Colocado");
		}

	}

	// #endregion

	// #region SUPPORT
	changeColocado(){
		if(this.infusion && this.infusion.NuevaColocacion){

			// si checkeo colocado => seteo con agregado
			if(this.infusion.NuevaColocacion.Colocado) {
				if(this.infusion.Agregados && this.infusion.Agregados.length) this.infusion.NuevaColocacion.ConAgregado = true;
			}

			// si descheckeo colocado => desseteo con agregado
			if(!this.infusion.NuevaColocacion.Colocado) {
				this.infusion.NuevaColocacion.ConAgregado = false;
			}

		}
	}


	// #endregion
	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaColocarSueroModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaColocarSueroModalController');
		this.$log.debug('ON');

		this.modoEdicion = this.resolve.ModoEdicion;
		this.title.name = (this.modoEdicion) ? "Cargando Suero" : "Sueros Cargados";

		this.obtenerInfusion();
	}
	// #endregion
}