/**
* @author: ppautasso
* @description: controller para ver la jerarquia de usuarios
* @type: Controller
**/
import * as angular from 'angular';

export class VerUsuariosACargoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	usuario;
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	supervisor;
	colaboradores;

	Columns;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'UsuarioGestionDataService'];
	/**
	* @class VerUsuariosACargoController
	* @constructor
	*/
	constructor(private $log: ILogger, private UsuarioGestionDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	buscarJerarquia(){
		
		this.loading = true;
		this.UsuarioGestionDataService.obtenerParaMostrarJerarquiaDeUsuarios(this.usuario.Id)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			
			// seteo el supervisor si es que existe
			if(pResult.Supervisor)
			this.supervisor = pResult.Supervisor

			// seteo los colaboradores si es que tiene
			if(pResult.Colaboradores && pResult.Colaboradores.length)
			this.colaboradores = pResult.Colaboradores;
			
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class VerUsuariosACargoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('VerUsuariosACargoController');
		this.$log.debug('ON');

		this.usuario = angular.copy(this.resolve.Usuario);
		this.buscarJerarquia();
		this.setColumns();
	}
	// #endregion

	// #region Tabla colaboradores
	setColumns(){
        this.Columns =[
            {
                label: "Id",
                field: "Id",
                order: 1,
                visible: false
            },
            {
                label: "Legajo",
                field: "Legajo",
                order: 2
            },
            {
                label: "Nombre",
                field: "Nombre",
                order: 3
            }
            ];
	}
	
	// #endregion
}