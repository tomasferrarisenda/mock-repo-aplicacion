/**
* @author: ppautasso
* @description: controller para preparar indicacion medica controller
* @type: Controller
**/
import * as angular from 'angular';
import { IValidacionIndicacionMedicaDataService, IEstadoIndicacionmedicaFarmaciaDataService, ICambiarEstadoFarmaciaIndicacionMedicaDataService, IEstadoEjecucionindicacionMedicaDataService, IEstadoFacturacionIndicacionMedicaDataService, IFarmaciaFacturacionDataService } from '../../services';
import { IInfusionEditDto } from '../../models/dto/InfusionEditDto';
import { IDosificacionEditDto } from '../../models/dto';

export class FarmaciaFacturacionEditarPorcentajesMedicModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Modificar porcentajes de afiliado para medicamentos/descartables', // Desde la vista (HTML) se accede con vm.title.name
		icon: 'EDIT' // Desde la vista (HTML) se accede con vm.title.icon
	};
	loading: boolean = false;
	dismiss;
	close;
	resolve;
	// mas propiedades ..
	internado;
	fechaDesde = new Date();
	fechaHasta = new Date();
	stockeable: any;
	porcentajeMedicamentos: number = 0;
	porcentajeDescartables: number = 0;
	numeroInternado: any;

	todosLosProductos: boolean = true;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = [
		'Logger',
		'$q',
		'moment',
		'AlertaService',
		'FarmaciaFacturacionDataService'];
	/**
	* @class FarmaciaFacturacionEditarPorcentajesMedicModalController
	* @constructor
	*/
	constructor(
		private $log: ILogger,
		private $q,
		private moment,
		private AlertaService:IAlertaService,
		private FarmaciaFacturacionDataService: IFarmaciaFacturacionDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	activate(){

	}

	guardar() { 

		if (this.internado) {

			this.loading = true;

			let _fechaDesde = this.moment(this.fechaDesde).format("MM-DD-YYYY");
			let _fechaHasta = this.moment(this.fechaHasta).format("MM-DD-YYYY");
			let _codigoPractica
			if (this.todosLosProductos) {
				_codigoPractica =  0;
			} else { 
				if (this.stockeable) {
					_codigoPractica = (this.stockeable) ? this.stockeable.Codigo : 0;
				} else { 
					this.AlertaService.NewWarning("Debe seleccionar un medicamento");
					this.loading = false;
					return;
				}
			}
			
			//controlo porcetaje medicamento
			if (!Number.isInteger(this.porcentajeMedicamentos)) { 
				this.AlertaService.NewWarning("Atencion, el porcentaje medicamentos debe ser un numero entero");
				this.loading = false;
				return;
			}
			if (!Number.isInteger(this.porcentajeDescartables)) { 
				this.AlertaService.NewWarning("Atencion, el porcentaje descartable debe ser un numero entero");
				this.loading = false;
				return;
			}
			
			this.FarmaciaFacturacionDataService.editarPorcentajePracticaInternado(this.internado.Id, _codigoPractica, this.porcentajeMedicamentos,
				this.porcentajeDescartables, _fechaDesde, _fechaHasta)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					if (pResult.IsOk) {
						this.AlertaService.NewSuccess("Porcentajes modificados correctamente");
						this.cerrar(true);
					} else {
						this.AlertaService.NewWarning(pResult.Message);
					}
					this.loading = false;
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
		} else { 
			this.AlertaService.NewWarning("Atención, debe seleccionar un internado");
		}

	}

	// #endregion


	// #region SUPPORT
	cancel() {
        this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose){
		this.close({ $value: pClose });
	}
	
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaFacturacionEditarPorcentajesMedicModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaFacturacionEditarPorcentajesMedicModalController');
		this.$log.debug('ON', this.resolve);

		// setTimeout(() => {
		// 	if (this.resolve.Internado)
		// 	this.numeroInternado = this.resolve.Internado.NumeroInternado;	
		// }, 500);
	}

	// #endregion
}