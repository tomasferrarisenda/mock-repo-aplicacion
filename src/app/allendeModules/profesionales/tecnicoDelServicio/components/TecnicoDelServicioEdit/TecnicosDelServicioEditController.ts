/**
* @author: crusso
* @description: Tecnicos del Servicio Edit
* @type: Controller
**/
import * as angular from 'angular';
import { ISupportDataService } from "../../../../support/basic/services";
import { ISucursalDataService } from "../../../../support/basic/services/SucursalDataService";
import { TecnicoDelServicioStates } from '../../config';
import { ITecnicoDelServicioDataService } from '../../services/TecnicoDelServicioDataService';
import { FiltroListaTecnico, TecnicoDelServicioDTO } from '../../model';

export class TecnicosDelServicioEditController implements angular.IController {
	static $inject: Array<string> = ['Logger', 'SupportDataService', 'SucursalDataService', 'TecnicoDelServicioDataService', 'ModalService', '$q'];
	/**
	* @class tecnicosDelServicioController
	* @constructor
	*/
	constructor(
		private $log: ILogger,
		private SupportDataService: ISupportDataService,
		private SucursalDataService: ISucursalDataService,
		private TecnicoDelServicioDataService: ITecnicoDelServicioDataService,
		private ModalService: IModalService,
		private $q: angular.IQService
	) { }
	// 	vm = this;

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};

	resolve: any;
	dismiss: any;
	close: any;


	tecnicosDelServicio: TecnicoDelServicioDTO = {};
	nombre: FiltroListaTecnico = {};

	listadoServicio: IEntidadDto[] = [];
	servicioElegido: IEntidadDto = {};

	sucursalServicio: IEntidadDto[] = [];
	sucursalElegida: IEntidadDto = {};

	//Para Guardar información //

	data = {
		tecnicosDelServicio: [],
		tecnicosEdit: {}
	};

	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID


	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	guardar() {
		this.tecnicosDelServicio.IdServicio = (this.servicioElegido && this.servicioElegido.Id) ? this.servicioElegido.Id : 0;
		this.tecnicosDelServicio.NombreServicio = (this.servicioElegido && this.servicioElegido.Id) ? this.servicioElegido.Nombre : 'TODOS';

		this.tecnicosDelServicio.IdSucursal = (this.sucursalElegida && this.sucursalElegida.Id) ? this.sucursalElegida.Id : 0;
		this.tecnicosDelServicio.NombreSucursal = (this.sucursalElegida && this.sucursalElegida.Nombre) ? this.sucursalElegida.Nombre : 'TODOS';
		// if(this.servicioElegido === null){
		// 	this.tecnicosDelServicio.IdServicio = 0;
		// }
		// else{ 
		// 	this.tecnicosDelServicio.IdServicio = this.servicioElegido.Id;
		// }

		this.TecnicoDelServicioDataService.guardar(this.tecnicosDelServicio).then((result) => {
			if (result.IsOk) {
				this.ModalService.success("Se ha guardado el técnico del servicio.");
				this.close({ $value: this.tecnicosDelServicio });
			}
			else {
				this.ModalService.warning("Verifique por favor. " + result.Message);
			}
		});
	}



	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


	/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class tecnicosDelServicioController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('TecnicosDelServicioEditController');
		this.$log.debug('ON');
		this.activate();
	}

	activate() {
		// console.log("Muestro el Id:", this.resolve.idTecnicoDelServicio);
		this.title.name = this.resolve.idTecnicoDelServicio ? 'Modificar Técnicos del Servicio' : 'Nuevo Técnico del Servicio';
		this.title.icon = this.resolve.idTecnicoDelServicio ? 'EDIT' : 'NEW';

		this.obtenerTecnicoDto().then((tecnico) => {
			//llamo los datos en el input nombre
			this.tecnicosDelServicio = tecnico;

			this.SupportDataService.getAllServicioMedico().then((servicios) => {
				this.listadoServicio = servicios;

				for (let i = 0; i < this.listadoServicio.length; i++) {
					if (this.listadoServicio[i].Id === this.tecnicosDelServicio.IdServicio) {
						this.servicioElegido = this.listadoServicio[i];
						break;
					}
				}
			});

			this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
				this.sucursalServicio = sucursales;

				for (let i = 0; i < this.sucursalServicio.length; i++) {
					if (this.sucursalServicio[i].Id === this.tecnicosDelServicio.IdSucursal) {
						this.sucursalElegida = this.sucursalServicio[i];
						break;
					}
				}
			});
		});
	}

	obtenerTecnicoDto() {
		var def = this.$q.defer();
		if (this.resolve.idTecnicoDelServicio) {
			this.TecnicoDelServicioDataService.getOne(this.resolve.idTecnicoDelServicio).then((tecnico) => {
				def.resolve(tecnico);
			});
		}
		else {
			this.TecnicoDelServicioDataService.nuevoTecnico().then((tecnico) => {
				def.resolve(tecnico);
			});
		}
		return def.promise;
	}
	// #endregion
}