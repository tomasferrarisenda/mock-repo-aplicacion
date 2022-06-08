/**
* @author: ppautasso
* @description: controller para modulo de validacion de indicaciones medicas
* @type: Controller
**/
import * as angular from 'angular';
import { IValidacionIndicacionMedicaDataService, IFarmaciaLogicService, ICambiarProductoIndicacionMedicaDataService } from '../../services';
import { IInternacionParaValidarDto } from '../../models/dto';
import { IIndicacionMedica } from '../../models';
import { IInternacionesDataService } from '../../../internacion/common/services';
import { IEnfermeriaCommonLogicService, ITipoStockeableDataService } from '../../../enfermeria/services';
import { ICredentialsDataService } from 'core/security';

export class FarmaciaValidacionIndicacionesMedicasController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..

	private _sucursal: any;
	public get sucursal(): any {
		return this._sucursal;
	}
	public set sucursal(v: any) {
		this._sucursal = v;
		if (v) {
			this.limpiarInternados();
			this.limpiarIndicaciones();
		}
	}

	private _piso: any;
	public get piso(): any {
		return this._piso;
	}
	public set piso(v: any) {
		this._piso = v;
		if (v) {
			this.limpiarInternados();
			this.limpiarIndicaciones();
		}
	}


	private _sector: any;
	public get sector(): any {
		return this._sector;
	}
	public set sector(v: any) {
		this._sector = v;
		// seteo sector
		if (v) {
			this.buscarInternadosPorDeposito();
			this.limpiarIndicaciones();
		}
		else {
			this.limpiarInternados();
			this.limpiarIndicaciones();
		}

	}

	estadosInternacion = [
		{
			nombre: "Con pendientes",
			color: "color-amarillo"
		},
		{
			nombre: "Con alta",
			color: "color-rojo"
		}
	];

	mostrarColorInternados: boolean = false;

	private _internadoId: any;
	public get internadoId(): any {
		return this._internadoId;
	}
	public set internadoId(v: any) {
		this._internadoId = v;
		if (v) {
			// tengo internado id
			this.internado = this.internaciones.find(x => x.Id == parseInt(v, 10));
			this.buscarIndicacionesPorInternado();
		}
	}


	internado;
	loading: boolean = false;
	internaciones: Array<IInternacionParaValidarDto> = [];
	indicacionesMedicasPorInternado: Array<IIndicacionMedica> = [];


	infoUser;
	sucursalesList;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'SelectorService', '$q',
		'ValidacionIndicacionMedicaDataService',
		'AlertaService',
		'InternacionCommonLogicService',
		'InternacionesDataService',
		'FarmaciaLogicService',
		'CambiarProductoIndicacionMedicaDataService',
		'EnfermeriaCommonLogicService',
		'TipoStockeableDataService',
		'ModalService',
		'CredentialsDataService'];
	/**
	* @class FarmaciaValidacionIndicacionesMedicasController
	* @constructor
	*/
	constructor(private $log: ILogger, private SelectorService, private $q,
		private ValidacionIndicacionMedicaDataService: IValidacionIndicacionMedicaDataService,
		private AlertaService: IAlertaService,
		private InternacionCommonLogicService,
		private InternacionesDataService: IInternacionesDataService,
		private FarmaciaLogicService: IFarmaciaLogicService,
		private CambiarProductoIndicacionMedicaDataService: ICambiarProductoIndicacionMedicaDataService,
		private EnfermeriaCommonLogicService: IEnfermeriaCommonLogicService,
		private TipoStockeableDataService: ITipoStockeableDataService,
		private ModalService,
		private CredentialsDataService: ICredentialsDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscarInternadosPorDeposito() {
		// voy a buscar internados por deposito

		let def = this.$q.defer();

		if (this.sector) {
			this.loading = true;

			this.ValidacionIndicacionMedicaDataService.obtenerInternacionesPorSector(this.sector.Id)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					pResult.forEach(item => {
						if (item.TienePendientes) item.Color = 'color-amarillo-turno';
						if (item.PacienteConAlta) item.Color = 'color-rojo-turno';
					});

					this.internaciones = angular.copy(pResult);
					this.loading = false;
					def.resolve(true);
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
					def.reject(pError);
				});
		}

		return def.promise;
	}

	buscarIndicacionesPorInternado() {
		// voy a buscar indicaciones del internado
		if (this.internado) {
			this.loading = true;

			this.ValidacionIndicacionMedicaDataService.obtenerIndicacionesPorInternacion(this.internado.Id)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					this.indicacionesMedicasPorInternado = angular.copy(pResult);
					if (this.indicacionesMedicasPorInternado && this.indicacionesMedicasPorInternado.length == 0) {
						this.AlertaService.NewWarning("No hay indicaciones médicas para el internado seleccionado");
					}
					this.loading = false;
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
		}
	}


	entregarVentanilla() {
		this.FarmaciaLogicService.openEntregarProductosPorVentanilla(this.internado, this.sucursal)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.recargar();
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	entregar() {
		this.FarmaciaLogicService.openEntregarProductos(this.sucursal, this.piso, this.sector)
			.then((pResultEntregarProductos) => {
				this.$log.debug('pResultEntregarProductos', pResultEntregarProductos);
				this.recargar();
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	// #endregion

	// #region BOTONERA
	preparaIndicacion(indicacion) {
		this.FarmaciaLogicService.openPreparadoIndicacionMedica(indicacion.pObject, this.internado, this.sucursal)
			.then((resultPreparacion) => {
				this.$log.debug('resultPreparacion', resultPreparacion);
				if (resultPreparacion) this.buscarIndicacionesPorInternado();
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	cambiarProducto(indicacion) {
		this.$log.debug('cambiarProducto', indicacion.pObject);

		var _relacion: any = {};

		_relacion.pIdTipoConcepto = indicacion.pObject.IdTipoConcepto;
		_relacion.pIdConcepto = indicacion.pObject.Id;
		_relacion.pIdSucursal = this.sucursal.Id;

		this.SelectorService.newSelector({
			nombreSelector: 'Cambiar Producto: ' + indicacion.pObject.Producto.CodigoStockeable + " - " +
				indicacion.pObject.Producto.NombreStockeable + " - " + indicacion.pObject.Producto.PresentacionStockeable,
			dataService: 'CambiarProductoIndicacionMedicaDataService',
			method: 'obtenerProductosPosiblesParaCambiar',
			isTableBackEnd: false,
			columns: ['StockDrogueria', 'StockFarmacia', 'PresentacionStockeable', 'NombreStockeable', 'CodigoStockeable'],
			objCriterio: _relacion
		})
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if (pResult) {
					this.loading = true;
					this.CambiarProductoIndicacionMedicaDataService.cambiarProductoIndicacionMedica(indicacion.pObject.IdTipoConcepto, indicacion.pObject.Id, this.sucursal.Id,
						pResult.IdTipoStockeable, pResult.IdStockeable)
						.then((pResultCambiarProducto) => {
							this.$log.debug('pResultCambiarProducto', pResultCambiarProducto);

							this.AlertaService.NewSuccess("Cambio de Producto Realizado Correctamente");
							this.loading = false;
							this.buscarIndicacionesPorInternado();
						}, (pError) => {
							this.$log.error('pError', pError);
							this.loading = false;
						});
				}
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	cambiarProductoAgregado(agregado) {
		this.$log.debug('cambiarProducto', agregado.pObject);

		var _relacion: any = {};

		_relacion.pIdTipoConcepto = agregado.pObject.IdTipoConcepto;
		_relacion.pIdConcepto = agregado.pObject.Id;
		_relacion.pIdSucursal = this.sucursal.Id;

		this.SelectorService.newSelector({
			nombreSelector: 'Cambiar Producto: ' + agregado.pObject.Producto.CodigoStockeable + " - " +
				agregado.pObject.Producto.NombreStockeable + " - " + agregado.pObject.Producto.PresentacionStockeable,
			dataService: 'CambiarProductoIndicacionMedicaDataService',
			method: 'obtenerProductosPosiblesParaCambiar',
			isTableBackEnd: false,
			columns: ['StockDrogueria', 'StockFarmacia', 'PresentacionStockeable', 'NombreStockeable', 'CodigoStockeable'],
			objCriterio: _relacion
		})
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if (pResult) {
					this.loading = true;
					this.CambiarProductoIndicacionMedicaDataService.cambiarProductoIndicacionMedica(agregado.pObject.IdTipoConcepto, agregado.pObject.Id, this.sucursal.Id,
						pResult.IdTipoStockeable, pResult.IdStockeable)
						.then((pResultCambiarProducto) => {
							this.$log.debug('pResultCambiarProducto', pResultCambiarProducto);

							this.AlertaService.NewSuccess("Cambio de Producto Realizado Correctamente");
							this.loading = false;
							this.buscarIndicacionesPorInternado();
						}, (pError) => {
							this.$log.error('pError', pError);
							this.loading = false;
						});
				}
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	asignarProducto(indicacion) {
		this.$log.debug('asignarProducto', indicacion);
		this.loading = true;
		this.TipoStockeableDataService.obtenerTodos()
			.then((pResponse) => {

				this.$log.debug('TipoStockeableDataService obtenerTodosOK', pResponse);
				let tipoStockeable = Object.assign({}, pResponse[0]);

				this.EnfermeriaCommonLogicService.openBuscadorDeProductos(pResponse, tipoStockeable)
					.then((pProducto) => {
						this.$log.debug('productoSeleccionado', pProducto);
						if (pProducto) {
							this.ValidacionIndicacionMedicaDataService.asignarProductoAInfusion(indicacion.pObject.Id, this.sucursal.Id, pProducto.Id, pProducto.IdTipoStockeable)
								.then((pResultAsignarProductoAInfusion) => {
									this.$log.debug('pResultAsignarProductoAInfusion', pResultAsignarProductoAInfusion);
									this.AlertaService.NewSuccess("Producto Asignado a Infusión Correctamente");
									this.loading = false;
									this.buscarIndicacionesPorInternado();
								}, (pError) => {
									this.loading = false;
									this.$log.error('pError', pError);
								});
						}
					}, (pErrorProducto) => {
						this.$log.error('productoSeleccionadoError', pErrorProducto);
						this.loading = false;
					});

			}, (pError) => {
				this.$log.error('TipoStockeableDataService obtenerTodosError', pError);
				this.loading = false;
			})

	}

	desasignarProducto(indicacion) {
		this.$log.debug('desasignarProducto', indicacion);

		this.ModalService.confirm('¿Desea DESASIGNAR el producto asignado?',
			(pResult) => {
				if (pResult) {
					this.loading = true;
					this.ValidacionIndicacionMedicaDataService.desasignarProductoAInfusion(indicacion.pObject.Id, this.sucursal.Id)
						.then((desasignarResultOk) => {
							this.$log.debug('desasignarResultOk', desasignarResultOk);
							this.AlertaService.NewSuccess("Producto DESASIGNADO a Infusión Correctamente");
							this.loading = false;
							this.buscarIndicacionesPorInternado();
						}, (pError) => {
							this.$log.error('pError', pError);
							this.loading = false;
						});
				}
			});
	}

	eliminarDescartable(descartable) {
		this.$log.debug('eliminar descartable', descartable);

		this.ModalService.confirm('¿Desea DESASIGNAR el producto asignado?',
			(pResult) => {
				if (pResult) {
					this.loading = true;
					this.ValidacionIndicacionMedicaDataService.eliminarDescartable(descartable.Id, this.sucursal.Id)
						.then((eliminarDescartableOk) => {
							this.$log.debug('eliminarDescartableOk', eliminarDescartableOk);
							this.AlertaService.NewSuccess("Descartable Eliminado");
							this.loading = false;
							this.buscarIndicacionesPorInternado();
						}, (pError) => {
							this.$log.error('pError', pError);
							this.loading = false;
						});
				}

			});

	}

	// #endregion

	// #region SUPPORT
	limpiarInternados() {
		delete this.internaciones;
		this.internado = {};
	}

	limpiarIndicaciones() {
		delete this.indicacionesMedicasPorInternado;
	}

	informacionInternado() {
		if (this.internado) {

			this.loading = true;
			this.InternacionesDataService.obtenerInternadoPorNumeroInternacion(this.internado.NumeroInternado)
				.then((internadoResult) => {
					this.$log.debug('internadoResult', internadoResult);
					internadoResult.NombreYApellidoInternado = internadoResult.ApellidoPaciente + ', ' + internadoResult.NombrePaciente;
					internadoResult.DocumentoYTipoInternado = internadoResult.TipoDocumento + ': ' + internadoResult.NumeroDocumento;

					this.loading = false;
					this.InternacionCommonLogicService.openInfoBuscadorInternado(internadoResult);
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
		}
	}

	recargar() {
		this.buscarInternadosPorDeposito()
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if (pResult) {
					if (this.indicacionesMedicasPorInternado && this.indicacionesMedicasPorInternado.length) {
						this.buscarIndicacionesPorInternado();
					}
				}
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	infoEstados() {
		this.mostrarColorInternados = !this.mostrarColorInternados;
	}

	// #endregion


	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaValidacionIndicacionesMedicasController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaValidacionIndicacionesMedicasController');
		this.$log.debug('ON');

		// voy a ver si tengo varias sucursales o no
		// si tengo una sola por permiso general => la asigno
		// si tengo 2 sucursales 
		setTimeout(() => {
			this.infoUser = this.CredentialsDataService.GetForce();
			this.$log.debug('infoUser', this.infoUser);

			this.sucursalesList = angular.copy(this.infoUser.sucursales);
			if (this.sucursalesList && this.sucursalesList.length)
				this.sucursal = angular.copy(this.sucursalesList[0]);
		});


	}
	// #endregion
}