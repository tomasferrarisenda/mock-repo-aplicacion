/**
* @author: ppautasso
* @description: controller para indicaciones medicas listado
* @type: Controller
**/
import * as angular from 'angular';
import { IMovimientoStockIndicacionMedicaDataService, IModoEntregaMovimientoStockDataService, IEstadoMovimientoStockDataService } from '../../services';
import { IFiltroBusquedaMovimientoIndicacionMedicaDto } from '../../models';
import { ITipoMovimientoStockDataService } from '../../../enfermeria/services/movimientos';
import { IPrintZebraService } from 'integration/printZebra/services';
import { ICredentialsDataService } from 'core/security';

export class FarmaciaListadoIndicacionesMedicasController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	loading: boolean = false;
	// mas propiedades ..
	fechaDesde = new Date();
	fechaHasta = new Date();
	fechadesdeMin = new Date();
	sucursal;
	internado;
	numeroInternado;
	piso;
	sector;
	modosEntregaList;
	modoEntrega;
	tiposMovimientosList;
	tipoMovimiento;
	filtroBusquedaMovimientoIndicacionMedica: IFiltroBusquedaMovimientoIndicacionMedicaDto = {};
	listaMovimientos;

	estadoMovimientoList;
	estadoMovimiento;

	tableOption = {
		CurrentPage: 1,
		PageSize: 12
	};

	infoUser;
	sucursalesList;
	impresionZebraIf;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'ModalService', 'FarmaciaLogicService',
		'MovimientoStockIndicacionMedicaDataService', 'AlertaService', 'PrintZebraService',
		'moment', 'ModoEntregaMovimientoStockDataService', 'TipoMovimientoStockDataService',
		'CredentialsDataService', 'MovimientosStockDataService', 'EstadoMovimientoStockDataService'];
	/**
	* @class FarmaciaListadoIndicacionesMedicasController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private ModalService, private FarmaciaLogicService,
		private MovimientoStockIndicacionMedicaDataService: IMovimientoStockIndicacionMedicaDataService,
		private AlertaService: IAlertaService, private PrintZebraService: IPrintZebraService,
		private moment, private ModoEntregaMovimientoStockDataService: IModoEntregaMovimientoStockDataService,
		private TipoMovimientoStockDataService: ITipoMovimientoStockDataService,
		private CredentialsDataService: ICredentialsDataService, private MovimientosStockDataService,
		private EstadoMovimientoStockDataService:IEstadoMovimientoStockDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar() {

		if ((this.sector && this.sector.Id) || (this.internado && this.internado.Id)) {

			this.loading = true;

			let _fechaDesde = this.moment(this.fechaDesde).format("MM-DD-YYYY");
			let _fechaHasta = this.moment(this.fechaHasta).format("MM-DD-YYYY");

			this.filtroBusquedaMovimientoIndicacionMedica.FechaDesde = _fechaDesde;
			this.filtroBusquedaMovimientoIndicacionMedica.FechaHasta = _fechaHasta;

			this.filtroBusquedaMovimientoIndicacionMedica.IdInternacion = (this.internado) ? this.internado.Id : 0;
			this.filtroBusquedaMovimientoIndicacionMedica.IdModoEntrega = (this.modoEntrega) ? this.modoEntrega.Id : 0;
			this.filtroBusquedaMovimientoIndicacionMedica.IdSectorInternacion = (this.sector) ? this.sector.Id : 0;
			this.filtroBusquedaMovimientoIndicacionMedica.IdTipoMovimiento = (this.tipoMovimiento) ? this.tipoMovimiento.Id : 0
			this.filtroBusquedaMovimientoIndicacionMedica.IdEstadoMovimiento = (this.estadoMovimiento) ? this.estadoMovimiento.Id : 0;

			this.filtroBusquedaMovimientoIndicacionMedica.CurrentPage = this.tableOption.CurrentPage;
			this.filtroBusquedaMovimientoIndicacionMedica.PageSize = this.tableOption.PageSize;

			this.MovimientoStockIndicacionMedicaDataService.obtenerPorFiltros(this.filtroBusquedaMovimientoIndicacionMedica)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					if (pResult && pResult.Rows && pResult.Rows.length)
						this.listaMovimientos = pResult;
					else {
						this.AlertaService.NewWarning("Busqueda sin resultados");
						delete this.listaMovimientos;
					}
					this.loading = false;
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
		} else {
			this.AlertaService.NewWarning("Atención", "Debe seleccionar un Sector o un Internado para buscar");
		}
	}


	limpiar() {
		delete this.sucursal;
		delete this.piso;
		delete this.sector;
		delete this.tipoMovimiento;

		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
		this.fechadesdeMin = new Date();
		this.fechaDesde.setDate(this.fechaHasta.getDate() - 3);
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);

		delete this.internado;
		delete this.numeroInternado;
		delete this.modoEntrega;
		delete this.listaMovimientos;

	}

	verDetalleItem(row) {
		this.$log.debug('verDetalleItem', row);
		this.FarmaciaLogicService.openVerDetalleMovimientoFarmacia(row.Id);
	}

	imprimirRemito(row) {
		this.$log.debug('imprimirRemito', row);
		this.imprimirRemitoDeEntrega(row.Id);
	}

	imprimirInforme(row) {
		this.$log.debug('imprimirInforme', row);
		this.imprimirInformePorInternado(row.Id);
	}

	imprimirZebra(internadoNumero, internado, habitacion, cama, dni, cantidad) {
		var def = this.$q.defer();
		/**
		 * PQ -> cantidad de copias ejemplo: PQ3 imprime 3 copias
		 */
		this.$log.debug('voy a imprmiir internado sticker', internado);

		this.PrintZebraService.sendData(
			"CT~~CD,~CC^~CT~" +
			"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ" +
			"^XA" +
			"^MMT" +
			"^PW400" +
			"^LL0200" +
			"^LS0" +
			"^FT130,27^A0I,28,28^FH\^FDCama: " + cama + "^FS" +
			"^FT384,28^A0I,28,28^FH\^FDHab: " + habitacion + "^FS" +
			"^FT385,74^A0I,28,28^FH\^FDNum Int: " + internadoNumero +"^FS" +
			"^FT386,115^A0I,28,28^FH\^FD" + dni +"^FS" +
			"^FT386,155^A0I,28,28^FH\^FD" + internado +"^FS" +
			"^PQ" + cantidad +",0,1,Y^XZ" 
		)
			.then((pResultSendData) => {
				this.$log.debug('pResultSendData', pResultSendData);
				def.resolve(true);
			}, (pError) => {
				this.$log.error('Error al imprimir', pError);
				this.$log.debug('tuve un error al imprimir, voy a intentar una vez mas');
				// no pude imprimir voy a internarlo una vez mas
				this.PrintZebraService.sendData(
					"CT~~CD,~CC^~CT~" +
					"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ" +
					"^XA" +
					"^MMT" +
					"^PW400" +
					"^LL0200" +
					"^LS0" +
					"^FT130,27^A0I,28,28^FH\^FDCama: " + cama + "^FS" +
					"^FT384,28^A0I,28,28^FH\^FDHab: " + habitacion + "^FS" +
					"^FT385,74^A0I,28,28^FH\^FDNum Int: " + internadoNumero +"^FS" +
					"^FT386,115^A0I,28,28^FH\^FD" + dni +"^FS" +
					"^FT386,155^A0I,28,28^FH\^FD" + internado +"^FS" +
					"^PQ" + cantidad +",0,1,Y^XZ" 
				).then((pResultOneMore) => {
					this.$log.debug('pResultOneMore', pResultOneMore);
					def.resolve(true);
				}, (pError2) => {
					this.$log.error('pError2', pError2);
					def.reject(pError2);
				});
			});
		return def.promise;
	}


	imprimirStickersPorMovimiento(row) {
		var def = this.$q.defer();

		if (row.Id != 0) {
			this.loading = true;
			this.MovimientoStockIndicacionMedicaDataService.obtenerDetalleEntregaMovimiento(row.Id)
				.then((pResult) => {
					this.$log.debug('obtenerDetalleEntregaMovimiento', pResult);

					// voy a preguntar cuantos stickers por internado voy a imprimir
					let optionsEdit: IInputEditModalOptions = {};
					optionsEdit.tituloModal = "Ingrese cantidad de stickers a imprimir por internado";
					optionsEdit.objetoAEditarLabel = "Value Actual";
					optionsEdit.objetoAEditarValue = 5;
					optionsEdit.objetoAEditarDisabled = true;
					optionsEdit.labelNuevoInput = "Cantidad";
					optionsEdit.showObjetoAEditar = false;
					this.ModalService.openEditInputGenerico(optionsEdit)
						.then((pResultInputGenerico) => {
							this.$log.debug("pResultInputGenerico", pResultInputGenerico);

							this.loading = false;
							this.imprimirStickersPorInternado(pResult, pResultInputGenerico)
								.then((pResultimprimirStickersPorInternado) => {
									this.$log.debug('pResultimprimirStickersPorInternado', pResultimprimirStickersPorInternado);
									def.resolve(true);
									this.loading = false;
								}, (pErrorimprimirStickersPorInternado) => {
									this.$log.error('pErrorimprimirStickersPorInternado', pErrorimprimirStickersPorInternado);
									def.resolve(true);
									this.loading = false;
								});

						}, (pError) => {
							this.$log.error("pError", pError);
							this.loading = false;
						});


				}, (pError) => {
					this.$log.error('pErrorobtenerRemito', pError);
					this.loading = false;
				});
		}

		return def.promise;
	}

	imprimirStickersPorInternado(data, cantidad) {
		var def = this.$q.defer();
		var chain = this.$q.when();
		data.DetalleInternaciones.forEach((internado, index, array) => {
			chain = chain.then(() => {
				return this.imprimirZebra(internado.NumeroInternado.toString(), internado.ApellidoPaciente + ", " + internado.NombrePaciente, internado.Habitacion,
					internado.Cama, internado.TipoDocumento + ": " + internado.NumeroDocumento, cantidad);
			});

			// tenemos que consultar si es el ultimo elemento para dar aviso a la siguiente instruccion de impresion
			if (index === array.length - 1) {
				def.resolve(true);
			}
		});

		return def.promise;
	}

	imprimirInformePorInternado(idMovimiento) {
		var def = this.$q.defer();
		// tenemos una entrega correcta tenemos que imprimir los informes por internado
		if (idMovimiento != 0) {
			this.loading = true;
			this.MovimientoStockIndicacionMedicaDataService.obtenerDetalleEntregaMovimiento(idMovimiento)
				.then((pResult) => {
					this.$log.debug('pResultObtenerDetalleEntregaMovimiento', pResult);
					this.loading = false;
					this.FarmaciaLogicService.imprimirInformesPorInternado(pResult)
						.then((pResultImprimirInformePorInternado) => {
							this.$log.debug('pResultImprimirInformePorInternado', pResultImprimirInformePorInternado);
							def.resolve(true);
						}, (pErrorImprimirInformePorInternado) => {
							this.$log.error('pErrorImprimirInformePorInternado', pErrorImprimirInformePorInternado);
							def.resolve(true);
						});
				}, (pError) => {
					this.$log.error('pErrorobtenerRemito', pError);
					this.loading = false;
				});
		}

		return def.promise;
	}

	imprimirRemitoDeEntrega(idMovimiento) {
		var def = this.$q.defer();
		// tenemos una entrega correcta tenemos que imprimir los remito de la entrega
		if (idMovimiento != 0) {
			this.loading = true;
			this.MovimientoStockIndicacionMedicaDataService.obtenerRemito(idMovimiento)
				.then((pResult) => {
					this.$log.debug('pResultobtenerRemito', pResult);
					this.loading = false;
					this.FarmaciaLogicService.imprimirRemitoEntregaProductos(pResult)
						.then((pResultImprimirRemito) => {
							this.$log.debug('pResultImprimirRemito', pResultImprimirRemito);
							def.resolve(true);
						}, (pErrorImprimirRemito) => {
							this.$log.error('pErrorImprimirRemito', pErrorImprimirRemito);
							def.resolve(true);
						});
				}, (pError) => {
					this.$log.error('pErrorobtenerRemito', pError);
					this.loading = false;
				});
		}

		return def.promise;
	}

	autorizarMovimiento(row) {

		this.loading = true;
		this.MovimientosStockDataService.autorizarMovimiento(row.Id)
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

	cancelarMovimiento(row) {

		this.loading = true;
		this.MovimientosStockDataService.cancelarMovimiento(row.Id)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if (pResult && pResult.IsOk) {

					this.AlertaService.NewSuccess("Movimiento Cancelar Correctamente");
					this.buscar();
				} else {
					if (pResult && pResult.Message) {
						this.AlertaService.NewWarning("Atención", pResult.Message);
					} else {
						this.AlertaService.NewWarning("Atención", "No se puede cancelar el movimiento");
					}
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}
	// #endregion

	// #region /* ----------------------------------------- SUPPORT ----------------------------------------- */
	changeFechaDesde() {
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
	}

	esUnaEntrega(row) {
		let ret = false;
		if (row.row) {
			if (row.row.IdTipoMovimiento == 5) {
				ret = true;
			}
		}
		return ret;
	}


		/**
		 * Busca por cambio de pagina o tamaño de pagina
		 * @param  {Pagination} pPagination
		 */
		getPage(pPagination) {
			if (pPagination) {
				this.tableOption.CurrentPage = pPagination.currentPage || 1;
				this.tableOption.PageSize = pPagination.pageSize || 12;
			} else {
				this.tableOption.CurrentPage = 1;
				this.tableOption.PageSize = 12;
			}
			// Guardo la pagina actual
			this.buscar()
		}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaListadoIndicacionesMedicasController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaListadoIndicacionesMedicasController');
		this.$log.debug('ON');

		this.loading = true;

		this.fechaDesde.setDate(this.fechaHasta.getDate() - 3);
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);

		let _obtenerNuevoFiltro = this.MovimientoStockIndicacionMedicaDataService.obtenerNuevoFiltro();
		let _modosEntregaList = this.ModoEntregaMovimientoStockDataService.getAll();
		let _tiposMovimientosIndicaciones = this.TipoMovimientoStockDataService.obtenerTodosParaIndicacionesMedica();
		let _estadosMovimientos = this.EstadoMovimientoStockDataService.getAll();


		this.$q.all([
			_obtenerNuevoFiltro,
			_modosEntregaList,
			_tiposMovimientosIndicaciones,
			_estadosMovimientos
		])

			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.filtroBusquedaMovimientoIndicacionMedica = pResult[0];
				this.modosEntregaList = pResult[1];
				this.tiposMovimientosList = pResult[2];
				this.estadoMovimientoList = pResult[3];

				// inicializando zebra
				this.PrintZebraService.setupWebPrint();
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

			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}
	// #endregion
}