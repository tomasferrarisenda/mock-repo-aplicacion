/**
* @author: ppautasso
* @description: controllera
* @type: Controller
**/
import * as angular from 'angular';
import { IEspecialidadMedicaDataService } from '../../../../basicos/especialidades/gestion/services/EspecialidadMedicaDataService';

export class PrestacionesPorRecursoYServicioModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	loading: boolean = false;
	dismiss;
	close;
	resolve;
	// mas propiedades ..

	private _sucursal: any;
	public get sucursal(): any {
		return this._sucursal;
	}
	public set sucursal(v: any) {
		this._sucursal = v;
		if(v){
			this.buscar();
		}
	}


	servicio;
	recurso;
	entidad;
	entidadNombre;

	prestacionesDelServicio;
	prestacionesDelRecurso;

	columnasTablaServicio = [
		{
			label: "Id",
			field: "Id",
			order: 1,
		},
		{
			label: "Nombre",
			field: "Nombre",
			order: 2,
		}];

	columnasTablaRecurso = [
		{
			label: "Id",
			field: "Id",
			order: 1,
		},
		{
			label: "Nombre",
			field: "Nombre",
			order: 2,
		}];
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'PrestacionGestionDataService', 'EspecialidadMedicaDataService'];
	/**
	* @class PrestacionesPorRecursoYServicioModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private PrestacionGestionDataService, private EspecialidadMedicaDataService:IEspecialidadMedicaDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	buscar() {
		this.loading = true;

		let _obtenerPorSucursal;
		let _obtenerPorSucursalRecurso;

		if(this.entidad === 1){

			_obtenerPorSucursal = this.PrestacionGestionDataService.obtenerPorServicioEnSucursal(this.sucursal.Id, this.servicio.Id);
			_obtenerPorSucursalRecurso = this.PrestacionGestionDataService.obtenerPorRecursoServicioSucursal(this.recurso.IdTipoRecurso,
				this.recurso.Id, this.servicio.Id, this.sucursal.Id);

			this.title.name = "Prestaciones de " + this.servicio.Nombre + " y " + this.recurso.Nombre;
			this.entidadNombre = "Prestaciones";
	
		}else if(this.entidad === 2){

			_obtenerPorSucursal = this.EspecialidadMedicaDataService.obtenerPorServicioEnSucursal(this.sucursal.Id, this.servicio.Id);
			_obtenerPorSucursalRecurso = this.EspecialidadMedicaDataService.obtenerEspecialidadXRecursDelServicioSucursal(this.recurso.Id, this.recurso.IdTipoRecurso, this.sucursal.Id, this.servicio.Id);

				this.title.name = "Especialidades de " + this.servicio.Nombre + " y " + this.recurso.Nombre;
				this.entidadNombre = "Especialidad";

		}


		this.$q.all([_obtenerPorSucursal, _obtenerPorSucursalRecurso])
			.then((pResult) => {
				this.$log.debug('pResultBuscar', pResult);
				this.prestacionesDelServicio = pResult[0];
				this.prestacionesDelRecurso = pResult[1];

				this.loading = false;

			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class PrestacionesPorRecursoYServicioModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('PrestacionesPorRecursoYServicioModalController');
		this.$log.debug('ON');
		this.loading = true;

		this.servicio = this.resolve.Servicio;
		this.recurso = this.resolve.Recurso;
		this.entidad = this.resolve.Entidad;

		this.sucursal = {
			Id: 1,
			Nombre: "NUEVA CBA"
		}
		
		this.loading = false;
	}
	// #endregion
}