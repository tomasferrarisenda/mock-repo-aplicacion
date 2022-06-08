/**
* @author: aminoldo		
* @description: controller enfermeria Upa
* @type: Controller
**/
import * as angular from 'angular';
import { IEnfermeriaDataService } from '../../services/EnfermeriaDataService';
import { ICuestionarioService } from '../../../support/cuestionario/services/CuestionarioService';

export class EnfermeriaUpaController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Gestión de UPA por Internado',
		icon: 'List' 
	};

	sucursal: any = {};
	piso: any = {};
	sector: any = {};
	deposito: any = {};
	listaUpa: any;


	columnasTabla = [
		{
			label: "Numero Internado",
			field: "NumeroInternado",
			order: 1,
		},
		{
			label: "Paciente",
			field: "Paciente",
			order: 2
		},
		{
			label: "Habitación",
			field: "Habitacion",
			order: 3
		},
		{
			label: "Cama",
			field: "Cama",
			order: 4
		},
		{
			label: "Upa Realizado",
			field: "UpaRealizado",
			order: 5,
			classCell: 'UpaRealizadoColor'
		},
		{
			label: "Valor UPA",
			field: "ValorUpa",
			order: 6
		},
		{
			label: "Usuario Modifica",
			field: "UsuarioUpa",
			order: 7
		}];
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'EnfermeriaDataService', '$state', 'AlertaService','CuestionarioService'];
	/**
	* @class EnfermeriaUpaController
	* @constructor
	*/
	constructor(private $log: ILogger, private EnfermeriaDataService: IEnfermeriaDataService, private $state,
		private AlertaService: IAlertaService, private CuestionarioService: ICuestionarioService) {

	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	buscar() {

		if(this.sector && this.sector.Id){
			this.EnfermeriaDataService.obtenerInternacionesPorSectorListaUpa(this.sector.Id)
			.then(listadoUpa => {
				this.listaUpa = angular.copy(listadoUpa);
				angular.forEach(this.listaUpa, (upa)=>{
					upa.UpaRealizado = (upa.TieneValorUpa) ? "SI" : "NO";
					upa.UpaRealizadoColor = (upa.TieneValorUpa) ? 'color-verde-turno' : 'color-rojo-turno';
				});
	
				this.$log.debug('obtenerInternacionesPorSectorListaUpa ', listadoUpa);
			})
		}else {
			return this.AlertaService.NewWarning("Debe seleccionar un sector para realizar una búsqueda.");
		}
	
	}

	limpiarFiltros(){
		this.sucursal = "";
		this.piso = "";
		this.sector = "";
		delete this.listaUpa;
	}

	asginarUpa(internado){
		let _extraInfo = internado.row.Paciente + " - Num. Int: " + internado.row.NumeroInternado + " - Habitación: " + internado.row.Habitacion + 
		" - Cama: " + internado.row.Cama; 
		this.CuestionarioService.NewCuestionario(2,1,internado.row.Id, _extraInfo)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.buscar();
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class NameController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaUpaController');
		this.$log.debug('ON');
		
	}
	// #endregion
}