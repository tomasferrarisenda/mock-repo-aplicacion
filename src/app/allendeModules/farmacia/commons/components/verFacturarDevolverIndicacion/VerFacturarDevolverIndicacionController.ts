/**
* @author: ppautasso
* @description: controller para facturar/devolver indicacion medica en farmacia
* @type: Controller
**/
import * as angular from 'angular';
import { IItemsIndicacionMedicaFarmacia } from '../../../models/util';
import { IFarmaciaIndicacionesMedicasDataService, IEstadoFacturacionIndicacionMedicaDataService, IEstadoEjecucionindicacionMedicaDataService } from '../../../services';
import { IConceptoFacturableDto, IEntregaPendienteDto } from '../../../models';
import { IEstadoEjecucionIndicacionMedica, IEstadoFacturacionIndicacionMedica } from '../../../models/dto';

export class VerFacturarDevolverIndicacionController implements angular.IController {

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
	itemsFacturarDevolver;
	internado;

	conceptoFacturable:IConceptoFacturableDto = {};
	entregaPendiente:IEntregaPendienteDto = {};

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger','$q', 'FarmaciaIndicacionesMedicasDataService', 'AlertaService',
	'EstadoFacturacionIndicacionMedicaDataService'];
	/**
	* @class VerFacturarDevolverIndicacionController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private FarmaciaIndicacionesMedicasDataService:IFarmaciaIndicacionesMedicasDataService,
	private AlertaService:IAlertaService
	) {
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
		// seteamos los datos
		this.loading = true;

		this.setDataToSave();
		
		this.FarmaciaIndicacionesMedicasDataService.facturarODevolverEntregasPendientes(this.entregaPendiente)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.AlertaService.NewSuccess("Guardar Facturar/Devolver correcto");
			this.loading = false;
			this.cerrar(true);
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}

	setDataToSave(){
		
		this.entregaPendiente.Conceptos = [];

		// consulto si tengo Agregados 
		if(this.itemsFacturarDevolver.Agregados){
			this.itemsFacturarDevolver.Agregados.forEach(agregado => {
				let _concepto = this.obtenerConceptoFacturable(agregado);
				if(this.entregaPendiente.Conceptos)
				this.entregaPendiente.Conceptos.push(_concepto); 
			});
		}

		// consulto si tengo Descartables
		if(this.itemsFacturarDevolver.Descartables){
			this.itemsFacturarDevolver.Descartables.forEach(descartable => {
				let _concepto = this.obtenerConceptoFacturable(descartable);
				if(this.entregaPendiente.Conceptos)
				this.entregaPendiente.Conceptos.push(_concepto); 
			});
		}

		// consulto si tengo Ejecuciones
		if(this.itemsFacturarDevolver.Ejecuciones){
			this.itemsFacturarDevolver.Ejecuciones.forEach(ejecucion => {
				let _concepto = this.obtenerConceptoFacturable(ejecucion);
				if(this.entregaPendiente.Conceptos)
				this.entregaPendiente.Conceptos.push(_concepto); 
			});
		}

		this.$log.debug('dataToSave',this.entregaPendiente);
	}

	obtenerConceptoFacturable(item){

		this.conceptoFacturable = {};
		this.conceptoFacturable.Id = item.Id;
		this.conceptoFacturable.IdSucursal = item.IdSucursal;
		this.conceptoFacturable.IdTipoConceptoIndicacionMedica = item.IdTipoConcepto;
		this.conceptoFacturable.Devolver = item.Devolver;
		this.conceptoFacturable.Facturar = item.Facturar;
		return this.conceptoFacturable;
	}


	changeCheckAccion(item, accion) {
		if (accion == 1) {
			// voy a facturar => limpio el devolver
			item.Devolver = false;
		}
		if (accion == 2) {
			// voy a Devolver => limpio el devolver
			item.Facturar = false;
		}
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class VerFacturarDevolverIndicacionController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('VerFacturarDevolverIndicacionController');
		this.loading = true;

		// obtengo todas los items prefacturables de las indnicaciones
		this.itemsFacturarDevolver = angular.copy(this.resolve.IndicacionesAFacturarDevolver);
		this.internado = angular.copy(this.resolve.Internado);
		this.$log.debug('ON', this.itemsFacturarDevolver);

		// obtengo los concepto facturable y la entrega pendiente
		let _nuevoConceptoFacturable = this.FarmaciaIndicacionesMedicasDataService.obtenerNuevoConceptoFacturable();
		let _nuevaEntregaPendiente =  this.FarmaciaIndicacionesMedicasDataService.obtenerNuevaEntregaPendiente();
	

		this.$q.all([_nuevoConceptoFacturable, _nuevaEntregaPendiente])
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.loading = false;
			this.conceptoFacturable = pResult[0];
			this.entregaPendiente = pResult[1];

		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
				
	
	}
	// #endregion
}