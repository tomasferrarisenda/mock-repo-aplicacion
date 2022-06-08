/**
* @author: ppautasso
* @description: 
* @type: Controller
**/
import * as angular from 'angular';
import { IEntregarIndicacionMedicaDataService, IModoEntregaMovimientoStockDataService, IMovimientoStockIndicacionMedicaDataService, IFarmaciaLogicService } from '../../services';
import { IEntregaFarmaciaDto, IInternacionConEntregaPendienteDto } from '../../models';
import { IPrintZebraService } from 'integration/printZebra/services';
import { IEntregaResultValidationDto } from '../../models/dto';

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}

export class FarmaciaEntregarProductosPorSectorModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	resolve;
	dismiss;
	close;
	loading: boolean = false;

	// mas propiedades ..
	sucursal;
	sector;
	piso;
	entregaPorSector: Array<IInternacionConEntregaPendienteDto> = [];
	entregaFarmacia: IEntregaFarmaciaDto = {};
	modosEntrega;
	modoEntrega;
	usuarioRetira;

	entregaResult: IEntregaResultValidationDto = {};

	seleccionarTodos;

	optionsObj = {
		ok: 'Si',
		cancel: 'No'
	};


	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'EntregarIndicacionMedicaDataService', 'FarmaciaLogicService',
		'ModoEntregaMovimientoStockDataService', 'ModalService', 'AlertaService', 'SecurityLogicService',
		'MovimientoStockIndicacionMedicaDataService', 'PrintZebraService'];
	/**
	* @class FarmaciaEntregarProductosPorSectorModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private EntregarIndicacionMedicaDataService: IEntregarIndicacionMedicaDataService,
		private FarmaciaLogicService: IFarmaciaLogicService, private ModoEntregaMovimientoStockDataService: IModoEntregaMovimientoStockDataService, private ModalService,
		private AlertaService: IAlertaService, private SecurityLogicService,
		private MovimientoStockIndicacionMedicaDataService: IMovimientoStockIndicacionMedicaDataService, private PrintZebraService: IPrintZebraService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose) {
		this.close({ $value: pClose });
	}


	guardar() {
		this.$log.debug('entregar productos', this.entregaPorSector);
		if (this.modoEntrega.RequiereUsuarioRecepta) {
			// requiero que el modo de entrega tenga un usuario
			if (this.usuarioRetira && this.usuarioRetira.Id) {
				// tengo todo voy a setear
				this.setDataYEntregar();
			} else {
				this.AlertaService.NewWarning("Atención", "El metodo de entrega seleccionado requiere que se defina un usuario a entregar");
			}
		} else {
			this.setDataYEntregar();
		}

	}


	setDataYEntregar() {

		this.loading = true;
		this.entregaFarmacia.IdModoEntrega = this.modoEntrega.Id;
		this.entregaFarmacia.IdSector = this.sector.Id;
		this.entregaFarmacia.IdUsuarioRecepta = (this.usuarioRetira) ? this.usuarioRetira.id : 0;

		this.entregaPorSector.forEach(entregaInternado => {
			if (entregaInternado.Entregar) {
				// tengo para entregar
				if (entregaInternado.ItemsEntregar) {
					entregaInternado.ItemsEntregar.forEach(itemEntrega => {
						if (this.entregaFarmacia.ItemsEntregar) {
							if (itemEntrega.Entregar)
								this.entregaFarmacia.ItemsEntregar.push(itemEntrega)
						}

					});
				}

			}
		});

		this.$log.debug('entregar productos', this.entregaFarmacia);

		this.EntregarIndicacionMedicaDataService.entregar(this.entregaFarmacia)
			.then((pResultEntregaOk) => {
				this.$log.debug('pResultEntregaOk', pResultEntregaOk);

				this.entregaResult = pResultEntregaOk;

				this.loading = false;
				this.AlertaService.NewSuccess("Entrega Correcta");

				if(this.entregaResult && this.entregaResult.IdMovimiento){

					// tenemos entrega correcta => vamos a obtener datos para imprimir stickers e informes por internado
					this.loading = true;
					this.MovimientoStockIndicacionMedicaDataService.obtenerDetalleEntregaMovimiento(this.entregaResult.IdMovimiento)
						.then((pResuDetailEntregaMov) => {
							this.$log.debug('pResuDetailEntregaMov', pResuDetailEntregaMov);
	
							// imprimimos stickers por internado
							this.imprimirStickersPorInternado(pResuDetailEntregaMov, this.entregaResult)
								.then((pResultImprimirStickersPorInt) => {
	
									// ya imprimi todos los stickers tengo que consultar si quiero imprimir los informes por internado
	
									// consulto si voy a imprimir los informes por internado
									if(this.entregaResult.ImprimirDetalle){
										this.imprimirInformePorInternado(pResuDetailEntregaMov)
											.then((pResult) => {
												this.$log.debug('pResult', pResult);
												this.cerrar(true);
												// ya tengo impresos los informes po internado, ahora consulto si imprimo el remito
												// this.imprimirRemitoDeEntrega(pResultEntregaOk.IdMovimiento);
											}, (pError) => {
												this.$log.error('pError', pError);
												this.cerrar(true);
											});
									}else {
										this.cerrar(true);
									}
	
	
								}, (pErrorImprimirStickers) => {
									this.$log.error('pErrorImprimirStickers', pErrorImprimirStickers);
								});
	
						}, (pErrorObtenerDetalleEntregaMov) => {
							this.$log.error('pErrorObtenerDetalleEntregaMov', pErrorObtenerDetalleEntregaMov);
	
						});
				}


			}, (pErrorEntrega) => {
				this.$log.error('pErrorEntrega', pErrorEntrega);
				this.loading = false;
			});
	}


	imprimirStickersPorInternado(data, result: IEntregaResultValidationDto) {
		var def = this.$q.defer();

		var chain = this.$q.when();

		data.DetalleInternaciones.forEach((internado, index, array) => {

			chain = chain.then(() => {

				if(result && result.InternacionEtiquetas && internado){
					let etiqueta = result.InternacionEtiquetas.find(x => x.IdInternacion === internado.Id);
					if (etiqueta) 
						var cantidadEtiquetas = etiqueta.Cantidad;
				}

				return this.imprimirZebra(internado.NumeroInternado.toString(), internado.ApellidoPaciente + ", " + internado.NombrePaciente, internado.Habitacion,
					internado.Cama, internado.TipoDocumento + ": " + internado.NumeroDocumento, cantidadEtiquetas);
			});

			// tenemos que consultar si es el ultimo elemento para dar aviso a la siguiente instruccion de impresion
			if (index === array.length - 1) {
				def.resolve(true);
			}
		});

		return def.promise;
	}



	imprimirInformePorInternado(data) {
		var def = this.$q.defer();
		// tenemos una entrega correcta tenemos que imprimir los informes por internado
		this.ModalService.confirm("Desea imprimir los informes por internado?",
			(pResponse) => {
				if (pResponse) {
					this.FarmaciaLogicService.imprimirInformesPorInternado(data)
						.then((pResultimprimirInformesPorInternado) => {
							this.$log.debug('pResultimprimirInformesPorInternado', pResultimprimirInformesPorInternado);
							def.resolve(true);
						}, (pErrorimprimirInformesPorInternado) => {
							this.$log.error('pErrorimprimirInformesPorInternado', pErrorimprimirInformesPorInternado);
							def.resolve(true);
						});
				} else {
					def.resolve(false);
				}
			}, undefined, this.optionsObj);

		return def.promise;
	}

	imprimirRemitoDeEntrega(idMovimiento) {
		var def = this.$q.defer();
		// tenemos una entrega correcta tenemos que imprimir los remito de la entrega
		this.ModalService.confirm("Desea imprimir el remito la entrega?",
			(pResponse) => {
				if (pResponse) {

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
										this.cerrar(true);
									}, (pErrorImprimirRemito) => {
										this.$log.error('pErrorImprimirRemito', pErrorImprimirRemito);
										def.resolve(true);
										this.cerrar(true);
									});
							}, (pError) => {
								this.$log.error('pErrorobtenerRemito', pError);
								this.loading = false;

							});
					}
				} else {
					this.cerrar(true);
				}
			}, undefined, this.optionsObj);

		return def.promise;
	}

	// #endregion

	// #region Modo de entrega
	changeModoEntrega() {
		let options: Array<any> = [];

		this.modosEntrega.forEach(modo => {
			options.push(
				{ id: modo.Id, label: modo.Nombre },
			);
		});

		this.ModalService.selectOptionModal(options)
			.then((opcionElegida) => {
				this.modoEntrega = this.modosEntrega.find(x => x.Id === opcionElegida.id);
			});
	}

	// #endregion

	// #region SUPPORT

	verSubdatosInternado(internado) {
		internado.showSubData = !internado.showSubData;
	}

	registrarRetira() {
		this.SecurityLogicService.ValidarUsuario()
			.then((pCredentials) => {
				this.$log.debug('usuario retira', pCredentials);
				this.usuarioRetira = pCredentials;
			});
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
	// #endregion


	// #region SUPPORT FORM
	seleccionarTodosChange() {
		this.$log.debug('change seleccionartodos', this.seleccionarTodos);
		if (this.seleccionarTodos) {
			// seteo los datos de entregar todos
			this.entregaPorSector.forEach(internado => {
				internado.Entregar = true;
				internado.showSubData = true;
				if (internado.ItemsEntregar) {
					internado.ItemsEntregar.forEach(item => {
						item.Entregar = true;
					});
				}
			});
		} else {
			this.entregaPorSector.forEach(internado => {
				internado.Entregar = false;
				internado.showSubData = true;
				if (internado.ItemsEntregar) {
					internado.ItemsEntregar.forEach(item => {
						item.Entregar = false;
					});
				}
			});
		}
	}


	changeSelectProducto(internado, item){
		// change producto dentro de internado
		// casos: 
		// 		si tengo un solo item seleccionado => deselecciono el internado
		//		si tengo varios items seleccionados => no deselecciono ya que me queda uno

		if(item.Entregar){
			internado.Entregar = true;
		}else {
			// ahora me fijo si queda otro seleccionado
			if(internado.ItemsEntregar.find(x => x.Entregar === true)){
				//tengo un item selected por lo que no hago nada
			}else{
				// no me queda ningun item seleccionado
				internado.Entregar = false;
			}
		}

	}

	changeSelectInternado(internado){
		if(internado.Entregar){
			internado.ItemsEntregar.forEach(item => {
				item.Entregar = true;
			});
		}else {
			internado.ItemsEntregar.forEach(item => {
				item.Entregar = false;
			});
		}
	}

	imprimirHojaPreparacion(){
		this.$log.debug('impimirHojaPreparacion',this.entregaPorSector);
		// abrimos modal para imprimir hojita de entregas
		this.FarmaciaLogicService.imprimirPrevioEntregaProductos(this.entregaPorSector, this.sector,this.piso, this.sucursal);
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaEntregarProductosPorSectorModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaEntregarProductosPorSectorModalController');
		this.$log.debug('ON');

		this.sucursal = angular.copy(this.resolve.Sucursal);
		this.sector = angular.copy(this.resolve.Sector);
		this.piso = angular.copy(this.resolve.Piso);

		this.loading = true;
		let _entregaPorSector = this.EntregarIndicacionMedicaDataService.obtenerParaEntregarPorSector(this.sector.Id);
		let _entregable = this.EntregarIndicacionMedicaDataService.obtenerNuevoEntregaFarmacia();
		let _modosEntrega = this.ModoEntregaMovimientoStockDataService.getAll();

		this.$q.all([_entregaPorSector, _entregable, _modosEntrega])
			.then((pResultOk) => {

				this.$log.debug('pResultOk', pResultOk);
				this.loading = false;
				this.entregaPorSector = pResultOk[0];
				this.entregaFarmacia = pResultOk[1];
				this.modosEntrega = pResultOk[2];

				// seteo el modo de entrega por "programado"
				this.modoEntrega = pResultOk[2][0];

				// seteo los datos de entregar todos
				this.entregaPorSector.forEach(internado => {
					internado.Entregar = true;
					internado.showSubData = false;
					if (internado.ItemsEntregar) {
						internado.ItemsEntregar.forEach(item => {
							item.Entregar = true;
						});
					}
				});

				// inicializando zebra
				this.PrintZebraService.setupWebPrint();

			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});

	}
	// #endregion
}