/**
* @author: ppautasso
* @description: controller para selecclionar el consultorio medico
* @type: Controller
**/
import * as angular from 'angular';
import { IConsultorioDataService } from '../../services';

export class SeleccionarConsultorioMedicoModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	IdSucursal;
	salasEspera;
	salaEspera;

	consultorios;
	consultorioColumns: Array<any> = [];

	consultorioSeleccionado;
	// #endregion


	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'SupportDataService', 'ConsultorioDataService', 'AlertaService'];
	/**
	* @class SeleccionarConsultorioMedicoModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private supportDataService, private consultorioDataService: IConsultorioDataService, private AlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose) {
		this.close({ $value: pClose });
	}

	seleccionarConsultorioCheck(consultorio) { 
		this.cerrar(consultorio.row);
	}

	buscarSalaDeEsperaPorSucursal() { 
		this.loading = true;
        this.supportDataService.obtenerSalasXSucursal(this.IdSucursal)
        .then( (pResultObtenerSalaEspera) => {
			this.$log.debug('pResultObtenerSalaEspera', pResultObtenerSalaEspera);
			this.loading = false;
            this.salasEspera = angular.copy(pResultObtenerSalaEspera)
        }, (pError) => {
			this.$log.error('pError', pError);
			this.loading = false;
        });
	}
	
	changeSalaEspera() { 
		if (this.salaEspera && this.salaEspera.Id) { 
			this.loading = true;
			this.consultorioDataService.obtenerPorSalaParaSeleccion(this.salaEspera.Id)
			.then( (pResultObtenerConsultorioXSala) => {
				this.$log.debug('pResultObtenerConsultorioXSala', pResultObtenerConsultorioXSala);
				this.loading = false;
				
				this.consultorios = angular.copy(pResultObtenerConsultorioXSala);
				this.setColumns();
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
		}
		
	}

	setColumns(){
        this.consultorioColumns = [
            {
                label: "Nombre",
                field: "Nombre",
                order: 1
			},
			{
                label: "Sala",
                field: "NombreSala",
                order: 2
            }];
	}

	selectInternado(row){
		this.$log.debug('rowSelect',row);
		row.row.classRow = 'color-aquaorange-turno';
		row.row.selected = true;
		this.limpiarRowClass(row.row);
		this.consultorioSeleccionado = row.row;
	}

	limpiarRowClass(rowSelected){
		angular.forEach(this.consultorios, (row) => {
			if(rowSelected.Id !== row.Id){
				row.classRow = '';
				row.selected = false;
			}
		});
	}

	seleccionarConsultorio(){
		if(this.consultorios){
			let _consultorio = this.consultorios.find(x => x.selected === true);
			if(_consultorio) this.cerrar(_consultorio);
			else this.showSeleccionarConsultorio();
		}else this.showSeleccionarConsultorio();
	}

	showSeleccionarConsultorio(){
		this.AlertaService.NewWarning("Debe seleccionar un consultorio");
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class SeleccionarConsultorioMedicoModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('SeleccionarConsultorioMedicoModalController');
		this.$log.debug('ON');

		this.IdSucursal = angular.copy(this.resolve.IdSucursal);
		this.buscarSalaDeEsperaPorSucursal();
	}
	// #endregion
}