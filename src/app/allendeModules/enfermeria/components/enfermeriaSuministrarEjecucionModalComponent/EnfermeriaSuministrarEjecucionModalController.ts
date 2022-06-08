/**
* @author: ppautasso
* @description: controller para modal de suministro de ejecuciones enfermeria
* @type: Controller
**/
import * as angular from 'angular';
import { IIndicacionMedicaEnfermeriaDataService } from '../../services';
import { IEjecucionParaSuministroDTo } from '../../models';

export class EnfermeriaSuministrarEjecucionModalController implements angular.IController {

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
	ejecucion: IEjecucionParaSuministroDTo = {};
	suministrarSi: boolean = false;
	suministrarNo: boolean = false;
	tipoDocumentoInternado: string = "";
	numeroDocumentoInternado: string = "";
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger',
		'IndicacionMedicaEnfermeriaDataService',
		'AlertaService'];
	/**
	* @class EnfermeriaSuministrarEjecucionModalController
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

	obtenerEjecucion() {

		if (this.resolve.TomaId && this.resolve.SucursalId) {

			this.loading = true;
			this.IndicacionMedicaEnfermeriaDataService.obtenerEjecucionParaSuministro(this.resolve.TomaId, this.resolve.SucursalId)
				.then((pResultEjecucion) => {
					this.$log.debug('pResultEjecucion', pResultEjecucion);
					this.ejecucion = pResultEjecucion;

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

		//consulto si tengo alguna opcion seleciconada de suministro
		if (this.suministrarNo || this.suministrarSi) {

			// si tengo suministrar si guardo derecho
			if (this.suministrarSi) this.guardarOk();
			else {
				//tengo una opcion => pero es la opcion NO. por ende la observacion tiene que ser obligatoria
				if (this.suministrarNo && this.ejecucion.Observaciones && this.ejecucion.Observaciones.length) {
					this.guardarOk();
				} else {
					this.AlertaService.NewWarning("Atención", "La opcion NO esta seleccionada. Debe completar una observación");
				}
			}
		} else {
			this.AlertaService.NewWarning("Atención", "Debe seleccionar una opcion de suministro");
		}

	}

	guardarOk() {
		this.loading = true;

		this.ejecucion.IdEstadoEjecucion = (this.suministrarSi) ? 2 : 3;

		this.IndicacionMedicaEnfermeriaDataService.suministrarEjecucion(this.ejecucion)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.loading = false;
				this.AlertaService.NewSuccess("Suministro Ejecución Guardado");
				this.cerrar(true);
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}

	// #endregion

	// #region SUPPORT
	changeCheckAccion(state) {
		if (state) this.suministrarNo = false;
		else this.suministrarSi = false;
	}


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaSuministrarEjecucionModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaSuministrarEjecucionModalController');
		this.$log.debug('ON');

		this.obtenerEjecucion();
	}
	// #endregion
}