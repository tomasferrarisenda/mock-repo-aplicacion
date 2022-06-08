/**
* @author: ppautasso
* @description: controller para modal para buscar internado 
* @type: Controller
**/
import * as angular from 'angular';
import { IInternacionesDataService } from '../../services';
import { FiltroBusquedaInternaciones } from '../../models';

export class BuscadorInternadoModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	loading: boolean = false;
	dismiss;
	close;
	resolve;
	today = new Date();

	filtroBusqueda: FiltroBusquedaInternaciones = {};
	
	numeroInternado;
	tipoFecha;

	fechaDesde = new Date();
	fechaHasta = new Date();
	fechaDesdeMin = new Date();

	nombreYApellidoInternado;
	numeroDocumentoInternado;
	
	internadoSeleccionado;

	internadosList;

	tiposDeFecha: Array<any> = [	
	{Id: 2, Nombre: 'Alta'},
	{Id: 1, Nombre: 'Ingreso'},
	{Id: 3, Nombre: 'Ninguna'}]; 

	tableOption = {
		CurrentPage: 1,
		PageSize: 8
	};
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'InternacionesDataService', 'moment', 'AlertaService'];
	/**
	* @class BuscadorInternadoModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private InternacionesDataService:IInternacionesDataService, private moment, 
		private AlertaService:IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar(){

		this.$log.debug('buscando internado...');
	
		this.filtroBusqueda.NumeroInternado = this.numeroInternado ? angular.copy(this.numeroInternado) : 0;
		this.filtroBusqueda.IdTipoFecha = this.tipoFecha ? angular.copy(this.tipoFecha.Id) : 0;
		this.filtroBusqueda.FechaDesde = this.fechaDesde ? this.moment(this.fechaDesde).format("MM-DD-YYYY") : new Date();
		this.filtroBusqueda.FechaHasta = this.fechaHasta ? this.moment(this.fechaHasta).format("MM-DD-YYYY") : new Date();
		this.filtroBusqueda.NombrePaciente = this.nombreYApellidoInternado ? angular.copy(this.nombreYApellidoInternado) : null;
		this.filtroBusqueda.NumeroDocumento = this.numeroDocumentoInternado ? angular.copy(this.numeroDocumentoInternado) : "";
		this.filtroBusqueda.CurrentPage = angular.copy(this.tableOption.CurrentPage);
		this.filtroBusqueda.PageSize = angular.copy(this.tableOption.PageSize);

		this.loading = true;

		this.InternacionesDataService.obtenerInternacionesPorFiltros(this.filtroBusqueda)
		.then( (internadosOk) => {
			this.$log.debug('internadosOk',internadosOk);
			this.internadosList = angular.copy(internadosOk);
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});

	}

	getPage(pPagination) {
		if (pPagination) {
			this.tableOption.CurrentPage = pPagination.currentPage || 1;
			this.tableOption.PageSize = pPagination.pageSize || 8;
		} else {
			this.tableOption.CurrentPage = 1;
			this.tableOption.PageSize = 8;
		}
		// Guardo la pagina actual
		// vm.filter.currentPage = pPagination.currentPage;
		this.buscar();
	}

	limpiar(){
		delete this.numeroInternado;
		delete this.tipoFecha;
		delete this.fechaDesde;
		delete this.fechaHasta;
		delete this.nombreYApellidoInternado;
		delete this.numeroDocumentoInternado;
		delete this.internadosList;

		setTimeout(() => {
			this.fechaDesde = new Date();
			this.fechaHasta = new Date();
			this.fechaDesdeMin = angular.copy(this.fechaDesde);
			this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);
		});
		
	}

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(val){
		this.close({ $value: val });
	}
	
	seleccionarI(interado){
		this.cerrar(interado.row);
	}

	seleccionarInternado(){
		if(this.internadosList){
			let _internado = this.internadosList.Rows.find(x => x.selected === true);
			if(_internado) this.cerrar(_internado);
			else this.showSeleccionarInternado();
		}else this.showSeleccionarInternado();
	}

	showSeleccionarInternado(){
		this.AlertaService.NewWarning("Debe seleccionar un internado");
	}

	selectInternado(row){
		this.$log.debug('rowSelect',row);
		row.row.classRow = 'color-aquaorange-turno';
		row.row.selected = true;
		this.limpiarRowClass(row.row);
		this.internadoSeleccionado = row.row;
	}

	limpiarRowClass(rowSelected){
		angular.forEach(this.internadosList.Rows, (row) => {
			if(rowSelected.Id !== row.Id){

				row.classRow = '';
				row.selected = false;
			}
		});
	}

	changeTipoFecha(){	
			if(!this.tipoFecha || this.tipoFecha.Id === 3){
				delete this.fechaDesde;
				delete this.fechaHasta;
			}else {
				this.fechaDesde = new Date();
				this.fechaHasta = new Date();
				this.fechaDesde.setDate(this.today.getDate() - 7);
			}
	}

	changeFechaDesde(){
		setTimeout(() => {
			this.fechaDesdeMin = angular.copy(this.fechaDesde);
			this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);
		});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class BuscadorInternadoModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('BuscadorInternadoModalController');
		this.$log.debug('ON');

		delete this.fechaDesde;
		delete this.fechaHasta;

		setTimeout(() => {
			this.fechaDesdeMin = angular.copy(this.fechaDesde);
			this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1)	
		});


		this.loading = true;
		this.InternacionesDataService.obtenerNuevoFiltroBusquedaInternaciones()
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.filtroBusqueda = angular.copy(pResult);
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});

	}
	// #endregion
}