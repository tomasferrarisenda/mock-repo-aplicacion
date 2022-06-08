/**
* @author: ppautasso
* @description: controller para asignacion de stock a enfermeria
* @type: Controller
**/
import * as angular from 'angular';
import { IDepositoDataService, IEnfermeriaLogicService } from '../../services';
import { IMovimientoStockPisoDataService, ITipoMovimientoStockDataService } from '../../services/movimientos';
import { MovimientoStockPisoAsignacionEdit, MovimientoStockPisoDetalleEdit, MovimientoStockPisoEditBase } from '../../models'
import { ICredentialsDataService } from 'core/security';

export class EnfermeriaAsignacionController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

	// movimientos nuevos
	nuevoMovimientoAjuste: MovimientoStockPisoEditBase = {};
	nuevoMovimientoAsignacion: MovimientoStockPisoAsignacionEdit = {};
	nuevoMovimientoScrap: MovimientoStockPisoEditBase = {};
	nuevoMovimientoReposicion: MovimientoStockPisoEditBase = {};
	nuevoMovimientoDevolucion: MovimientoStockPisoEditBase = {};
	nuevoItemMovimiento: MovimientoStockPisoDetalleEdit = {};

	ProductosDetalleConCantidad: Array<MovimientoStockPisoDetalleEdit> = [];

	// mas propiedades ..


	private _piso: any;
	public get piso(): any {
		return this._piso;
	}
	public set piso(v: any) {
		this._piso = v;
		this.limpiarDatosBusqueda();
	}


	private _sector: any;
	public get sector(): any {
		return this._sector;
	}
	public set sector(v: any) {
		this._sector = v;
		this.limpiarDatosBusqueda();
	}


	private _deposito: any;
	public get deposito(): any {
		return this._deposito;
	}
	public set deposito(v: any) {
		this._deposito = v;
		this.limpiarDatosBusqueda();
	}

	get sucursal() {
		return this.sucursalValue;
	}
	set sucursal(value) {
		this.sucursalValue = value;
		if (this.productosPorDeposito && this.productosPorDeposito.length)
			this.productosPorDeposito = [];
	}
	sucursalesList;
	infoUser;

	stockeable;
	internado;
	numeroInternado;
	observacion;

	sucursalValue: any;
	productosSeleccionados: any;


	buscadorGeneralInternado: boolean = false;
	loading: boolean = false;;
	optionSeleccionar;
	tituloAccion: any;
	opcionSeleccionada: any = 0;
	productosPorDeposito;

	//boolean para no habilitar el multiple click para guarda
	saveDisabled: boolean = false;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'DepositoDataService', 'ModalService',
		'MovimientoStockPisoDataService', 'AlertaService', 'CredentialsDataService',
		'TipoMovimientoStockDataService', 'EnfermeriaLogicService'];
	/**
	* @class EnfermeriaAsignacionController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private DepositoDataService: IDepositoDataService,
		private ModalService: IModalService,
		private MovimientoStockPisoDataService: IMovimientoStockPisoDataService, private AlertaService: IAlertaService,
		private CredentialsDataService: ICredentialsDataService,
		private TipoMovimientoStockDataService: ITipoMovimientoStockDataService,
		private EnfermeriaLogicService: IEnfermeriaLogicService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	limpiar() {
		this.opcionSeleccionada = 0;
		this.tituloAccion = '';
		delete this.internado;
		delete this.observacion;
		delete this.productosSeleccionados;
		delete this.productosPorDeposito;
		delete this.deposito;
		delete this.sector;
		delete this.piso;
		delete this.sucursalValue;
	}

	buscar() {

		if (this.deposito) {
			this.loading = true;
			this.DepositoDataService.obtenerStockDelDeposito(this.deposito.Id)
				.then((pResponse) => {
					this.$log.debug('obtenerStockDelDepositoOk', pResponse);
					this.productosPorDeposito = angular.copy(pResponse);
					this.setData();
					this.loading = false;
				}, (pError) => {
					this.$log.error('obtenerStockDelDepositoError', pError);
					this.loading = false;
				});
		} else {
			this.AlertaService.NewWarning("Debe seleccionar un deposito");
		}
	}

	setData() {
		angular.forEach(this.productosPorDeposito, (producto) => {
			producto.cantidadAgregar = 0;
		});
	}

	seleccionar(productosList) {
		this.$log.debug('productosList', productosList);
		// limpio internado y observacion
		delete this.internado;
		delete this.observacion;
		// ahora selecciono producto
		this.productosSeleccionados = angular.copy(productosList.filter(x => x.selected));

		this.$log.debug('productosSeleccionados', this.productosSeleccionados);

		this.ModalService.selectOptionModal(this.optionSeleccionar)
			.then((pResult) => {
				this.opcionSeleccionadaOk(pResult);
			});
	}

	guardar() {
		// guardamos la accion en stock
		this.$log.debug('guardar movimiento nuevo');

		if (this.productosSeleccionados.find(x => x.cantidadAgregar === 0)) {
			if (this.opcionSeleccionada === 6) this.validarGuardarOpcion();
			else
				this.AlertaService.NewWarning("Atención", "Tiene productos con cantidad 0, elimine el producto o asigne cantidad");
		} else {
			this.validarGuardarOpcion();
		}
	}

	validarGuardarOpcion() {
		this.setearProductosDetalle();
		switch (this.opcionSeleccionada) {
			case 1:

				// opcion REPOSICION
				this.loading = true;
				this.realizarReposicion();
				break;
			case 3:
				// opcion ASIGNAR A INTERNADO SELECCIONADA
				if (!this.internado) {
					this.AlertaService.NewWarning("Atención", "Falta seleccionar el internado para asignar");
				} else {
					this.loading = true;
					this.realizarAsignacion();
				}
				break;
			case 4:
				// opcion SCRAP SELECCIONADA
				this.loading = true;
				this.realizarScrap();
				break;
			case 6:
				// opcion AJUSTE STOCK
				this.loading = true;
				this.realizarAjuste();
				break;
			case 10:
				// opcion DEVOLUCION A FI
				this.loading = true;
				this.realizarDevolucionAFarmaciaInterna();
				break;
		}
	}

	disabledSave(){
		this.saveDisabled = true;
		setTimeout(() => {
			this.saveDisabled = false;
			}, 1000);
	}


	realizarAsignacion() {

		this.nuevoMovimientoAsignacion.IdSucursal = angular.copy(this.sucursal.Id);
		this.nuevoMovimientoAsignacion.IdSectorInternacion = angular.copy(this.sector.Id);
		this.nuevoMovimientoAsignacion.IdDeposito = angular.copy(this.deposito.Id);
		this.nuevoMovimientoAsignacion.IdInternacion = angular.copy(this.internado.Id);
		this.nuevoMovimientoAsignacion.Items = angular.copy(this.ProductosDetalleConCantidad);
		// voy a consultar si tenemos una observacion
		if (this.observacion) {
			this.nuevoMovimientoAsignacion.Observacion = angular.copy(this.observacion);
			this.asignacionGuardarOk();
		} else {
			if (this.nuevoMovimientoAsignacion.RequiereObservacion) {
				if (this.observacion) {

					this.nuevoMovimientoAsignacion.Observacion = angular.copy(this.observacion);
					this.asignacionGuardarOk();
				}
				else {
					this.AlertaService.NewWarning("Se requiere una observación");
					this.loading = false;
					return;
				}

			} else {
				this.nuevoMovimientoAsignacion.Observacion = "";
				this.asignacionGuardarOk();
			}
		}

	}
	asignacionGuardarOk() {

		this.MovimientoStockPisoDataService.realizarAsignacion(this.nuevoMovimientoAsignacion)
			.then((pResult) => {
				this.$log.debug('realizarAsignacionOk', pResult);
				this.loading = false;
				if (pResult.IsOk) {
					this.AlertaService.NewSuccess("Asignación correcta");
					this.limpiarBusqueda();
				}else {
					if(pResult.Message)
					this.AlertaService.NewWarning(pResult.Message);
				}
			}, (pError) => {
				this.$log.error('realizarAsignacionError', pError);
				this.loading = false;
			});
	}




	realizarScrap() {

		this.nuevoMovimientoScrap.IdSucursal = angular.copy(this.sucursal.Id);
		this.nuevoMovimientoScrap.IdSectorInternacion = angular.copy(this.sector.Id);
		this.nuevoMovimientoScrap.IdDeposito = angular.copy(this.deposito.Id);
		this.nuevoMovimientoScrap.Items = angular.copy(this.ProductosDetalleConCantidad);

		// consulto si tengo observacion
		if (this.observacion) {
			this.nuevoMovimientoScrap.Observacion = angular.copy(this.observacion);
			this.scrapGuardarOk();
		} else {
			if (this.nuevoMovimientoScrap.RequiereObservacion) {
				if (this.observacion) {
					this.nuevoMovimientoScrap.Observacion = angular.copy(this.observacion);
					this.scrapGuardarOk();
				} else {
					this.AlertaService.NewWarning("Se requiere una observación");
					this.loading = false;
					return;
				}
			} else {
				this.nuevoMovimientoScrap.Observacion = "";
				this.scrapGuardarOk();
			}
		}


	}
	scrapGuardarOk() {

		this.MovimientoStockPisoDataService.realizarScrap(this.nuevoMovimientoScrap)
			.then((pResult) => {
				this.$log.debug('realizarScrapOk', pResult);
				this.loading = false;
				if (pResult.IsOk) {
					this.AlertaService.NewSuccess("Nuevo Scrap correcto");
					this.limpiarBusqueda();
				}
			}, (pError) => {
				this.$log.error('realizarScrapError', pError);
				this.loading = false;
			});
	}




	realizarReposicion() {

		this.nuevoMovimientoReposicion.IdSucursal = angular.copy(this.sucursal.Id);
		this.nuevoMovimientoReposicion.IdSectorInternacion = angular.copy(this.sector.Id);
		this.nuevoMovimientoReposicion.IdDeposito = angular.copy(this.deposito.Id);
		this.nuevoMovimientoReposicion.Items = angular.copy(this.ProductosDetalleConCantidad);
		if (this.observacion) {
			this.nuevoMovimientoReposicion.Observacion = angular.copy(this.observacion);
			this.reposicionGuardarOk();
		} else {
			if (this.nuevoMovimientoReposicion.RequiereObservacion) {
				if (this.observacion) {
					this.nuevoMovimientoReposicion.Observacion = angular.copy(this.observacion);
					this.reposicionGuardarOk();
				} else {
					this.AlertaService.NewWarning("Se requiere una observación");
					this.loading = false;
					return;
				}
			} else {
				this.nuevoMovimientoReposicion.Observacion = "";
				this.reposicionGuardarOk();
			}
		}

	}
	reposicionGuardarOk() {

		this.MovimientoStockPisoDataService.realizarReposicion(this.nuevoMovimientoReposicion)
			.then((pResult) => {
				this.$log.debug('realizarReposicionOk', pResult);
				this.loading = false;
				if (pResult.IsOk) {
					// this.AlertaService.NewSuccess("Nueva Reposición correcta");
					this.imprimirRemito(pResult.IdMovimiento);
					this.limpiarBusqueda();
					// realize una reposicion -> tengo que preguntar si quiere imprimir el remito del movimiento

				}
			}, (pError) => {
				this.$log.error('realizarReposicionError', pError);
				this.loading = false;
			});
	}



	realizarAjuste() {

		this.nuevoMovimientoAjuste.IdSucursal = angular.copy(this.sucursal.Id);
		this.nuevoMovimientoAjuste.IdSectorInternacion = angular.copy(this.sector.Id);
		this.nuevoMovimientoAjuste.IdDeposito = angular.copy(this.deposito.Id);
		this.nuevoMovimientoAjuste.Items = angular.copy(this.ProductosDetalleConCantidad);
		// voy a ver si tenemos observacion para guardar
		if (this.observacion) {
			this.nuevoMovimientoAjuste.Observacion = angular.copy(this.observacion);
			this.ajusteGuardarOk();
		} else {
			// no tengo observacion -> pregunto si es obligatoria
			if (this.nuevoMovimientoAjuste.RequiereObservacion) {
				if (this.observacion) {
					this.nuevoMovimientoAjuste.Observacion = angular.copy(this.observacion);
					this.ajusteGuardarOk();
				} else {
					this.AlertaService.NewWarning("Se requiere una observación");
					this.loading = false;
					return;
				}
			} else { // la observacion no es obligatoria entonces guardo
				this.nuevoMovimientoAjuste.Observacion = "";
				this.ajusteGuardarOk();
			}
		}
	}
	ajusteGuardarOk() {

		this.MovimientoStockPisoDataService.realizarAjuste(this.nuevoMovimientoAjuste)
			.then((pResult) => {
				this.$log.debug('realizarAjusteOk', pResult);
				this.loading = false;
				if (pResult.IsOk) {
					this.AlertaService.NewSuccess("Nueva Ajuste Correcto");
					this.limpiarBusqueda();
				}
			}, (pError) => {
				this.$log.error('realizarAjusteError', pError);
				this.loading = false;
			});
	}



	realizarDevolucionAFarmaciaInterna() {

		this.nuevoMovimientoDevolucion.IdSucursal = angular.copy(this.sucursal.Id);
		this.nuevoMovimientoDevolucion.IdSectorInternacion = angular.copy(this.sector.Id);
		this.nuevoMovimientoDevolucion.IdDeposito = angular.copy(this.deposito.Id);
		this.nuevoMovimientoDevolucion.Items = angular.copy(this.ProductosDetalleConCantidad);

		// consulto si tengo observacion
		if (this.observacion) {
			// tengo observacion entonces guardo
			this.nuevoMovimientoDevolucion.Observacion = angular.copy(this.observacion);
			this.devolucionFIGuardarOk();
		} else {
			if (this.nuevoMovimientoDevolucion.RequiereObservacion) {
				if (this.observacion) {
					this.nuevoMovimientoDevolucion.Observacion = angular.copy(this.observacion);
					this.devolucionFIGuardarOk();
				} else {
					this.AlertaService.NewWarning("Se requiere una observación");
					this.loading = false;
					return;
				}
			} else {
				this.nuevoMovimientoDevolucion.Observacion = "";
				this.devolucionFIGuardarOk();
			}
		}

	}
	devolucionFIGuardarOk() {

		this.MovimientoStockPisoDataService.realizarDevolucionAFI(this.nuevoMovimientoDevolucion)
			.then((pResult) => {
				this.$log.debug('realizarDevolucionOK', pResult);
				this.loading = false;
				if (pResult.IsOk) {
					this.AlertaService.NewSuccess("Nueva Devolución correcta");
					this.limpiarBusqueda();
				}
			}, (pError) => {
				this.$log.error('realizarDevolucionError', pError);
				this.loading = false;
			});
	}
	// #endregion

	// #region /* ----------------------------------------- SUPPORT ----------------------------------------- */

	imprimirRemito(idMovimiento) {

		var optionsObj = {
			ok: 'Si',
			cancel: 'No'
		};

		this.ModalService.confirm("Movimiento Cargado. ¿Desea imprimir el remito ahora?",
			(_pOk) => {
				if (_pOk) {

					// tengo el ok del usuario, voy a imprimri el remito
					this.EnfermeriaLogicService.openImprimirRemitoMovimientoStock(idMovimiento, this.deposito.Id);

				};
			}, "", optionsObj);
	}

	opcionSeleccionadaOk(resultado) {
		//selecciono la opcion para mostrar tipo de intencion
		this.opcionSeleccionada = angular.copy(resultado.id);
		this.$log.debug('OpcionElegida..', resultado.label);
		this.tituloAccion = resultado.label;

		if (this.opcionSeleccionada === 1) {
			// tenemos seleccionada una reposicion, por lo que vamos a setear los valores 
			// de cantidad en la diferencia entre stock normal y stock actual
			angular.forEach(this.productosSeleccionados, (producto) => {
				if (producto.StockActual > producto.StockNormal) {
					// voy a hacer una reposicion, 
					producto.cantidadAgregar = 0;
				}else {
					producto.cantidadAgregar = producto.StockNormal - producto.StockActual;
				}
			});
		}else if(this.opcionSeleccionada === 3 || this.opcionSeleccionada === 4){
			// tenemos seleccionado una ASIGNACION o un SCRAP seteamos en 1 el valor de cantidad
			angular.forEach(this.productosSeleccionados, (producto) => {
				producto.cantidadAgregar = 1;
			}); 
		}else if(this.opcionSeleccionada === 6){
			// tenemos seleccionado un ajuste para, vamos a setear los valores de cantidad
			angular.forEach(this.productosSeleccionados, (producto) => {
				producto.cantidadAgregar = angular.copy(producto.StockActual);
			}); 
		}

	}

	setearProductosDetalle() {

		this.ProductosDetalleConCantidad.length = 0;

		angular.forEach(this.productosSeleccionados, (producto) => {
			let _producto = angular.copy(this.nuevoItemMovimiento);

			_producto.Cantidad = producto.cantidadAgregar;
			_producto.IdTipoStockeable = producto.IdTipoStockeable;
			_producto.IdStockeable = producto.IdStockeable;

			this.ProductosDetalleConCantidad.push(_producto);
		})

	}

	limpiarBusqueda() {
		delete this.productosPorDeposito;
		this.opcionSeleccionada = 0;
		this.tituloAccion = '';
		delete this.internado;
		delete this.productosSeleccionados;
		delete this.observacion;
		delete this.numeroInternado;
		this.buscadorGeneralInternado = false;
		this.buscar();
	}

	limpiarDatosBusqueda() {
		if (this.productosPorDeposito && this.productosPorDeposito.length)
			this.productosPorDeposito = [];
		this.opcionSeleccionada = 0;
		this.observacion = "";
	}

	openReportes() {
		if (this.deposito) {

			let options: Array<any> = [];
			options.push({ id: 1, label: "Exportar Pdf del Stock Del Deposito" },
				{ id: 2, label: "Exportar Pdf del Stock A Reponer" });
			this.ModalService.selectOptionModal(options)
				.then((opcionElegida) => {
					if (opcionElegida.id === 1) this.DepositoDataService.exportarPdfStockDelDeposito(this.deposito);
					else if (opcionElegida.id === 2) this.DepositoDataService.exportarPdfStockAReponer(this.deposito);
				});
		} else this.AlertaService.NewWarning("Atención", "Debe elegir un deposito para obtener un reporte");
	}

	agregarProductoExtra(producto) {
		this.productosSeleccionados.push(producto);
	}

	// #endregion


	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaAsignacionController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaAsignacionController');
		this.$log.debug('ON');

		this.loading = true;
		// llamadas de obtener items
		let _obtenerNuevoMovimientoAjuste = this.MovimientoStockPisoDataService.obtenerNuevoMovimientoParaAjuste();
		let _obtenerNuevoMovimientoAsignacion = this.MovimientoStockPisoDataService.obtenerNuevoMovimientoParaAsignacion();
		let _obtenerNuevoMovimientoScrap = this.MovimientoStockPisoDataService.obtenerNuevoMovimientoParaScrap();
		let _obtenerNuevoMovimientoReposicion = this.MovimientoStockPisoDataService.obtenerNuevoMovimientoParaReposicion();
		let _obtenerNuevoMovimientoDevolucion = this.MovimientoStockPisoDataService.obtenerNuevoMovimientoParaDevolucionFI();
		// obtencion del nuevo item de producto
		let _obtenerNuevoItemMovimiento = this.MovimientoStockPisoDataService.obtenerNuevoItemMovimiento();

		//obtencion de acciones por permiso
		let _obtenerTipoMovimientoPorUsuario = this.TipoMovimientoStockDataService.obtenerTodosParaStockPorPisoPorUsuarioActual();

		this.$q.all([_obtenerNuevoMovimientoAjuste, _obtenerNuevoMovimientoAsignacion, _obtenerNuevoMovimientoScrap,
			_obtenerNuevoMovimientoReposicion, _obtenerNuevoItemMovimiento, _obtenerTipoMovimientoPorUsuario, _obtenerNuevoMovimientoDevolucion])
			.then((pResponseOk) => {
				this.loading = false;
				this.$log.debug('obtenerNuevosOk', pResponseOk);

				this.nuevoMovimientoAjuste = pResponseOk[0];
				this.nuevoMovimientoAsignacion = pResponseOk[1];
				this.nuevoMovimientoScrap = pResponseOk[2];
				this.nuevoMovimientoReposicion = pResponseOk[3];
				this.nuevoMovimientoDevolucion = pResponseOk[6];
				this.nuevoItemMovimiento = pResponseOk[4];

				let _options = angular.copy(pResponseOk[5]);

				angular.forEach(_options, (opcion) => {
					opcion.id = angular.copy(opcion.Id);
					opcion.label = angular.copy(opcion.Nombre);
				});

				this.optionSeleccionar = angular.copy(_options);

				// voy a ver si tengo varias sucursales o no
				// si tengo una sola por permiso general => la asigno
				// si tengo 2 sucursales 

				this.infoUser = this.CredentialsDataService.GetForce();
				this.$log.debug('infoUser', this.infoUser);

				this.sucursalesList = angular.copy(this.infoUser.sucursales);
				if (this.sucursalesList && this.sucursalesList.length)
					this.sucursal = angular.copy(this.sucursalesList[0]);

			}, (pError) => {
				this.loading = false;
				this.$log.error('obtenerNuevosError', pError);
			});
	}
	// #endregion
}