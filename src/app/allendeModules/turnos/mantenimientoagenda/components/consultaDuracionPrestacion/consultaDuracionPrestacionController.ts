/**
* @author:         rbassi
* @description:    Consulta de prestacion 
* @type:           Controller
**/
import * as angular from 'angular';


export class ConsultaDuracionPrestacionController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name : 'Duracion de Prestacion', // Desde la vista (HTML) se accede con vm.title.name
		icon : 'LIST'  // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..

	data = {
	};

	servicioMedico: any;
	recurso: any = '' ;
	sucursal: any = '';
	duracionPrestacion: any = {} ;
	prestacion: any = '';
	
	
	loading: boolean = false;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'MantenimientoAgendaDataService', 'AlertaService'];
	/**
	 * @class       ConsultaDuracionPrestacionController
	 * @constructor
	 */
	constructor(private $log: ILogger, private MantenimientoAgendaDataService, private AlertaService:IAlertaService) {
		this.$log = this.$log.getInstance('ConsultaDuracionPrestacionController');
	}
	// #endregion


	/**
	 * @class       ConsultaDuracionPrestacionController
	 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	 * @event
	*/
	$onInit() {
		this.$log.debug('Inicializar ON.-');
		this.$log.debug('ON');
	}
	// #endregion

	buscar() {


		let idRecurso = this.recurso && this.recurso.Id? this.recurso.Id : 0;
		let idTipoRecurso = this.recurso && this.recurso.IdTipoRecurso? this.recurso.IdTipoRecurso: 0;
		let idSucursal = this.sucursal && this.sucursal.Id? this.sucursal.Id : 0;
		let idPrestacion = this.prestacion && this.prestacion.Id? this.prestacion.Id : 0;
		let activo = false;
		let soloVisiblePortalWeb = false;
		let IdservicioMedico = this.servicioMedico && this.servicioMedico.Id? this.servicioMedico.Id : 0;

		if (IdservicioMedico) {

			this.MantenimientoAgendaDataService.duracionDePrestacion(this.servicioMedico.Id,idRecurso, idTipoRecurso, idSucursal,idPrestacion,activo,soloVisiblePortalWeb)
			.then((result) =>{
		
				this.$log.debug('Buscar DuracionPrestacion ON.-', result);
				this.duracionPrestacion = angular.copy(result);
	
				this.loading = false;
	
	
			}, (pError) =>{
				this.$log.error('Buscar Recesos Error.-', pError);
				this.loading = false;
			});

		}
		else
		{
			this.AlertaService.NewWarning("Debe ingresar un Servicio");
		}
		

		
	}

	limpiarFiltros(){
		this.servicioMedico = '';
		this.recurso = '';
		this.sucursal = '';
		this.prestacion = '';
		
	}

}