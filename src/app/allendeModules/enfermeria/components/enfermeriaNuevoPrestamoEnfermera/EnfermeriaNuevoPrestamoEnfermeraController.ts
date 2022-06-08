/**
* @author: ppautasso
* @description: controller para modal de prestamo de enfermera
* @type: Controller
**/
import * as angular from 'angular';
import { ISectorDeInternacionDataService } from '../../../support/basic/services';
import { EnfermeraAsignacionTemporal, EnfermeraSectorAsignacionTemporal } from '../../models';
import { IAsignacionTemporalEnfermeraDataService } from '../../services';

export class EnfermeriaNuevoPrestamoEnfermeraController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	close;
	dismiss;
	nuevoMovimientoEnfermera: EnfermeraAsignacionTemporal = {};
	sectoresPorEnfermera;
	asignacionTemporalActual;
	enfermera;
	sectoresPorDefecto;
	loading: boolean = false;
	sector;
	excluirSubSeccion: boolean = false;
	fechaDesde = new Date();
	fechaHasta = new Date();
	fechadesdeMin = new Date();
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'moment', 'AlertaService' ,
	'AsignacionTemporalEnfermeraDataService',
	'SectorDeInternacionDataService'];
	/**
	* @class EnfermeriaNuevoPrestamoEnfermeraController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private moment, private AlertaService:IAlertaService, 
		private AsignacionTemporalEnfermeraDataService:IAsignacionTemporalEnfermeraDataService,
		private SectorDeInternacionDataService:ISectorDeInternacionDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel(){
		this.dismiss({ $value: 'cancel' });
	}

	ok(){
		this.close({ $value: true });
	}

	guardar(){

		this.loading = true;
		this.nuevoMovimientoEnfermera.IdEnfermera = angular.copy(this.enfermera.Id);

		this.nuevoMovimientoEnfermera.IncluirAsignacionPorDefecto = angular.copy(this.excluirSubSeccion);
		this.nuevoMovimientoEnfermera.Desde = angular.copy(this.moment(this.fechaDesde).format("MM-DD-YYYY"));
		this.nuevoMovimientoEnfermera.Hasta = angular.copy(this.moment(this.fechaHasta).format("MM-DD-YYYY"));
		var _sectores : Array<EnfermeraSectorAsignacionTemporal> = [];

		angular.forEach(this.sectoresPorEnfermera, (sector) => {
			if(sector.Activo)
			_sectores.push({
				IdSectorDeInternacion: sector.Id
			})
		});

		this.nuevoMovimientoEnfermera.Sectores = angular.copy(_sectores);

		this.AsignacionTemporalEnfermeraDataService.guardar(this.nuevoMovimientoEnfermera)
		.then((pResult) => {

			this.loading = false;
			this.$log.debug('pResultGuardar',pResult);
			if (pResult.IsOk){

				this.$log.debug('pResult',pResult);
				this.AlertaService.NewSuccess("Enfermera Asignada");
				this.ok();
			}else {
				this.AlertaService.NewError(pResult.Message);
			}

		}, (pError) => {
			this.loading = false;
			this.$log.error('error',pError);
		});
		
	}


	changeFechaDesde() {
				
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaNuevoPrestamoEnfermeraController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaNuevoPrestamoEnfermeraController');
		this.$log.debug('ON');
		this.loading = true;

		this.enfermera = angular.copy(this.resolve.Enfermera);

		if (this.enfermera.SectoresPorDefecto && this.enfermera.SectoresPorDefecto.length){
			this.sectoresPorDefecto = angular.copy(this.enfermera.SectoresPorDefecto.split("<BR>"));
		}
		
		
		this.$log.debug('enfermeraObtenida',this.enfermera);
				
		this.fechaHasta.setDate(this.fechaDesde.getDate() + 1);
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
		
		let _nuevoMovimientoEnfermera = this.AsignacionTemporalEnfermeraDataService.obtenerNuevo();
		let _sectoresPorEnfermera = this.SectorDeInternacionDataService.obtenerAsignablesAEnfermera(this.enfermera.Id);

		this.$q.all([_nuevoMovimientoEnfermera, _sectoresPorEnfermera])
		.then((pResponse) => {
			this.$log.debug('pResponseOk',pResponse);
			this.nuevoMovimientoEnfermera = angular.copy(pResponse[0]);
			this.sectoresPorEnfermera = angular.copy(pResponse[1]);
			this.loading = false;
		}, (pError) => {
			this.$log.error('error',pError);
			this.loading = false;
		});

		
	}
	// #endregion
}