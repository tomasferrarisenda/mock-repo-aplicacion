/**
* @author: ppautasso
* @description: controller para componente de devuluciones en indicaciones medicas de farmacai
* @type: Controller
**/
import * as angular from 'angular';
import { IFarmaciaLogicService, IFarmaciaIndicacionesMedicasDataService } from '../../services';
import { IIndicacionMedica } from '../../models';
import { IItemsIndicacionMedicaFarmacia } from '../../models/util';
import { ICredentialsDataService } from 'core/security';
export class FarmaciaDevolucionesIndicacionesMedicasController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	indicacionesMedicasPorInternado: Array<IIndicacionMedica> = [];
	numeroInternado;
	facturar;
	textoBtnFacturar;
	enfermeria;
	InfoUser;
	sucursalesList;
	// #endregion

	private _sucursal: any;
	public get sucursal(): any {
		return this._sucursal;
	}
	public set sucursal(v: any) {
		this._sucursal = v;
		if (v) {
			this.limpiarDatosIndicaciones()
			this.limpiarInternados();
		}
	}

	private _piso: any;
	public get piso(): any {
		return this._piso;
	}
	public set piso(v: any) {
		this._piso = v;
		if (v) {
			this.limpiarDatosIndicaciones()
			this.limpiarInternados();
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
			this.limpiarDatosIndicaciones()
			this.buscarInternadosConDevolucionesPendientesPorSector(false);
		}
		else {
			this.limpiarInternados();
			this.limpiarDatosIndicaciones();
		}

	}


	private _internado : any;
	public get internado() : any {
		return this._internado;
	}

	public set internado(v : any) {
		this._internado = v;
		this.$log.debug('set internado',v);
		if(v){
			
			// busco si cambie el internado
			this.buscar();
		}else {
			// si el internado es nulo limpio 
			this.limpiarDatosIndicaciones()
		}
	}

	private _internadoId: any;
	public get internadoId(): any {
		return this._internadoId;
	}
	public set internadoId(v: any) {
		this._internadoId = v;
		if (v) {
			// tengo internado id
			this.internado = this.internaciones.find(x => x.Id == parseInt(v, 10))
			//this.internado = this.internaciones.find(x => x.Id == parseInt(v, 10));
			//this.buscarIndicacionesPorInternado();
		}
	}

	internaciones;
	internadoEnf;
	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'FarmaciaLogicService', 'FarmaciaIndicacionesMedicasDataService', 
	'AlertaService', 'InternacionesDataService', 'CredentialsDataService'];
	/**
	* @class FarmaciaDevolucionesIndicacionesMedicasController
	* @constructor
	*/
	constructor(private $log: ILogger, private FarmaciaLogicService:IFarmaciaLogicService, 
		private FarmaciaIndicacionesMedicasDataService:IFarmaciaIndicacionesMedicasDataService, 
		private AlertaService:IAlertaService, private InternacionesDataService, private CredentialsDataService: ICredentialsDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	openInternadosConPendientes(){
		// voy a abrir los internados con pendientes
		this.FarmaciaLogicService.openSeleccionarInternadosConIndicacionesPendientes(false)
		.then( (pResult) => {
			this.$log.debug('pResultInternadoConPendientes',pResult);
			// obtengo el internado con pendientes y lo selecciono
			
			this.InternacionesDataService.obtenerInternadoPorNumeroInternacion(pResult.NumeroInternado)
			.then((internadoResult) => {
				this.$log.debug('internadoResult', internadoResult);
				internadoResult.NombreYApellidoInternado = internadoResult.ApellidoPaciente + ', ' + internadoResult.NombrePaciente;
				internadoResult.DocumentoYTipoInternado = internadoResult.TipoDocumento + ': ' + internadoResult.NumeroDocumento;
				this.numeroInternado = pResult.NumeroInternado;
				this.internado = internadoResult;
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	
			
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	openInternadosConAltaConPendientes() { 
		this.FarmaciaLogicService.openSeleccionarInternadosConIndicacionesPendientes(true)
		.then( (pResult) => {
			this.$log.debug('pResultInternadoConPendientes',pResult);
			// obtengo el internado con pendientes y lo selecciono
			
			this.InternacionesDataService.obtenerInternadoPorNumeroInternacion(pResult.NumeroInternado)
			.then((internadoResult) => {
				this.$log.debug('internadoResult', internadoResult);
				internadoResult.NombreYApellidoInternado = internadoResult.ApellidoPaciente + ', ' + internadoResult.NombrePaciente;
				internadoResult.DocumentoYTipoInternado = internadoResult.TipoDocumento + ': ' + internadoResult.NumeroDocumento;
				this.numeroInternado = pResult.NumeroInternado;
				this.internado = internadoResult;
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	
			
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	buscar(){
		// voy a buscar por internado las indicaciones pendientes
		if(this.internado && this.internado.Id){
			this.loading = true;
			this.$log.debug('buscando indicaciones pendientes por internado',this.internado);
			this.FarmaciaIndicacionesMedicasDataService.obtenerConDevolucionesPendientesPorInternacion(this.internado.Id)
			.then( (indicacionesPorInternadoResult) => {
				this.$log.debug('indicacionesPorInternadoResult',indicacionesPorInternadoResult);
				if(indicacionesPorInternadoResult && indicacionesPorInternadoResult.length > 0){
					this.indicacionesMedicasPorInternado = angular.copy(indicacionesPorInternadoResult);
				}else {
					this.AlertaService.NewWarning("Atención","No existen indicaciones médicas para el internado")
					this.limpiarDatosIndicaciones();
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});
		}
	}

	facturarDevolver() {
		this.$log.debug('voy a facturar/devolver data', this.indicacionesMedicasPorInternado);
		let _dataFacturarDevolver = this.existenElementosParaFacturarDevolver();
		this.$log.debug('_dataFacturarDevolver', _dataFacturarDevolver);
		if(_dataFacturarDevolver.Agregados && _dataFacturarDevolver.Descartables && _dataFacturarDevolver.Ejecuciones){
			if(_dataFacturarDevolver.Agregados.length > 0 || _dataFacturarDevolver.Descartables.length > 0 || _dataFacturarDevolver.Ejecuciones.length > 0){
				this.FarmaciaLogicService.openFacturarDevolverIndicacion(_dataFacturarDevolver, this.internado)
				.then( (pResultFacturarDevolver) => {
					this.$log.debug('pResultFacturarDevolver',pResultFacturarDevolver);
					if (this.enfermeria) {
						this.recargar();
					} else { 
						this.buscar();
					}
					
				}, (pError) => {
					this.$log.error('pError',pError);
				});
			} else this.AlertaService.NewWarning("No existen elementos de alguna indicación médica marcados para Facturar o Devolver");
		}else this.AlertaService.NewWarning("No existen elementos de alguna indicación médica marcados para Facturar o Devolver");
	}


	buscarInternadosConDevolucionesPendientesPorSector(recargar: boolean) { 
		this.$log.debug('buscandoInternadosCond devolucionesPorSector: ');
		this.loading = true;
		this.FarmaciaIndicacionesMedicasDataService.obtenerInternacionesConDevolucionesPendientesPorSector(this.sector.Id)
			.then((internados) => {
				this.$log.debug('internados', internados);
				internados.forEach(_internado => {
					if (_internado.TieneDevolucionesPendientes) {
						_internado.Color = "color-amarillo";
					}
				});
				this.internaciones = internados;
				if (this.enfermeria && recargar) { 
					this.buscar();
				}
			this.loading = false;
		}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
		});
	}

	internacionEnfChanged() { 

		let _internadoSelected;
		if (this.internadoEnf) { 
			this.internado = this.internaciones.find(x => x.Id = this.internadoEnf)
		}
		
	}

	recargar() { 
		this.limpiarDatosIndicaciones();
		this.buscarInternadosConDevolucionesPendientesPorSector(true);
	}

	// #endregion

	// #region SUPPORT

	existenElementosParaFacturarDevolver() {

		let _elementosFacturarDevolver:IItemsIndicacionMedicaFarmacia = {};
		_elementosFacturarDevolver.Ejecuciones = [];
		_elementosFacturarDevolver.Descartables = [];
		_elementosFacturarDevolver.Agregados = [];

		if (this.indicacionesMedicasPorInternado && this.indicacionesMedicasPorInternado.length) {
			this.indicacionesMedicasPorInternado.forEach(indicacion => {

				// consulto si existen elementos para facturar o devolver en EJECUCIONES
				if(indicacion.Ejecuciones){
					if (indicacion.Ejecuciones.length) {
						if (indicacion.Ejecuciones.filter(x => x.Facturar || x.Devolver)) {
							// tengo ejecuciones para facturar o devolver => las agrego
							
								var _ejecuciones = indicacion.Ejecuciones.filter(x => x.Facturar || x.Devolver);
								_ejecuciones.forEach(ejecucion => {
									if(_elementosFacturarDevolver.Ejecuciones){
										if(indicacion.Producto){
											ejecucion.Producto = indicacion.Producto.CodigoStockeable + " - " + 
											indicacion.Producto.NombreStockeable + " - " + indicacion.Producto.PresentacionStockeable;
										}
										_elementosFacturarDevolver.Ejecuciones.push(ejecucion);
									}
								});
							}
					}
				}

				// consulto si existen elementos para facturar o devolver en DESCARTABLES
				if(indicacion.Descartables){
					if (indicacion.Descartables.length) {
						if (indicacion.Descartables.filter(x => x.Facturar || x.Devolver)) {
							// tengo Descartables para facturar o devolver => las agrego
							var _descartables = indicacion.Descartables.filter(x => x.Facturar || x.Devolver);
							_descartables.forEach(descartable => {
								if(_elementosFacturarDevolver.Descartables){
									_elementosFacturarDevolver.Descartables.push(descartable);
								}
							});
						}
					}
				}

				// consulto si existen elementos para facturar o devolver en AGREGADOS
				if (indicacion.Agregados && indicacion.Agregados.length) {
					if (indicacion.Agregados.filter(x => x.Facturar || x.Devolver)) {
						// tengo Agregados para facturar o devolver => las agrego
						var _agregados = indicacion.Agregados.filter(x => x.Facturar || x.Devolver);
						_agregados.forEach(agregado => {
							if(_elementosFacturarDevolver.Agregados){
								_elementosFacturarDevolver.Agregados.push(agregado);
							}
						});
					}
				}

			});
		}

		return _elementosFacturarDevolver;
	}
	
	limpiarDatosIndicaciones(){
		delete this.indicacionesMedicasPorInternado;
	}

	limpiarInternados() { 
		delete this.internaciones;
	}
	
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaDevolucionesIndicacionesMedicasController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaDevolucionesIndicacionesMedicasController');
		this.$log.debug('ON');

		this.InfoUser = this.CredentialsDataService.GetForce();
		this.$log.debug('infouser',this.InfoUser);

		// obtengo las sucursales
		// y seteo si hay una
		if (this.enfermeria) { 
			setTimeout(() => {
				this.InfoUser = this.CredentialsDataService.GetForce();
					this.$log.debug('infoUser', this.InfoUser);
	
					this.sucursalesList = angular.copy(this.InfoUser.sucursales);
					if (this.sucursalesList && this.sucursalesList.length)
						this.sucursal = angular.copy(this.sucursalesList[0]);
				}, 300);
		}
	
	}
	// #endregion
}