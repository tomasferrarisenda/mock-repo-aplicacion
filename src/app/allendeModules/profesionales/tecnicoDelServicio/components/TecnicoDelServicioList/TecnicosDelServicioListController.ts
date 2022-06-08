/**
* @author: crusso
* @description: Tecnicos del Servicio Controllers
* @type: Controller
**/
import * as angular from 'angular';
import { ITecnicoDelServicioDataService, ITecnicoDelServicioLogicService } from "../../services";
import { FiltroListaTecnico } from "../../model/filtroTecnicoDelServicioDto";
import { ISupportDataService } from "../../../../support/basic/services";
import { ISucursalDataService } from "../../../../support/basic/services/SucursalDataService";
import Row from 'core/component/table/row/Row';
import { TecnicoDelServicioDTO } from '../../model';

export class TecnicosDelServicioListController implements angular.IController
 {


	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Listado del Técnicos Servicio',
		icon: 'LIST'
	};

	nombre = "";
	codigo: any;
	matricula: any;
	filtroDto: FiltroListaTecnico = {};
	listadoTecnicoServicio : TecnicoDelServicioDTO[] = [];
	currentPage = 1;
	resultsCuenta: any;
	servicioElegido: IEntidadDto = {};
	listadoServicio = []
	sucursalElegida: IEntidadDto = {};
	sucursalServicio = [];

	//Figura Error 404  Consultar con el mejor Maestro */
	formControl = {
		borrarTecnicoServicio: this.borrarTecnicoServicio,
	};


	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$state', 'ModalService', 'AlertaService',
	'TecnicoDelServicioDataService', 'SupportDataService', 'SucursalDataService', 'TecnicoDelServicioLogicService',];
	/**
	* @class TecnicosDelServicioListController
	* @constructor
	*/


	/*Constructor */
	constructor(
		private $log: ILogger,
		private $state,
		private ModalService: IModalService,
		private AlertaService: IAlertaService,
		private TecnicoDelServicioDataService: ITecnicoDelServicioDataService,
		private SupportDataService: ISupportDataService,
		private SucursalDataService: ISucursalDataService,
		private TecnicoDelServicioLogicService: ITecnicoDelServicioLogicService,

		//private SucursalDataService: ISucursalDataService,
	) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	public method(param1: string): void { // Desde la vista (HTML) se accede con vm.method(algo)

	}

	private method2(param1: string): void { // No se puede llamar desde la vista (HTML) por que es privada

	}

	// #endregion




	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class TecnicosDelServicioListController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/


	buscar() {
		if (!this.currentPage) this.currentPage = 1;
		this.buscarPagina({ currentPage: this.currentPage });
	}

	buscarPagina(pPagination) {
		this.currentPage = pPagination.currentPage;
		var currentPage = pPagination.currentPage;
		var pageSize = pPagination.pageSize || 10;

		this.filtroDto.Codigo = this.codigo;
		this.filtroDto.Nombre = this.nombre.toUpperCase();
		this.filtroDto.Matricula = this.matricula;

		this.filtroDto.IdServicio = this.servicioElegido ? this.servicioElegido.Id : 0;
		this.filtroDto.IdSucursal = this.sucursalElegida ? this.sucursalElegida.Id : 0;
		// if(this.sucursalElegida === null){
		// 	this.filtroDto.IdSucursal = 0;
		// }
		// else{
		// 	this.filtroDto.IdSucursal = this.sucursalElegida.Id;
		// }
		this.filtroDto.CurrentPage = currentPage;
		this.filtroDto.PageSize = pageSize;

		this.TecnicoDelServicioDataService.ObtenerTecnicoServicioPorFiltro(this.filtroDto).then(
			(listaTecnicos) => {
				this.listadoTecnicoServicio = listaTecnicos;
			});
	}

	limpiarFiltros() { // Boton Limpiar
		this.nombre = "";
		this.codigo = 0;
		this.matricula = 0;
		this.servicioElegido = {};
		this.sucursalElegida = {};
	}

	editarTecnicoServicio(idTecnicoDelServicio, index) {
		this.TecnicoDelServicioLogicService.editarTecnicoServicio(idTecnicoDelServicio).then((tecnicoGuardado) => {
			this.listadoTecnicoServicio[index] = tecnicoGuardado;
		});
	}

	// nuevoTecnico() {
	// 	this.TecnicoDelServicioLogicService.nuevoTecnico(idTecnicoDelServicio).then((tecnicoGuardado) => {
	// 		this.listadoTecnicoServicio[index] = tecnicoGuardado;
	// 	});
	// }

	borrarTecnicoServicio(fila, index) {
		this.ModalService.confirm('¿Desea eliminar la cuenta ' + fila.Nombre + '?',
			(pResult) => {
				if (pResult) {
					this.TecnicoDelServicioDataService.eliminarTecnicoServicio(fila.Id)
						.then((result) => {
							if (result.IsOk == false) {
								this.AlertaService.NewWarning("Por favor verifique: " + result.Message);
							}
							else {
								this.listadoTecnicoServicio.splice(index, 1);
								this.AlertaService.NewSuccess("El técnico ha sido eliminado.");
							}
						})
						.catch((pError) => {
							this.AlertaService.NewError("Error en el servidor.", pError.message);
							return;
						});
				}
			});
	}

	volver() {
		this.$state.go('homesistemas');
	}

	$onInit() {
		this.$log = this.$log.getInstance('TecnicosDelServicioListController');
		this.$log.debug('ON');
		this.activate();
	}

	activate() {
		this.SupportDataService.getAllServicioMedico().then((servicios) => {
			this.listadoServicio = servicios;
		});

		this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
			this.sucursalServicio = sucursales;
		});

		this.TecnicoDelServicioDataService.ObtenerFiltroTecnicoServicio().then((filtroDto) => {
			this.filtroDto = filtroDto;
			this.buscar()
		});

	}

	// #endregion
}