/**
* @author: ppautasso
* @description: controller para el componente tipo modal para seleccionar internados con indicaciones pendientes 
* @type: Controller
**/
import * as angular from 'angular';
import { IFarmaciaIndicacionesMedicasDataService } from '../../services';
import { ICredentialsDataService } from 'core/security';

export class FarmaciaSeleccionarInternadosConIndicacionesPendientesModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	internaciones;
	internacionesColumns: Array<any> = [];
	InfoUser;
	conAlta;

	private _sucursal : any;
	public get sucursal() : any {
		return this._sucursal;
	}
	public set sucursal(v : any) {
		this._sucursal = v;
		if(v){
			this.buscar(v);
		}else {
			//limpiar tabla
			delete this.internaciones;
		}
	}
	
	internadoSeleccionado;

	loading: boolean = false;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'FarmaciaIndicacionesMedicasDataService', 'AlertaService', 'CredentialsDataService'];
	/**
	* @class FarmaciaSeleccionarInternadosConIndicacionesPendientesModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private FarmaciaIndicacionesMedicasDataService:IFarmaciaIndicacionesMedicasDataService,
		private AlertaService, private CredentialsDataService: ICredentialsDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(val){
		this.close({ $value: val });
	}
	
	seleccionarI(interado){
		this.cerrar(interado.row);
	}

	buscar(sucursal){
		
		this.loading = true;

		if (this.conAlta) {

			this.FarmaciaIndicacionesMedicasDataService.obtenerInternacionesConAltaConDevolucionesPendientes(sucursal.Id)
			.then( (resultInternaciones) => {
				this.$log.debug('resultInternacionesConAlta',resultInternaciones);
				this.loading = false;
				for (let index = 0; index < resultInternaciones.length; index++) {
					resultInternaciones[index].AltaMedicaSiNo = (resultInternaciones[index].TieneAltaMedica) ? "SI" : "NO";
				}
				this.internaciones = angular.copy(resultInternaciones);
				this.internaciones.forEach(internacion => {
					if(this.esFechaInvalida(internacion.FechaAltaMedica)) internacion.FechaAltaMedica = "-";
				});
	
				this.setColumns();
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});

		} else { 
			this.FarmaciaIndicacionesMedicasDataService.obtenerInternacionesConDevolucionesPendientes(sucursal.Id)
			.then( (resultInternaciones) => {
				this.$log.debug('resultInternaciones',resultInternaciones);
				this.loading = false;
				for (let index = 0; index < resultInternaciones.length; index++) {
					resultInternaciones[index].AltaMedicaSiNo = (resultInternaciones[index].TieneAltaMedica) ? "SI" : "NO";
				}
				this.internaciones = angular.copy(resultInternaciones);
				this.internaciones.forEach(internacion => {
					if(this.esFechaInvalida(internacion.FechaAltaMedica)) internacion.FechaAltaMedica = "-";
				});
	
				this.setColumns();
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});
		}


	}

	setColumns(){
        this.internacionesColumns =[
            {
                label: "Paciente",
                field: "Paciente",
                order: 1
                
            },
            {
                label: "Numero Documento",
                field: "NumeroDocumento",
                order: 2
            },
            {
                label: "Numero Internado",
                field: "NumeroInternado",
                order: 3
            },
            {
                label: "Numero Afiliado",
                field: "NumeroAfiliado",
                order: 4
            },
            {
                label: "Ubicacion",
                field: "Ubicacion",
                order: 5
            },
            {
                label: "Tiene Alta Medica",
                field: "AltaMedicaSiNo",
                order: 6
			},
			{
                label: "Fecha Alta Medica",
                field: "FechaAltaMedica",
				order: 7,
				format: 'date',
            }
            ];
	}
	
	selectInternado(row){
		this.$log.debug('rowSelect',row);
		row.row.classRow = 'color-aquaorange-turno';
		row.row.selected = true;
		this.limpiarRowClass(row.row);
		this.internadoSeleccionado = row.row;
	}

	limpiarRowClass(rowSelected){
		angular.forEach(this.internaciones, (row) => {
			if(rowSelected.Id !== row.Id){
				row.classRow = '';
				row.selected = false;
			}
		});
	}

	seleccionarInternado(){
		if(this.internaciones){
			let _internado = this.internaciones.find(x => x.selected === true);
			if(_internado) this.cerrar(_internado);
			else this.showSeleccionarInternado();
		}else this.showSeleccionarInternado();
	}

	showSeleccionarInternado(){
		this.AlertaService.NewWarning("Debe seleccionar un internado");
	}

	esFechaInvalida(fecha) {
		let ret = false;
		if (fecha) {
			if (fecha.includes("0001-01-01")) ret = true;
		}
		return ret;
	}
	
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaSeleccionarInternadosConIndicacionesPendientesModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaSeleccionarInternadosConIndicacionesPendientesModalController');
		this.$log.debug('ON');

		//consulto si el endpoint es con alta o sin
		this.conAlta = this.resolve.ConAlta;

		this.title.name = (this.conAlta) ? 'Seleccionar Internados con Alta con Indicaciones Pendientes' : 'Seleccionar Internados con Indicaciones Pendientes';

		this.InfoUser = this.CredentialsDataService.GetForce();
		this.$log.debug('infouser',this.InfoUser);

		// obtengo las sucursales
		// y seteo si hay una
		if(this.InfoUser.sucursales){
			if(this.InfoUser.sucursales.length > 1){
				// tengo varias sucursales asigno la sucursal nueva cba
				this.sucursal = {
					Id:1,
					Nombre:"NUEVA CBA",
					Color:"color-celeste-sucursales",
					Abreviatura:"N"
				}
			}else {
				// tengo una sola sucursal, por ende la asigno
				this.sucursal = {
					Id:this.InfoUser.sucursales[0].Id,
					Nombre: this.InfoUser.sucursales[0].Nombre
				}
			}
		}

		
		
		
	}
	// #endregion
}