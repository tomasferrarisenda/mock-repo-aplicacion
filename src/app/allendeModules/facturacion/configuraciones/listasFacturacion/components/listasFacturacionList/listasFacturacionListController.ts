/**
* @author: rbassi
* @description: listas Facturacion Controller
* @type: Controller
**/
import * as angular from 'angular';
import { IlistasFacturacionDataService } from '../../services';
import { FiltroListasFacturacionDTO } from '../../models/filtroListasFacturacionDTO';
import { itemListaFacturacionDTO } from '../../models/itemListaFacturacionDTO';
import { ListaFacturacionListDto } from 'src/app/allendeModules/facturacion/configuraciones/listasFacturacion/models';

export class listasFacturacionListController implements angular.IController {


	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Listas de Facturacion', // Desde la vista (HTML) se accede con vm.title.name
		icon: 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	nombreLista: string = "";
	descripcionLista: string = "";
	tipoPrefacturable: IEntidadDto = {};
	tipoPrefacturablesCombo: IEntidadDto[] = [];
	filtroDto : FiltroListasFacturacionDTO = {};
	//listadoFacturas: any = {};
	listadoDeFacturacion: GridViewDto<ListaFacturacionListDto> = {};

	currentPage = 0;

	//listadoFacturacion: GridViewDto<listasFacturacionDTO> = {};


	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$state', 'listasFacturacionDataService',
		'ModalService', 'AlertaService'];
	/**
	* @class listasFacturacionListController
	* @constructor
	*/
	constructor(
		private $log: ILogger,
		private $state,
		private listasFacturacionDataService: IlistasFacturacionDataService,
		private ModalService: IModalService,
		private AlertaService: IAlertaService
	) {
	}


	limpiarFiltros() {
		this.nombreLista = "";
		this.descripcionLista = "";
		this.tipoPrefacturable = {};
	}

	buscar() {
		if (!this.currentPage) this.currentPage = 1;
		this.buscarPagina({ currentPage: this.currentPage });
	}

	buscarPagina(pPaginacion) {
		this.currentPage = pPaginacion.currentPage;
		var pageSize = pPaginacion.pageSize || 10;

		this.filtroDto.Nombre = this.nombreLista.toUpperCase();
		this.filtroDto.Descripcion = this.descripcionLista.toUpperCase();
		this.filtroDto.IdTipo = this.tipoPrefacturable ? this.tipoPrefacturable.Id : 0;
		this.filtroDto.CurrentPage = this.currentPage;
		this.filtroDto.PageSize = pageSize;

		this.listasFacturacionDataService.obtenerListadoFacturacion(this.filtroDto).then((listadoFacturas) => {
			this.listadoDeFacturacion = listadoFacturas;
		});
	}

	editarListaFacturacion(idListaFacturacion: number, index: number) {
		this.$state.go('facturacion.configuraciones.listaFacturacion.edit',{
			IdListaEdit: idListaFacturacion
		});
	}

	eliminar(fila: any, index: number) {
		this.ModalService.confirm('¿Desea eliminar la lista '+ fila.Nombre +'?', (pResult) => {
			if (pResult) {
				this.listasFacturacionDataService.eliminar(fila.Id).then((result) => {
					if (result.IsOk === false) {
						this.AlertaService.NewWarning("Por favor verifique:" + result.Message);
					}
					else {
						if (this.listadoDeFacturacion.Rows) {
							for (let i = 0; i < this.listadoDeFacturacion.Rows.length; i++) {
								if (this.listadoDeFacturacion.Rows[i].Id === fila.Id) {
									this.listadoDeFacturacion.Rows ? this.listadoDeFacturacion.Rows.splice(i, 1) : null;
									this.AlertaService.NewSuccess("La lista ha sido eliminada.");
									break;
								}
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
	
	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */



	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class listasFacturacionListController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/

	volver() {
		this.$state.go('homesistemas');
	}


	$onInit() {
		this.$log = this.$log.getInstance('listasFacturacionListController');
		this.$log.debug('ON');
		this.activate();
	}

	activate() {
		this.listasFacturacionDataService.getAllTipoPrefacturable().then((TipoPrefacturables) => {
			this.tipoPrefacturablesCombo = TipoPrefacturables;
		});

		this.listasFacturacionDataService.obtenerFiltro().then((filtroDto) => {
			this.filtroDto = filtroDto;
			this.buscar();
		});
	}
	// #endregion
}