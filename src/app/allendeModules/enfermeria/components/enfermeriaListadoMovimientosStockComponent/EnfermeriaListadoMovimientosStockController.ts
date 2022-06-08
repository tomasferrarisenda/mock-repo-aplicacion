/**
* @author: ppautasso
* @description: Controller para el componente de enfermeria listado moviemento de stock
* @type: Controller
**/
import * as angular from 'angular';
import { IMovimientoStockPisoDataService, ITipoMovimientoStockDataService, IMovimientosStockDataService } from '../../services/movimientos';
import { FiltroBusquedaMovimientoPiso } from '../../models';
import { IEnfermeriaLogicService } from '../../services';
import { IEstadoMovimientoStockDataService } from 'src/app/allendeModules/farmacia/services';
import { ICredentialsDataService } from 'core/security';

export class EnfermeriaListadoMovimientosStockController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	today = new Date();
	todayMinus4Days = new Date();
	fechaDesde;
	fechaHasta = new Date();
	loading = false;

	// Pagination
	tableOption = {
		CurrentPage: 1,
		PageSize: 10
	}

	sucursal;
	sucursalesList;
	piso;
	sector;
	deposito;

	internado;
	stockeable;
	tipoMovimientosList;
	listaDeMovimientos;
	tipoMovimiento;

	estadoMovimientoList;
	estadoMovimiento;

	nuevoFiltroBusqueda: FiltroBusquedaMovimientoPiso = {};

	filtroInternado;

	contextMenu;
	infoUser;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'moment', 'AlertaService', 'CredentialsDataService',
		'MovimientoStockPisoDataService', 'EnfermeriaLogicService', 'MovimientosStockDataService',
		'TipoMovimientoStockDataService', 'ModalService', 'EstadoMovimientoStockDataService'];
	/**
	* @class EnfermeriaListadoMovimientosStockController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private moment, private AlertaService: IAlertaService,
		private CredentialsDataService: ICredentialsDataService,
		private MovimientoStockPisoDataService: IMovimientoStockPisoDataService, private EnfermeriaLogicService: IEnfermeriaLogicService,
		private MovimientosStockDataService: IMovimientosStockDataService,
		private TipoMovimientoStockDataService: ITipoMovimientoStockDataService,
		private ModalService, private EstadoMovimientoStockDataService:IEstadoMovimientoStockDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	public setRangoFecha(): void {
		this.todayMinus4Days.setDate(this.today.getDate() - 4);
		this.fechaDesde = angular.copy(this.todayMinus4Days);
	}

	public onLoading(value) {
		this.loading = value;
	}

	buscar() {
		this.$log.debug('stockaebla', this.stockeable, this.deposito);

		if (this.deposito) {
			this.loading = true;
			this.setearDatosFiltro().then((response) => {
				this.MovimientoStockPisoDataService.obtenerPorFiltros(this.nuevoFiltroBusqueda)
					.then((listaMovimientosResponse) => {
						this.$log.debug('obtenerPorFiltrosOk', listaMovimientosResponse);

						if (listaMovimientosResponse && listaMovimientosResponse.Rows && listaMovimientosResponse.Rows.length > 0) {
							this.listaDeMovimientos = angular.copy(listaMovimientosResponse);
						} else {
							this.AlertaService.NewWarning("No hay datos para la busqueda seleccionada");
							delete this.listaDeMovimientos;
						}
						this.loading = false;
					}, (listaMovimientoError) => {
						this.$log.error('obtenerPorFiltrosError', listaMovimientoError);
						this.loading = false
					})

			});
		} else {
			this.AlertaService.NewWarning("Debe seleccionar un deposito para realizar una busqueda");
		}

	}

	setearDatosFiltro() {
		let def = this.$q.defer();

		if (this.deposito) {
			this.nuevoFiltroBusqueda.IdDeposito = angular.copy(this.deposito.Id);
			this.nuevoFiltroBusqueda.FechaDesde = angular.copy(this.moment(this.fechaDesde).format("MM-DD-YYYY"));
			this.nuevoFiltroBusqueda.FechaHasta = angular.copy(this.moment(this.fechaHasta).format("MM-DD-YYYY"));
			this.nuevoFiltroBusqueda.IdInternacion = (this.filtroInternado) ? angular.copy(this.filtroInternado.Id) : 0;
			this.nuevoFiltroBusqueda.IdStockeable = (this.stockeable) ? this.stockeable.Id : 0;
			this.nuevoFiltroBusqueda.IdTipoStockeable = (this.stockeable) ? this.stockeable.IdTipoStockeable : 0;
			this.nuevoFiltroBusqueda.IdTipoMovimiento = (this.tipoMovimiento) ? this.tipoMovimiento.Id : 0;
			this.nuevoFiltroBusqueda.IdEstadoMovimiento = (this.estadoMovimiento) ? this.estadoMovimiento.Id : 0;
			this.nuevoFiltroBusqueda.CurrentPage = this.tableOption.CurrentPage;
			this.nuevoFiltroBusqueda.PageSize = this.tableOption.PageSize;
		}

		def.resolve(true);
		return def.promise;
	}

	limpiar() {
		delete this.deposito;
		delete this.sector;
		delete this.piso;
		delete this.listaDeMovimientos;
		delete this.filtroInternado;
	}

	getPage(pPagination) {
		if (pPagination) {
			this.tableOption.CurrentPage = pPagination.currentPage || 1;
			this.tableOption.PageSize = pPagination.pageSize || 10;
		} else {
			this.tableOption.CurrentPage = 1;
			this.tableOption.PageSize = 10;
		}
		// Guardo la pagina actual
		// vm.filter.currentPage = pPagination.currentPage;
		this.buscar();
	}

	// #endregion

	// #region /* ------------------------------------------ TABLE ------------------------------------------ */
	verDetalleItem(item) {
		this.$log.debug('verDetalleItem..', item);
		this.EnfermeriaLogicService.openDetalleMovimiento(item.row.Id, this.deposito.Id);
	}

	verAuditoriaItem(item) {
		this.$log.debug('verAuditoriaItem', item);
		// this.EnfermeriaLogicService.openAuditoriaMovimiento(item.row.Id, this.deposito.Id);
	}

	autorizarMovimiento(rowItem) {

		this.loading = true;
		this.MovimientosStockDataService.autorizarMovimiento(rowItem.row.Id)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if (pResult && pResult.IsOk) {

					this.AlertaService.NewSuccess("Movimiento Autorizado Correctamente");
					this.buscar();
				} else {
					if (pResult && pResult.Message) {
						this.AlertaService.NewWarning("Atención", pResult.Message);
					} else {
						this.AlertaService.NewWarning("Atención", "No se puede autorizar el movimiento");
					}
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});

	}

	cancelarMovimiento(rowItem) {
		this.loading = true;
		this.MovimientosStockDataService.cancelarMovimiento(rowItem.row.Id)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.AlertaService.NewSuccess("Movimiento Cancelado Correctamente");
				this.loading = false;
				this.buscar();
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;

			});
	}

	devolver(rowItem) {
		
		this.EnfermeriaLogicService.openDevolverParcialAsignacion(rowItem.row.Id)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.buscar();
		}, (pError) => {
			this.$log.error('pError',pError);
		});

	}

	imprimirRemito(row) {
		this.$log.debug('imrpmir Remito', row);
		this.EnfermeriaLogicService.openImprimirRemitoMovimientoStock(row.row.Id, this.deposito.Id);
	}


	ifAutorizarMovimiento(rowItem) {
		return rowItem.row.PuedeAutorizar;
	}

	ifCancelarMovimiento(rowItem) {
		return rowItem.row.PuedeCancelar;
	}

	ifDevolver(rowItem) {
		return rowItem.row.PuedeDevolver;
	}

	ifImprimirRemito(rowItem) {
		let ret = false;
		if (rowItem.row.TipoMovimiento.includes("Repo")) {
			ret = true
		}
		return ret;
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaListadoMovimientosStockController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaListadoMovimientosStockController');
		this.$log.debug('ON');
		this.loading = true;

		this.setRangoFecha();

		let _nuevoFiltro = this.MovimientoStockPisoDataService.obtenerNuevoFiltro();
		let _tiposMovimiento = this.TipoMovimientoStockDataService.obtenerTodosParaStockPorPisoParaListaMovimientos();
		let _estadosMovimientos = this.EstadoMovimientoStockDataService.getAll();


		this.$q.all([_nuevoFiltro, _tiposMovimiento, _estadosMovimientos])
			.then((pResponse) => {

				this.$log.debug('obtenerEnfermeriaListadoOk', pResponse);
				this.nuevoFiltroBusqueda = angular.copy(pResponse[0]);
				this.tipoMovimientosList = angular.copy(pResponse[1]);
				this.estadoMovimientoList = angular.copy(pResponse[2]);
				this.loading = false;

				// voy a ver si tengo varias sucursales o no
				// si tengo una sola por permiso general => la asigno
				// si tengo 2 sucursales 

				setTimeout(() => {
				this.infoUser = this.CredentialsDataService.GetForce();
					this.$log.debug('infoUser', this.infoUser);

					this.sucursalesList = angular.copy(this.infoUser.sucursales);
					if (this.sucursalesList && this.sucursalesList.length)
						this.sucursal = angular.copy(this.sucursalesList[0]);
				}, 300);


			}, (pNuevoFiltroError) => {

				this.$log.error('obtenerNuevoFiltroError', pNuevoFiltroError);
				this.loading = false;
			});
	}


	// #endregion
}