/**
* @author: Aldo Minoldo
* @description: Controller del Editar
* @type: Controller
**/
import * as angular from 'angular';
import { IUnidadArancelariaDataService } from '../../services';
import { FiltroUnidadArancelariaDto, unidadArancelariaDto } from '../../model';


export class UnidadesArancelariasEditController implements angular.IController {
	static $inject: Array<string> = ['Logger', 'UnidadArancelariaDataService', 'ModalService', '$q'];
	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	resolve: any;
	dismiss: any;
	close: any;

	tiposDeUnidadArancelarias: IEntidadDto[] = [];
	tipoUnidadElegida: IEntidadDto = {};

	unidadArancelaria: unidadArancelariaDto = {};
	nombre: FiltroUnidadArancelariaDto = {};

	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};



	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID

	/**
	* @class UnidadesArancelariasEditController
	* @constructor
	*/
	constructor(private $log: ILogger,
		private unidadArancelariaDataService: IUnidadArancelariaDataService,
		private ModalService: IModalService,
		private $q: angular.IQService,
	) { }

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	guardar() {
		this.unidadArancelaria.IdTipoUnidadArancelaria = this.tipoUnidadElegida.Id;
		this.unidadArancelaria.NombreTipoUnidadArancelaria = this.tipoUnidadElegida.Nombre;

		this.unidadArancelariaDataService.Guardar(this.unidadArancelaria).then((result) => {
			if (result.IsOk) {
				this.ModalService.success("Se ha guardado la Unidad Arancelaria.");
				this.close({ $value: this.unidadArancelaria });
			}
			else {
				this.ModalService.warning("Verifique por favor. " + result.Message);
			}
		});
	}



	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class UnidadesArancelariasEditController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('UnidadesArancelariasEditController');
		this.$log.debug('ON');

		this.activate()//llamo al metodo activate para reusar el cbo UnidadArancelaria del menu principal
		//y llamar todos los metodos del activate
	}

	//declaro en el metod activate acciones del modulo edit
	activate() {
		// console.log("Muestro el Id:", this.resolve.idUnidad);
		this.title.name = this.resolve.idUnidad ? 'Modificar Unidad Arancelaria' : 'Nueva Unidad Arancelaria';
		this.title.icon = this.resolve.idUnidad ? 'EDIT' : 'NEW';

		// this.unidadArancelariaDataService.obtenerTipoUnidadArancelaria().then(
		// 	(TipoUnidadArancel) => {
		// 		this.tiposDeUnidadArancelarias = TipoUnidadArancel;
		// 		this.tipoUnidadElegida = this.tiposDeUnidadArancelarias[0];//pongo el cbo en 1º posicion
		// });
		this.obtenerUnidadDto().then((unidad) => {

			this.unidadArancelaria = unidad;
			
			this.unidadArancelariaDataService.obtenerTipoUnidadArancelaria().then((tipos) => {
			this.tiposDeUnidadArancelarias = tipos;

			this.tipoUnidadElegida = this.tiposDeUnidadArancelarias[0];
			for (let i = 0; i < this.tiposDeUnidadArancelarias.length; i++) {
				if (this.tiposDeUnidadArancelarias[i].Id === this.unidadArancelaria.IdTipoUnidadArancelaria) {
					this.tipoUnidadElegida = this.tiposDeUnidadArancelarias[i];
					break;
				}
			}});
		});
	}

	obtenerUnidadDto() {
		var def = this.$q.defer();
		if (this.resolve.idUnidad) {
			this.unidadArancelariaDataService.getOne(this.resolve.idUnidad).then((unidad) => {
				def.resolve(unidad);
			});
		}
		else {
			this.unidadArancelariaDataService.nuevaUnidadArancelaria().then((unidad) => {
				def.resolve(unidad);
			});
		}
		return def.promise;

	}


}


