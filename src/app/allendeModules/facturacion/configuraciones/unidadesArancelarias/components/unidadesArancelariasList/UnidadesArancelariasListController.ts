/**
* @author: emansilla
* @description: Lista de unidades arancelarias
* @type: Controller
**/
import * as angular from 'angular';
import { IUnidadArancelariaDataService } from '../../services';
import { IUnidadArancelariaLogicService, UnidadArancelariaLogicService } from '../../services/UnidadArancelariaLogicService';
import { FiltroUnidadArancelariaDto, unidadArancelariaDto } from '../../model';
import ModalService from 'core/notification/modal/ModalService';
import AlertaService from 'core/notification/alerta/services/AlertaService';

export class UnidadesArancelariasListController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Listado de Unidades Arancelarias',
		icon: 'LIST'
	};

	unidadArancelarias: unidadArancelariaDto [] =[];
	tiposDeUnidadArancelarias: IEntidadDto[] =[];
	filtroUnidadArancelarias: FiltroUnidadArancelariaDto = {};
	tipoUnidad: IEntidadDto = {};
	nombre: string = "";
	currentPage = 1;

	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	// ID
	static $inject: Array<string> = ['Logger', 'UnidadArancelariaDataService',
	 'UnidadArancelariaLogicService', 'ModalService', 'AlertaService','$state'];
	// Constructor
	constructor(private $log: ILogger,
		private unidadArancelariaDataService: IUnidadArancelariaDataService,
		private unidadArancelariaLogicService: IUnidadArancelariaLogicService,
		private ModalService: IModalService,
		private AlertaService: IAlertaService,
		private $state

	) {
	};
	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */



	//boton limpiar
	limpiarFiltros() {
		this.nombre = "";
		this.tipoUnidad = {};
	}


	//Buscar/filtrar
	buscar() {
		if (!this.currentPage) this.currentPage = 1;
		this.buscarPagina({ currentPage: this.currentPage });
	}

	buscarPagina(pPagination) {
		this.currentPage = pPagination.currentPage;
		var currentPage = pPagination.currentPage;
		var pageSize = pPagination.pageSize || 10;

		this.filtroUnidadArancelarias.IdTipoUnidad = this.tipoUnidad ? this.tipoUnidad.Id : 0;
		this.filtroUnidadArancelarias.Nombre = this.nombre.toUpperCase();
		this.filtroUnidadArancelarias.CurrentPage = this.currentPage;
		this.filtroUnidadArancelarias.PageSize = pageSize;


		this.unidadArancelariaDataService.ObtenerUnidadArancelariaPorFiltro(this.filtroUnidadArancelarias).then((listaUnidadArancelaria) => {
			this.unidadArancelarias = listaUnidadArancelaria;
		});
	}



	//Creo Metodo / funcion del Editar en el controller de la pagina principal
	editarUnidadArancelaria (idUnidad: number, index : number) {
		this.$log.debug('edicion de Unidad Arancelaria', idUnidad);
		this.unidadArancelariaLogicService.editUnidadArancelaria(idUnidad)
		.then((unidadGuardada : unidadArancelariaDto) => {
			if(idUnidad){
				this.unidadArancelarias[index] = unidadGuardada;
			}else {
				this.unidadArancelarias.push(unidadGuardada);
				this.buscar();
			}
		});
	}

	eliminar(unidad) {
		this.ModalService.confirm('¿Desea eliminar la Unidad Arancelaria ' + unidad.Nombre + '?', //esta parte es solo front
		//limpio el row de la vista
			(pResult) => {
				//luego al back y ejecuto el eliminar
				if (pResult) {
					this.unidadArancelariaDataService.eliminar(unidad.Id)
						.then((result) => {
							if (result === false) {
								this.AlertaService.NewWarning("Por favor verifique: " + result);
							}
							else {
								for (let i = 0; i < this.unidadArancelarias.length; i++) {
									if(this.unidadArancelarias[i].Id === unidad.Id){
										this.unidadArancelarias.splice(i, 1);
										this.AlertaService.NewSuccess("La Unidad Arancelaria ha sido eliminada.");
										break;
									}
								}
							}
						})
						.catch((pError) => {
							this.AlertaService.NewError("Error en el servidor.", pError.message);
							return;
						});
				}
			});
	}

	volver(){
		this.$state.go('homesistemas');
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	$onInit() {
		this.$log = this.$log.getInstance('UnidadesArancelariasListController');
		this.$log.debug('ON');

		this.activate()
	}

	activate() {
		this.unidadArancelariaDataService.obtenerTipoUnidadArancelaria().then((TipoUnidadArance) => {
		this.tiposDeUnidadArancelarias = TipoUnidadArance;
		});

		this.unidadArancelariaDataService.ObtenerFiltroUnidadArancelaria().then((FiltroUnidadArance) => {
			this.filtroUnidadArancelarias = FiltroUnidadArance;
			this.buscar();
		});
	}
	//Por ultimo en el HTML en data agrego "vm.unidadArancelarias"
	//<fw-table-rowset data="vm.unidadArancelarias">
	//</fw-table-rowset>

	// #endregion

}