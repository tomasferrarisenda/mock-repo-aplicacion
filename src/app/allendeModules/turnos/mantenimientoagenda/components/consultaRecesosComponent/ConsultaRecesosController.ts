/**
* @author: pablopautasso
* @description: controller para el componente de consulta de recesos
* @type: Controller
**/
import * as angular from 'angular';

export class ConsultaRecesosController implements angular.IController {

	resolve: any;
	ok: any;
	dismiss: any;
	
	Servicio: any;
	Recurso: any;
	loading: boolean = false;
	fechaDesde: any;
	fechaHasta: any;
	recesos: any;
	
	infoUser: any;
	permisoVerMotivoDeReceso: boolean = false;

	// ID
	static $inject: Array<string> = ['Logger', 'MantenimientoAgendaDataService', 'DateUtils', 'AlertaService', 
	'PERMISSION_PLANTILLA', 'CredentialsDataService', 'MantenimientoAgendaAuthService'];
	// Constructor
	constructor(private $log: ILogger, private MantenimientoAgendaDataService, private DateUtils: IDateUtils, private AlertaService:IAlertaService,
		private PERMISSION_PLANTILLA, private CredentialsDataService, private MantenimientoAgendaAuthService) {
		this.$log = this.$log.getInstance('ConsultaRecesosController');
	}

	/* ------------------------------------------------- onINIT ------------------------------------------------- */

$onInit() {

		this.Servicio = this.resolve.Servicio;
		this.Recurso = this.resolve.Recurso;
		this.fechaDesde = this.resolve.FechaDesde.toDate();
		this.fechaHasta = this.resolve.FechaHasta.toDate();
		this.$log.debug('Inicializar ON.-', this.Servicio, this.Recurso);
		this.$log.debug('ON');

		this.infoUser = this.CredentialsDataService.GetForce();		
		this.permisoVerMotivoDeReceso = this.MantenimientoAgendaAuthService.puedeVerMotivoDeReceso(this.infoUser);
		
		this.buscar();
	}

	cancel(){
		this.dismiss({$value: 'cancel'})
	}

	buscar() {

		if(this.fechaDesde < this.fechaHasta){

			this.loading = true;
	
			let _receso = this.MantenimientoAgendaDataService.obtenerRecesosPorFiltro(this.DateUtils.parseToBeParams(this.fechaDesde), this.DateUtils.parseToBeParams(this.fechaHasta) ,
				this.Recurso.IdTipoRecurso, this.Recurso.Id, this.Servicio.Id, 0, 0)
			.then((result) =>{
	
				this.$log.debug('Buscar Recesos ON.-', result);
				if (result.length > 0){
					
					this.recesos = angular.copy(result);
				}else {
					this.AlertaService.NewWarning('Alerta', 'No hay resultados para la busqueda seleccionada');
				}
				this.loading = false;
	
	
			}, (pError) =>{
				this.$log.error('Buscar Recesos Error.-', pError);
				this.loading = false;
			})
		}else {
			this.AlertaService.NewWarning("La Fecha Desde tiene que ser inferior a Fecha Hasta")
		}

		
	}

}