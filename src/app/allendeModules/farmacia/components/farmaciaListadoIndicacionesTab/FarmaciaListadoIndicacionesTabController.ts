/**
* @author: ppautasso
* @description: controller para farmacia listado indicaciones
* @type: Controller
**/
import * as angular from 'angular';
import { ITipoIndicacionMedicaDataService, IEstadoIndicacionMedicaDataService, IIndicacionMedicaDataService } from '../../services';

export class FarmaciaListadoIndicacionesTabController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	loading: boolean = false;
	fechaDesde = new Date();
	fechaHasta = new Date();
	fechaDesdeMin = new Date();
	// mas propiedades ..
	tiposIndicacionList;
	tipoIndicacion;
	estadoIndicacionList;
	estadoIndicacion;
	internadoConAltas;
	indicaciones;
	
	private _internado : any;
	public get internado() : any {
		return this._internado;
	}
	public set internado(v : any) {
		this._internado = v;
		if(v){
			// tengo que buscar al cambiar el internado
			this.changeInternado(v);
		}
	}
	
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'moment', 'AlertaService',
	 'TipoIndicacionMedicaDataService', 'EstadoIndicacionMedicaDataService', 'IndicacionMedicaDataService'];
	/**
	* @class FarmaciaListadoIndicacionesTabController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private moment, private AlertaService:IAlertaService,
		private TipoIndicacionMedicaDataService:ITipoIndicacionMedicaDataService,
		private EstadoIndicacionMedicaDataService:IEstadoIndicacionMedicaDataService,
		private IndicacionMedicaDataService:IIndicacionMedicaDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar(){
		
		if(this.internado && this.internado.Id){

			this.loading = true;
	
			let _FechaDesde = angular.copy(this.moment(this.fechaDesde).format("MM-DD-YYYY"));
			let _FechaHasta = angular.copy(this.moment(this.fechaHasta).format("MM-DD-YYYY"));
			let _tipoIndicacion = (this.tipoIndicacion) ? this.tipoIndicacion.Id : 0;
			let _estadoIndicacion = (this.estadoIndicacion) ? this.estadoIndicacion.Id : 0;
	
			this.IndicacionMedicaDataService.obtenerPorIdInternacionYFiltros(this.internado.Id, _FechaDesde, _FechaHasta, _tipoIndicacion, _estadoIndicacion)
			.then( (pResultIndicaciones) => {
				this.$log.debug('pResultIndicaciones',pResultIndicaciones);
				if(pResultIndicaciones && pResultIndicaciones.length){
					this.indicaciones = pResultIndicaciones;
				}else this.AlertaService.NewWarning("No existen resultados para la busqueda");
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError',pError);
			});
		}else {
			this.AlertaService.NewWarning("Debe seleccionar un internado");
		}

	}

	limpiar(){
		delete this.internado;
		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
		this.fechaDesdeMin = new Date();

		this.fechaDesde.setDate(this.fechaHasta.getDate() - 3);
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);

		delete this.tipoIndicacion;
		delete this.estadoIndicacion;
		delete this.indicaciones;
	}
	// #endregion

	// #region /* ----------------------------------------- SUPPORT ----------------------------------------- */
	changeInternado(internado){
		this.loading = true;
		this.IndicacionMedicaDataService.obtenerInternacionPorIdConAltas(internado.Id)
		.then( (pResult) => {

			this.$log.debug('pResult',pResult);
			this.internadoConAltas = pResult;
			if(!pResult.FechaAdmision.includes("0001")){
				this.fechaDesde = this.moment(pResult.FechaAdmision).toDate();
				this.fechaHasta = this.moment(pResult.FechaAltaMedica).toDate();
			}
			this.loading = false;	

		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}
	// #endregion
	

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaListadoIndicacionesTabController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaListadoIndicacionesTabController');
		this.$log.debug('ON');

		this.loading = true;
		
		this.fechaDesde.setDate(this.fechaHasta.getDate() - 3);
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);

		let _TipoIndicacionMedicaDataService = this.TipoIndicacionMedicaDataService.getAll();
		let _EstadoIndicacionMedicaDataService = this.EstadoIndicacionMedicaDataService.getAll();


		this.$q.all([
			_TipoIndicacionMedicaDataService,
			_EstadoIndicacionMedicaDataService
		])

		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.tiposIndicacionList = pResult[0];
			this.estadoIndicacionList = pResult[1];

			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}
	// #endregion
}