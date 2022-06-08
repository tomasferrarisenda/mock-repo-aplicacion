/**
* @author: ppautasso
* @description: controller para enfermeria listado
* @type: Controller
**/
import * as angular from 'angular';
import { IIndicacionMedicaEnfermeriaDataService, IEnfermeriaLogicService } from '../../services';
import { IPrintZebraService } from 'integration/printZebra/services';
import { IInternacionesDataService } from 'src/app/allendeModules/internacion/common/services';
import { IPisoDelEdificioDataService, ISectorDeInternacionDataService } from 'src/app/allendeModules/support/basic/services';
import { IIMEtiquetaEnfermeriaDto, AgregadoEtiquetaEnfermeriaDto } from '../../models';
import { ICredentialsDataService } from 'core/security';

export class EnfermeriaListadoIndicacionesMedicasTabController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};

	private _sucursal: any;
	public get sucursal(): any {
		return this._sucursal;
	}
	public set sucursal(v: any) {
		this._sucursal = v;
		if (v) {
			this.limpiarSectores();
			this.limpiarInternados();
			this.limpiarIndicaciones();
			this.buscarPisoPorSucursal();
		}
	}

	private _piso: any;
	public get piso(): any {
		return this._piso;
	}
	public set piso(v: any) {
		this._piso = v;
		if (v) {
			this.limpiarSectores();
			this.limpiarInternados();
			this.limpiarIndicaciones();
			this.buscarSectorPorPiso();
		}
	}
	pisosList;

	private _sector: any;
	public get sector(): any {
		return this._sector;
	}
	public set sector(v: any) {
		this._sector = v;
		// seteo sector
		this.limpiarInternados();
		if (v) {
			this.buscarInternadosPorSector();
			this.limpiarIndicaciones();
		}
		else {
			this.limpiarIndicaciones();
		}
	}
	sectorsList;

	private _internadoId: any;
	public get internadoId(): any {
		return this._internadoId;
	}
	public set internadoId(v: any) {
		this._internadoId = v;
		if (v) {
			// tengo internado id
			// this.internado = this.internaciones.find(x => x.Id == parseInt(v, 10));
			this.buscarIndicacionesPorInternado();
		}
	}


	private _fecha: any;
	public get fecha(): any {
		return this._fecha;
	}
	public set fecha(v: any) {
		this._fecha = v;
		if (v) {
			// cambie la fecha, busco de nuevo
			this.buscarIndicacionesPorInternado();
		}
	}

	estadosInternacion = [
		{
			nombre: "Con pendientes",
			color: "color-amarillo"
		}
		// ,
		// {
		// 	nombre: "Con Urgencias",
		// 	color: "color-aquaorange-turno"
		// }
	];

	mostrarColorInternados: boolean = false;


	// mas propiedades ..
	internado;
	internaciones;
	loading: boolean = false;
	infoUser;
	sucursalesList;
	indicacionesMedicasPorInternado;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'moment', 'AlertaService', 'ModalService',
		'CredentialsDataService', 'IndicacionMedicaEnfermeriaDataService', 'PrintZebraService',
		'EnfermeriaLogicService', 'InternacionesDataService', 'InternacionCommonLogicService', 'PisoDelEdificioDataService',
		'SectorDeInternacionDataService'];
	/**
	* @class EnfermeriaListadoIndicacionesMedicasTabController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private moment, private AlertaService, private ModalService: IModalService,
		private CredentialsDataService: ICredentialsDataService,
		private IndicacionMedicaEnfermeriaDataService: IIndicacionMedicaEnfermeriaDataService,
		private PrintZebraService: IPrintZebraService,
		private EnfermeriaLogicService: IEnfermeriaLogicService,
		private InternacionesDataService: IInternacionesDataService,
		private InternacionCommonLogicService,
		private PisoDelEdificioDataService: IPisoDelEdificioDataService,
		private SectorDeInternacionDataService: ISectorDeInternacionDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscarInternadosPorSector() {
		// voy a buscar internados por deposito

		let def = this.$q.defer();

		if (this.sector) {
			this.loading = true;

			this.IndicacionMedicaEnfermeriaDataService.obtenerIndicacionesPorSector(this.sector.Id)
				.then((pResult) => {
					this.$log.debug('pResultInternados', pResult);
					if (pResult && pResult.length) {
						pResult.forEach(item => {
							if (item.TienePendientes) item.Color = 'color-amarillo-turno';
							//if (item.TieneUrgencias) item.Color = 'color-aquaorange-turno';
						});
						this.internaciones = angular.copy(pResult);
						this.loading = false;
						def.resolve(true);
					} else {
						this.AlertaService.NewWarning("No existen internados en el sector");
						def.reject(false);
					}
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
			//obtengo fecha y hora actual y actualizo
			let _dateActual = this.moment();
			this.fecha.setHours(_dateActual.hours());
			this.fecha.setMinutes(_dateActual.minutes());

			let _fecha = angular.copy(this.moment(this.fecha).format('MM-DD-YYYY'));

			this.IndicacionMedicaEnfermeriaDataService.obtenerIndicacionesPorInternacion(this.internado.Id, _fecha)
				.then((pResult) => {
					this.$log.debug('pResultIndicaciones por interando', pResult);
					
					/*
					 * Obtuve indicaciones medicas por internado
					 * Necesito filtrar las que son de hoy solamente
					 * Pero teniendo en cuenta la hora
					 */
					
					this.indicacionesMedicasPorInternado = angular.copy(this.filtrarIndicacionesDiaSiguiente(pResult));

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


	filtrarIndicacionesDiaSiguiente(indicacionesList) { 
		
		let _indicaciones = angular.copy(indicacionesList);

		if (_indicaciones && _indicaciones.length) { 
			// tengo indicaciones voy a filtrar

			// tengo el pivote de la fecha seleccionada a las 23:00 para utilizar
			let _fechaHoraStart = this.moment(this.fecha).set('hour', 23).set('minute', 0).set('second', 0);
			let _fechaHoraEnd = this.moment(this.fecha).set('hour', 23).set('minute', 59).set('second', 59);
			//consulto si estoy anterior a las 23:00
			if (this.moment(this.fecha).isBefore(_fechaHoraStart)) {
				// estoy en el dia seleccionado (this.fecha) antes de las 23:00
				console.log("estoy antes de las 23:00");
				_indicaciones = indicacionesList.filter(x => x.IdTipoIndicacion == 2 || (x.IdTipoIndicacion == 1 && this.moment(x.FechaHora).isBefore(this.moment(this.fecha).add('day',1).startOf('day'))));
				//_indicaciones = indicacionesList.filter(x => x.IdTipoIndicacion == 2 && (x.IdTipoIndicacion == 1 && ))
			} else if (this.moment(this.fecha).isBetween(_fechaHoraStart, _fechaHoraEnd)) { 
				_indicaciones = angular.copy(indicacionesList);
			}

		}	

		return _indicaciones;
	}

	limpiarInternados() {
		delete this.internaciones;
		this.internado = {};
	}

	limpiarIndicaciones() {
		delete this.indicacionesMedicasPorInternado;
	}

	limpiarSectores() {
		delete this.sectorsList;
	}


	imprimirZebra(indicacion) {

		this.$log.debug('imprimirZebra', indicacion);

		this.loading = true;
		this.IndicacionMedicaEnfermeriaDataService.obtenerInfoImpresionEtiqueta(indicacion.pObject.Id, indicacion.pObject.IdTipoIndicacion, this.sucursal.Id)
			.then((pResultInfoEtiqueta: IIMEtiquetaEnfermeriaDto) => {
				this.$log.debug('pResultInfoEtiqueta', pResultInfoEtiqueta);
				if (indicacion.pObject.IdTipoIndicacion === 1) {
					//tengo una dosificacion
					this.imprimirZebraDosificacion(pResultInfoEtiqueta);
				} else if (indicacion.pObject.IdTipoIndicacion === 2) {
					//tengo una infusion
					//consulto si tengo agregados e imprimo
					//if (pResultInfoEtiqueta.Agregados && pResultInfoEtiqueta.Agregados.length) {

					this.irAImprimirZebraInfusion(pResultInfoEtiqueta)
						.then((pResult) => {
							this.$log.debug('pResult', pResult);
						}, (pError) => {
							this.$log.error('pError', pError);
						});

					// pResultInfoEtiqueta.Agregados.forEach(agregado => {
					// 	this.imprimirZebraInfusion(pResultInfoEtiqueta, agregado);
					// });
					//}
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});

	}

	imprimirZebraDosificacion(dosificacion) {
		var def = this.$q.defer();
		/**
		 * PQ -> cantidad de copias ejemplo: PQ3 imprime 3 copias
		 */
		this.$log.debug('voy a imprmiir una dosificacion', dosificacion);
		let _dosificacion: IIMEtiquetaEnfermeriaDto = dosificacion;

		if (_dosificacion && _dosificacion.Producto) {

			this.PrintZebraService.sendData(
				"CT~~CD,~CC^~CT~" +
				"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR3,3~SD15^JUS^LRN^CI0^XZ" +
				"^XA" +
				"^MMT" +
				"^PW587" +
				"^LL0260" +
				"^LS0" +
				"^FT563,43^A0I,25,26^FH\^FDFecha:^FS" +
				"^FT563,73^A0I,23,21^FH\^FDVia: " + _dosificacion.Via + "^FS" +
				"^FT563,98^A0I,23,21^FH\^FDDosis: " + _dosificacion.Dosis + "^FS" +
				"^FT563,134^A0I,23,21^FH\^FD" + _dosificacion.Producto.Droga + "^FS" +
				"^FT356,194^A0I,23,24^FH\^FD" + _dosificacion.TipoDocumento + ": " + _dosificacion.NroDocumento + "^FS" +
				"^FT563,193^A0I,23,24^FH\^FDNum. Int: " + this.internado.NumeroInternado + "^FS" +
				"^FT563,162^A0I,23,21^FH\^FD" + _dosificacion.Producto.Nombre + " / " + _dosificacion.Producto.Presentacion + "^FS" +
				"^FT563,226^A0I,31,31^FH\^FD" + this.internado.Paciente + "^FS" +
				"^FT32,150^BQN,2,5" +
				"^FH\^FDMA," + _dosificacion.Producto.Codigo + "^FS" +
				"^PQ1,0,1,Y^XZ"
			)
				.then((pResultSendData) => {
					this.$log.debug('pResultSendData', pResultSendData);
					def.resolve(true);
				}, (pError) => {
					this.$log.error('Error al imprimir', pError);
					this.$log.debug('tuve un error al imprimir, voy a intentar una vez mas');
					// no pude imprimir voy a internarlo una vez mas
					if (_dosificacion && _dosificacion.Producto) {

						this.PrintZebraService.sendData(
							"CT~~CD,~CC^~CT~" +
							"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR3,3~SD15^JUS^LRN^CI0^XZ" +
							"^XA" +
							"^MMT" +
							"^PW587" +
							"^LL0260" +
							"^LS0" +
							"^FT563,43^A0I,25,26^FH\^FDFecha:^FS" +
							"^FT563,73^A0I,23,21^FH\^FDVia: " + _dosificacion.Via + "^FS" +
							"^FT563,98^A0I,23,21^FH\^FDDosis: " + _dosificacion.Dosis + "^FS" +
							"^FT563,134^A0I,23,21^FH\^FD" + _dosificacion.Producto.Droga + "^FS" +
							"^FT356,194^A0I,23,24^FH\^FD" + _dosificacion.TipoDocumento + ": " + _dosificacion.NroDocumento + "^FS" +
							"^FT563,193^A0I,23,24^FH\^FDNum. Int: " + this.internado.NumeroInternado + "^FS" +
							"^FT563,162^A0I,23,21^FH\^FD" + _dosificacion.Producto.Nombre + " / " + _dosificacion.Producto.Presentacion + "^FS" +
							"^FT563,226^A0I,31,31^FH\^FD" + this.internado.Paciente + "^FS" +
							"^FT32,150^BQN,2,5" +
							"^FH\^FDMA," + _dosificacion.Producto.Codigo + "^FS" +
							"^PQ1,0,1,Y^XZ"
						).then((pResultOneMore) => {
							this.$log.debug('pResultOneMore', pResultOneMore);
							def.resolve(true);
						}, (pError2) => {
							this.$log.error('pError2', pError2);
							def.reject(pError2);
						});
					}

				});
		}

		return def.promise;
	}


	irAImprimirZebraInfusion(pResultInfoEtiqueta: IIMEtiquetaEnfermeriaDto) {

		var def = this.$q.defer();
		var chain = this.$q.when();

		if (pResultInfoEtiqueta.Agregados && pResultInfoEtiqueta.Agregados.length) {

			pResultInfoEtiqueta.Agregados.forEach((agregado, index, array) => {

				chain = chain.then(() => {
					this.$log.debug('chain n', index + 1);
					return this.imprimirZebraInfusion(pResultInfoEtiqueta, agregado);
				});

				// tenemos que consultar si es el ultimo elemento para dar aviso a la siguiente instruccion de impresion
				if (index === array.length - 1) {
					def.resolve(true);
				}
				// setTimeout(() => {
				// 	this.imprimirZebraInfusion(pResultInfoEtiqueta, agregado);
				// }, 2000);

			});
		} else {
			this.imprimirZebraInfusionSinAgregados(pResultInfoEtiqueta);

		}

		return def.promise;
	}


	imprimirZebraInfusion(infusion, agregado) {
		var def = this.$q.defer();
		/**
		 * PQ -> cantidad de copias ejemplo: PQ3 imprime 3 copias
		 */
		this.$log.debug('voy a imprmiir una infusion', infusion);
		let _infusion: IIMEtiquetaEnfermeriaDto = infusion;
		let _agregado: AgregadoEtiquetaEnfermeriaDto = agregado;

		if (_infusion && _infusion.Descripcion && _agregado && _agregado.Producto) {

			this.PrintZebraService.sendData(
				"CT~~CD,~CC^~CT~" +
				"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ" +
				"^XA" +
				"^MMT" +
				"^PW591" +
				"^LL0264" +
				"^LS0" +
				"^FT563,39^A0I,25,26^FH\^FDFecha:^FS" +
				"^FT563,122^A0I,20,19^FH\^FDVel. de Inf.: " + _infusion.Goteo + "^FS" +
				"^FT563,66^A0I,20,16^FH\^FD" + _agregado.Producto.Droga + " / Dosis: " + _agregado.Cantidad + " " + _agregado.Unidad + "^FS" +
				"^FT563,145^A0I,20,19^FH\^FDVia: " + _infusion.Via + "^FS" +
				"^FT563,170^A0I,20,19^FH\^FDInfu: " + _infusion.Descripcion + " - " + _infusion.Volumen + "^FS" +
				"^FT356,198^A0I,23,24^FH\^FD" + _infusion.TipoDocumento + ": " + _infusion.NroDocumento + "^FS" +
				"^FT563,197^A0I,23,24^FH\^FDNum. Int: " + this.internado.NumeroInternado + "^FS" +
				"^FT563,90^A0I,23,21^FH\^FD" + _agregado.Producto.Nombre + "^FS" +
				"^FT563,230^A0I,31,31^FH\^FD" + this.internado.Paciente + "^FS" +
				"^FT39,226^BQN,2,5" +
				"^FH\^FDMA," + _agregado.Producto.Codigo + "^FS" +
				"^PQ1,0,1,Y^XZ"
			)
				.then((pResultSendData) => {
					this.$log.debug('pResultSendData', pResultSendData);
					def.resolve(true);
				}, (pError) => {
					this.$log.error('Error al imprimir', pError);
					this.$log.debug('tuve un error al imprimir, voy a intentar una vez mas');
					// no pude imprimir voy a internarlo una vez mas
					if (_infusion && _infusion.Descripcion && _agregado && _agregado.Producto) {


						this.PrintZebraService.sendData(
							"CT~~CD,~CC^~CT~" +
							"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ" +
							"^XA" +
							"^MMT" +
							"^PW591" +
							"^LL0264" +
							"^LS0" +
							"^FT563,39^A0I,25,26^FH\^FDFecha:^FS" +
							"^FT563,122^A0I,20,19^FH\^FDVel. de Inf.: " + _infusion.Goteo + "^FS" +
							"^FT563,66^A0I,20,16^FH\^FD" + _agregado.Producto.Droga + " / Dosis: " + _agregado.Cantidad + " " + _agregado.Unidad + "^FS" +
							"^FT563,145^A0I,20,19^FH\^FDVia: " + _infusion.Via + "^FS" +
							"^FT563,170^A0I,20,19^FH\^FDInfu: " + _infusion.Descripcion + " - " + _infusion.Volumen + "^FS" +
							"^FT356,198^A0I,23,24^FH\^FD" + _infusion.TipoDocumento + ": " + _infusion.NroDocumento + "^FS" +
							"^FT563,197^A0I,23,24^FH\^FDNum. Int: " + this.internado.NumeroInternado + "^FS" +
							"^FT563,90^A0I,23,21^FH\^FD" + _agregado.Producto.Nombre + "^FS" +
							"^FT563,230^A0I,31,31^FH\^FD" + this.internado.Paciente + "^FS" +
							"^FT39,226^BQN,2,5" +
							"^FH\^FDMA," + _agregado.Producto.Codigo + "^FS" +
							"^PQ1,0,1,Y^XZ"
						).then((pResultOneMore) => {
							this.$log.debug('pResultOneMore', pResultOneMore);
							def.resolve(true);
						}, (pError2) => {
							this.$log.error('pError2', pError2);
							def.reject(pError2);
						});
					}

				});
		}

		return def.promise;
	}

	imprimirZebraInfusionSinAgregados(infusion) {
		var def = this.$q.defer();
		/**
		 * PQ -> cantidad de copias ejemplo: PQ3 imprime 3 copias
		 */
		this.$log.debug('voy a imprmiir una infusion sin agregados', infusion);
		let _infusion: IIMEtiquetaEnfermeriaDto = infusion;

		if (_infusion && _infusion.Descripcion) {

			this.PrintZebraService.sendData(
				"CT~~CD,~CC^~CT~" +
				"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ" +
				"^XA" +
				"^MMT" +
				"^PW591" +
				"^LL0264" +
				"^LS0" +
				"^FT563,39^A0I,25,26^FH\^FDFecha:^FS" +
				"^FT563,122^A0I,20,19^FH\^FDVel. de Inf.: " + _infusion.Goteo + "^FS" +
				"^FT563,66^A0I,20,16^FH\^FDDosis: " + " - " + "^FS" +
				"^FT563,145^A0I,20,19^FH\^FDVia: " + _infusion.Via + "^FS" +
				"^FT563,170^A0I,20,19^FH\^FDInfu: " + _infusion.Descripcion + " - " + _infusion.Volumen + "^FS" +
				"^FT356,198^A0I,23,24^FH\^FD" + _infusion.TipoDocumento + ": " + _infusion.NroDocumento + "^FS" +
				"^FT563,197^A0I,23,24^FH\^FDNum. Int: " + this.internado.NumeroInternado + "^FS" +
				"^FT563,90^A0I,23,21^FH\^FD" + "Sin Agregado" + "^FS" +
				"^FT563,230^A0I,31,31^FH\^FD" + this.internado.Paciente + "^FS" +
				"^FT39,226^BQN,2,5" +
				"^FH\^FDMA," + "000000" + "^FS" +
				"^PQ1,0,1,Y^XZ"
			)
				.then((pResultSendData) => {
					this.$log.debug('pResultSendData', pResultSendData);
					def.resolve(true);
				}, (pError) => {
					this.$log.error('Error al imprimir', pError);
					this.$log.debug('tuve un error al imprimir, voy a intentar una vez mas');
					// no pude imprimir voy a internarlo una vez mas
					if (_infusion && _infusion.Descripcion) {


						this.PrintZebraService.sendData(
							"CT~~CD,~CC^~CT~" +
							"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ" +
							"^XA" +
							"^MMT" +
							"^PW591" +
							"^LL0264" +
							"^LS0" +
							"^FT563,39^A0I,25,26^FH\^FDFecha:^FS" +
							"^FT563,122^A0I,20,19^FH\^FDVel. de Inf.: " + _infusion.Goteo + "^FS" +
							"^FT563,66^A0I,20,16^FH\^FDDosis: " + " - " + "^FS" +
							"^FT563,145^A0I,20,19^FH\^FDVia: " + _infusion.Via + "^FS" +
							"^FT563,170^A0I,20,19^FH\^FDInfu: " + _infusion.Descripcion + " - " + _infusion.Volumen + "^FS" +
							"^FT356,198^A0I,23,24^FH\^FD" + _infusion.TipoDocumento + ": " + _infusion.NroDocumento + "^FS" +
							"^FT563,197^A0I,23,24^FH\^FDNum. Int: " + this.internado.NumeroInternado + "^FS" +
							"^FT563,90^A0I,23,21^FH\^FD" + "Sin Agregado" + "^FS" +
							"^FT563,230^A0I,31,31^FH\^FD" + this.internado.Paciente + "^FS" +
							"^FT39,226^BQN,2,5" +
							"^FH\^FDMA," + "000000" + "^FS" +
							"^PQ1,0,1,Y^XZ"
						).then((pResultOneMore) => {
							this.$log.debug('pResultOneMore', pResultOneMore);
							def.resolve(true);
						}, (pError2) => {
							this.$log.error('pError2', pError2);
							def.reject(pError2);
						});
					}

				});
		}

		return def.promise;
	}

	colocarSuero(indicacion) {
		this.$log.debug('colocarSuero', indicacion);
		this.EnfermeriaLogicService.openColocarSueroEnfermeria(indicacion.pObject.Id, this.sucursal.Id, 
			this.internado.TipoDocumento, this.internado.NumeroDocumento, true)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if (pResult)
					this.buscarIndicacionesPorInternado();
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	verSuero(indicacion) {
		this.$log.debug('verSueros', indicacion);
		this.EnfermeriaLogicService.openColocarSueroEnfermeria(indicacion.pObject.Id, this.sucursal.Id, 
			this.internado.TipoDocumento, this.internado.NumeroDocumento, false)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	suministrarEjecucion(ejecucion) {
		this.$log.debug('suministrarEjecucion', ejecucion);

		// se agrega verificacion para horario antes de toma
		if(this.moment().isBefore(this.moment(ejecucion.pObject.FechaProgramada))){
			this.AlertaService.NewWarning("Atención, la hora programada para la toma es mayor a la actual");
		}

		this.EnfermeriaLogicService.openSuministrarEjecucionEnfermeria(ejecucion.pObject.Id, this.sucursal.Id, 
			this.internado.TipoDocumento, this.internado.NumeroDocumento)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if (pResult)
					this.buscarIndicacionesPorInternado();
			}, (pError) => {
				this.$log.error('pError', pError);
			});
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
		this.buscarInternadosPorSector()
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

	buscarPisoPorSucursal() {

		let def = this.$q.defer();
		this.loading = true;
		this.PisoDelEdificioDataService.obtenerPisosPorSucursalHabilitadosAlUsuario(this.sucursal.Id)
			.then((pResponsePiso) => {

				this.$log.debug('obtenerPisosPorSucursalHabilitadosAlUsuarioOk', pResponsePiso);
				this.pisosList = angular.copy(pResponsePiso);
				def.resolve(true);
				this.loading = false;

			}, (pErrorPisos) => {
				this.$log.error('obtenerPisosPorSucursalHabilitadosAlUsuarioError', pErrorPisos);
				this.loading = false;
				def.reject(pErrorPisos);
			})

		return def.promise;
	}

	setearPiso() {
		let def = this.$q.defer();
		if (this.pisosList && this.pisosList.length) {
			this.piso = this.pisosList[0];
			def.resolve(true);
		} else {
			this.AlertaService.NewWarning("No existen Pisos asignados");
			def.reject(false);
		}
		return def.promise;

	}

	buscarSectorPorPiso() {

		let def = this.$q.defer();
		this.loading = true;
		this.SectorDeInternacionDataService.obtenerPorPisoConDeposito(this.piso.Id)
			.then((pResponseSector) => {

				this.$log.debug('obtenerPorPisoOk', pResponseSector);
				this.sectorsList = angular.copy(pResponseSector);
				def.resolve(true);
				this.loading = false;

			}, (pErrorPisos) => {
				this.$log.error('obtenerPorPisoError', pErrorPisos);
				this.loading = false;
				def.reject(pErrorPisos);
			});
		return def.promise;
	}

	seleccionarInternado() {
		this.EnfermeriaLogicService.openSeleccionadorInternadosEnfermeria(this.internaciones)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.internado = pResult;
				this.internado.NombreMostrar = this.internado.TipoDocumento + ": " + this.internado.NumeroDocumento + " || " + this.internado.Paciente + " || Hab: " + this.internado.Habitacion +
					" Cama: " + this.internado.Cama;

				this.internadoId = this.internado.Id;
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}


	validarMedicamentoInternado() {



		var _numeroMedicamento = 0;
		var _numeroInternado = 0;

		this.EnfermeriaLogicService.openScannerEnfermeria("Escanee Codigo QR de medicamento", "qrcode")
			.then((pResultMedicamento) => {
				this.$log.debug('pResultMedicamento', pResultMedicamento);
				_numeroMedicamento = pResultMedicamento.text;

				setTimeout(() => {
					this.EnfermeriaLogicService.openScannerEnfermeria("Escanee Codigo de Barras de INTERNADO", "barcode")
						.then((pResultInternado) => {
							this.$log.debug('pResultInternado', pResultInternado);
							_numeroInternado = pResultInternado.text;

							this.loading = true;
							this.IndicacionMedicaEnfermeriaDataService.validarSuministroMedicamento(_numeroInternado, _numeroMedicamento)
								.then((pResultValidar) => {
									this.$log.debug('pResultValidar', pResultValidar);
									if (pResultValidar.IsOk) {
										this.ModalService.openSuccessAnimationModal("Verificacion Correcta");
									} else {
										this.AlertaService.NewWarning(pResultValidar.Message);
									}
									this.loading = false;
								}, (pErrorValidar) => {
									this.$log.error('pErrorValidar', pErrorValidar);
									this.loading = false;
								});

						}, (pErrorInternado) => {
							this.$log.error('pErrorInternado', pErrorInternado);
						});
				}, 500);

			}, (pErrorMedicamento) => {
				this.$log.error('pErrorMedicamento', pErrorMedicamento);
			});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaListadoIndicacionesMedicasTabController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaListadoIndicacionesMedicasTabController');
		this.$log.debug('ON');

		this.fecha = new Date();
		// voy a ver si tengo varias sucursales o no
		// si tengo una sola por permiso general => la asigno
		// si tengo 2 sucursales 
		setTimeout(() => {
			this.infoUser = this.CredentialsDataService.GetForce();
			this.$log.debug('infoUser', this.infoUser);

			this.sucursalesList = angular.copy(this.infoUser.sucursales);
			if (this.sucursalesList && this.sucursalesList.length) {
				// obtuve la sucursal y la asigno
				this.sucursal = angular.copy(this.sucursalesList[0]);

				//una vez que tengo la sucursal voy a buscar los pisos;
				this.buscarPisoPorSucursal()
					.then((pResultBuscarPisoPorSucursal) => {
						this.$log.debug('pResultBuscarPisoPorSucursal', pResultBuscarPisoPorSucursal);
						//tengo pisos entonces seteo el piso
						//voy a setear el piso con promise
						this.setearPiso()
							.then((pResultSetPiso) => {
								this.$log.debug('pResultSetPiso', pResultSetPiso);
								//tengo el piso seteado, vamos a bucar los sectores
								this.buscarSectorPorPiso()
									.then((pResultBuscarSectorPorPiso) => {
										this.$log.debug('pResultBuscarSectorPorPiso', pResultBuscarSectorPorPiso);
										//tengo los sectores listos entonces asigno el sector
										if (this.sectorsList && this.sectorsList.length)
											this.sector = this.sectorsList[0];
										else this.AlertaService.NewWarning("No existen sectores asignados");
										this.loading = false;
									}, (pErrorBuscarSectorPorPiso) => {
										this.$log.error('pErrorBuscarSectorPorPiso', pErrorBuscarSectorPorPiso);
									});
							}, (pErrorSetPiso) => {
								this.$log.error('pErrorSetPiso', pErrorSetPiso);
							});

					}, (pErrorBuscarPisoPorSucursal) => {
						this.$log.error('pErrorBuscarPisoPorSucursal', pErrorBuscarPisoPorSucursal);
					});

			}
		});

		// inicializando zebra
		this.PrintZebraService.setupWebPrint();
	}
	// #endregion
}