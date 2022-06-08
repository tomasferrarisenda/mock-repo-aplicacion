/**
* @author: ppautasso
* @description: controller para listar las revaluaciones de prefacturacion
* @type: Controller
**/
import * as angular from 'angular';
import { IRevaluacionDataService, IRevaluacionModalService } from '../../services';
import { IRevaluarDto, IFiltroBusquedaItemsParaRevaluacionDto } from '../../models';

export class RevaluacionPrefacturaListController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	mutual: any;
	planMutual: any;
	sucursal: any;
	servicioMedico: any;
	prefacturable: any;
	loading: boolean = false;
	
	private _fechaDesde : Date = new Date();
	public get fechaDesde() : Date {
		return this._fechaDesde;
	}
	public set fechaDesde(v : Date) {
		this._fechaDesde = v;
		this.limpiarData();
	}
	
	
	private _fechaHasta : Date = new Date();
	public get fechaHasta() : Date {
		return this._fechaHasta;
	}
	public set fechaHasta(v : Date) {
		this._fechaHasta = v;
		this.limpiarData();
	}
	

	//fechaDesde = new Date();
	//fechaHasta = new Date();
	fechadesdeMin = new Date();

	paginacion = {
		currentPage: 0,
		pageSize: 0,
		totalItems: 0,
	};

	dataFilter;
	seleccionarTodos: boolean = false;

	revaluo: IRevaluarDto = {};
	filtroBusqueda: IFiltroBusquedaItemsParaRevaluacionDto = {};

	data: any;

	keyPrefacturaStorage: string = "revaluacion-prefactura-ambulatorio-data";
	
	modalLoading: any;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'moment', 'RevaluacionDataService', 'AlertaService', 
	'$state', 'ORIGEN_PREFACTURA', 'PrefacturaAmbulatorioStorageHelperService', '$q', 'RevaluacionModalService', '$rootScope'];
	/**
	* @class RevaluacionPrefacturaListController
	* @constructor
	*/
	constructor(private $log: ILogger, private moment, 
		private RevaluacionDataService: IRevaluacionDataService,
		private AlertaService: IAlertaService, 
		private $state, 
		private ORIGEN_PREFACTURA,
		private PrefacturaAmbulatorioStorageHelperService,
		private $q,
		private modalService: IRevaluacionModalService, private $rootScope) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar() {
		if (this.mutual && this.mutual.Id && this.sucursal && this.sucursal.Id) {
			this.loading = true;

			var _fechaDesde = angular.copy(this.moment(this.fechaDesde).format('MM-DD-YYYY'));
			var _fechaHasta = angular.copy(this.moment(this.fechaHasta).format('MM-DD-YYYY'));

			this.filtroBusqueda.FechaDesde = _fechaDesde;
			this.filtroBusqueda.FechaHasta = _fechaHasta;
			this.filtroBusqueda.IdMutual = this.mutual.Id;
			this.filtroBusqueda.IdPlanMutual = (this.planMutual) ? this.planMutual.Id : 0;
			this.filtroBusqueda.IdPrefacturable = (this.prefacturable) ? this.prefacturable.Id : 0;
			this.filtroBusqueda.IdTipoPrefacturable = (this.prefacturable) ? this.prefacturable.IdTipoPrefacturable : 0;
			this.filtroBusqueda.IdServicio = (this.servicioMedico) ? this.servicioMedico.Id : 0;
			this.filtroBusqueda.IdSucursal = (this.sucursal) ? this.sucursal.Id : 0;

			this.RevaluacionDataService.obtenerPorFiltro(this.filtroBusqueda)
				.then((pResult) => {
					this.$log.debug('pResultobtenerPorFiltro', pResult);
					if (pResult && pResult.length) {

						pResult.forEach((item, key) => {
							item.IdRow = key;
						});

						this.data = angular.copy(pResult);
						this.pageChanged();
					} else {
						this.AlertaService.NewWarning("No existen datos para la busqueda realizada");
						delete this.data;
						delete this.dataFilter;
					}

					this.loading = false;
				}, (pError) => {
					this.$log.error('pErrorObtenerPorFiltro', pError);
					this.loading = false;
				});
		} else {
			if (!this.mutual){
				this.AlertaService.NewWarning("Debe seleccionar una mutual");
			}else
			this.AlertaService.NewWarning("Debe seleccionar una sucursal");
			
		}
	}

	changeFechaDesde() {
		//this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
		this.fechadesdeMin.setDate(this.fechaDesde.getDate());
	}

	pageChanged() {
		var begin = ((this.paginacion.currentPage - 1) * this.paginacion.pageSize);
		var end = begin + this.paginacion.pageSize;
		this.dataFilter = angular.copy(this.data);

		this.paginacion.totalItems = this.data.length;
		this.dataFilter = this.dataFilter.slice(begin, end);
	}

	checkRow(item) {
		if (this.data.find(x => x.IdRow == item.IdRow)) {

			if (this.data)
				this.data.find(x => x.IdRow == item.IdRow).checked = angular.copy(item.checked);
		}
	}

	seleccionarTodosChange() {
		this.data.forEach(item => {
			item.checked = angular.copy(this.seleccionarTodos);
		});

		this.pageChanged();
	}


	revaluar() {
		this.$log.debug('revaluando..');

		
		this.revaluarTodos()
		.then( (pResult) => {
			this.$log.debug('pResult revaluar final', pResult);
		
		}, (pError) => {
				this.$log.error('pError revaluar final', pError);
		
		});

	
	}

	revaluarTodos() { 
		var def = this.$q.defer();
		let _revaluar: IRevaluarDto = {};
		_revaluar.IdsItems = [];

		this.data.forEach(item => {
			if (item.checked && _revaluar.IdsItems)
				_revaluar.IdsItems.push(item.Id);
		});

		var _elementosParaRevaluar: Array<any> = this.arrayTo2DArray2(_revaluar.IdsItems, 100);
		this.modalService.openLoadingProgress(_elementosParaRevaluar.length);
		var progress = 0;
		_elementosParaRevaluar.forEach((arr,index, array) => {

			var chain = this.$q.when();

			chain = chain.then(() => {

				let _revaluar: IRevaluarDto = {};
				_revaluar.IdsItems = arr;
			
				return this.revaluarPromise(_revaluar).then((resultPromise) => {
					this.$log.debug("RevaluarPromise", resultPromise);
					progress++;
					this.$log.debug("RevaluarPromise array.length-1 y progress", array.length, progress);
					this.$rootScope.$broadcast('progressRevaluacionFacturacion', {pProgress:progress, error: false});
					if (progress === array.length) {
						this.$log.debug('termino el array');
						def.resolve(true);
					}
				}, (error) => {
						progress++;
						this.$log.debug("RevaluarPromise array.length-1 y progress", array.length, progress);
						this.$rootScope.$broadcast('progressRevaluacionFacturacion', {pProgress:progress, error: true});
						if (progress === array.length) {
							this.$log.debug('termino el array');
							def.resolve(false);
						}
				})
			});
		
							
		});
		return def.promise;
	}

	revaluarPromise(_revaluar) { 

		var def = this.$q.defer();

		if (_revaluar && _revaluar.IdsItems.length) {

			this.RevaluacionDataService.revaluar(_revaluar)
				.then((pResultRevaluar) => {
					this.$log.debug('pResultRevaluar', pResultRevaluar);
					if (pResultRevaluar && pResultRevaluar.IsOk) {

						this.$log.debug('TERMINE UN REVALUO');
						if (pResultRevaluar.Resultados) {
							pResultRevaluar.Resultados.forEach(result => {

								var foundIndex = this.data.findIndex(x => x.Id === result.IdItemPrefacturado);
								//this.$log.debug('item a actualizar', foundIndex, result.Item);
								this.data[foundIndex] = angular.copy(result.Item);
								this.data[foundIndex].RevaluoText = (result.Reevaluo) ? "SI" : "NO";
								this.data[foundIndex].Revaluo = angular.copy(result.Reevaluo);
								this.data[foundIndex].ObservacionNoRevaluo = result.ObservacionNoRevaluo;
								this.data[foundIndex].modified = true;

								//limpio variable de seleccionar todos por las dudas haya sido marcada
								this.seleccionarTodos = false;

								this.pageChanged();
								def.resolve(true);

							});
						}
					} else {
						this.AlertaService.NewWarning(pResultRevaluar.Message);
						def.reject(false);
					}
					
				}, (pErrorRevaluar) => {
					this.$log.error('pErrorRevaluar', pErrorRevaluar);
	
						def.reject(false);
				});
		} else {
			this.AlertaService.NewWarning("No existen elementos marcados para revaluar");
			def.reject(false);

		}
        return def.promise;
	}

	arrayTo2DArray2(list, howMany) {
		var idx = 0
		var result: Array<any> = [];
	  
		while (idx < list.length) {
		  if (idx % howMany === 0) result.push([])
		  result[result.length - 1].push(list[idx++])
		}
	  
		return result;
	  }
	  
	
	limpiar() {
		delete this.sucursal;
		delete this.mutual;
		delete this.planMutual;
		delete this.servicioMedico;
		delete this.prefacturable;
		delete this.data;
		delete this.dataFilter;

		this.fechaDesde = this.moment(new Date()).toDate();
		this.fechaDesde.setDate(this.fechaDesde.getDate() - 7);
		this.fechaHasta = this.moment(new Date()).toDate();
	}

	limpiarData() { 
		delete this.data;
		delete this.dataFilter;
	}

	editarPrefactura(item) {

		this.setStoredData();

		if(item.IdTipoOrigenPrefactura === 1){
			this.$state.go('prefacturacion.ambulatorio.new', {
				esNuevo: false,
				id: item.IdOrigenPrefactura,
				idAmbito: this.ORIGEN_PREFACTURA.LISTADO_PREFACTURACION
			});
		}
		else{
			this.AlertaService.NewWarning("No esta implementado para el tipo de origen de prefactura especificado");
		}
		
	}
	// #endregion

	// #region --------------------------------------- STORAGE ---------------------------------------
	
	setStoredData() {
		var revaluacionPrefacturaStorage = {

			mutual: this.mutual,
			planMutual: this.planMutual,
			fechaDesde: this.fechaDesde,
			fechaHasta: this.fechaHasta,
			sucursal: this.sucursal,
			servicio: this.servicioMedico,
			prefacturable: this.prefacturable
		};
		this.PrefacturaAmbulatorioStorageHelperService.setStorageObj(this.keyPrefacturaStorage, revaluacionPrefacturaStorage);
	}

	getStoredData() {
        var vm = this;

        if (this.PrefacturaAmbulatorioStorageHelperService.existStoredObjects(this.keyPrefacturaStorage)) {
            getData(this.PrefacturaAmbulatorioStorageHelperService.getStorageObj(this.keyPrefacturaStorage));
            this.cleanStorage();
        }

        function getData(stored) {

			vm.mutual = angular.copy(stored.mutual);
			vm.fechaDesde = stored.fechaDesde ? vm.moment(stored.fechaDesde).toDate() : new Date();
			vm.fechaHasta = stored.fechaHasta ? vm.moment(stored.fechaHasta).toDate() : new Date();
			vm.sucursal = stored.sucursal ? stored.sucursal: null;
			vm.servicioMedico = stored.servicio ? stored.servicio: false;
			vm.prefacturable = stored.prefacturable ? stored.prefacturable: null;
			vm.planMutual = angular.copy(stored.planMutual);

        }
    }

    existStorage() {
        let ret = false;
        if (this.PrefacturaAmbulatorioStorageHelperService.existStoredObjects(this.keyPrefacturaStorage)) {
            ret = true;
        }
        return ret;
    }

    cleanStorage() {
        this.PrefacturaAmbulatorioStorageHelperService.cleanStorage(this.keyPrefacturaStorage);
    }
	
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RevaluacionPrefacturaListController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RevaluacionPrefacturaListController');
		this.$log.debug('ON');

		this.title.name = "Revaluación";
		this.title.icon = "REFRESH";

		this.paginacion.currentPage = 1;
		this.paginacion.pageSize = 100;
		this.paginacion.totalItems = 0;

		this.fechaDesde.setDate(this.fechaDesde.getDate() - 7);


		if (this.existStorage()) {
			setTimeout(() => {
				this.getStoredData();
				this.buscar();
				this.cleanStorage();
			}, 700);
        }


	}
	// #endregion
}