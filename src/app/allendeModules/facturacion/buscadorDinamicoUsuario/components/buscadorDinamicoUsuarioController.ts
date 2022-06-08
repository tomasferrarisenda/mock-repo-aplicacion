/**
* @author: rbassi
* @description: buscador dinamico de usuario
* @type: Controller
**/
import * as angular from 'angular';

export class buscadorDinamicoUsuarioController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	nombreUsuario;
	usuariosPorNombre;
	banderaBusqueda = false;
	busquedaUsuario;
	otroColaborador;


	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger','UsuarioGestionDataService','$scope'];
	/**
	* @class buscadorDinamicoUsuarioController
	* @constructor
	*/
	constructor(
		private $log: ILogger,
		private UsuarioGestionDataService,
		private $scope
		) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class buscadorDinamicoUsuarioController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('buscadorDinamicoUsuarioController');
		this.$log.debug('ON');
		this.$log.debug("this.otroColaborador", this.otroColaborador)
		this.nombreUsuario = this.otroColaborador
	}

	buscarUsuariosPorNombre(){
		//tester si el modelo tiene dos letras
		if (this.nombreUsuario && this.nombreUsuario.length > 1) {

			if (!this.banderaBusqueda) {
				//obtenerUsuariosPorNombre
				this.UsuarioGestionDataService.ObtenerUsuarioConColaboradoresParaLotesPorFiltro(this.nombreUsuario).then((result) => {
					this.usuariosPorNombre = result;
					console.log(this.usuariosPorNombre)	
					this.banderaBusqueda = true
				}) 
			}

		} else if (!this.nombreUsuario) {
			delete this.usuariosPorNombre;
			this.nombreUsuario = "";
			this.banderaBusqueda = false;
		}
	
	}
	limpiarDatos(){
		delete this.usuariosPorNombre;
		this.nombreUsuario = "";
		this.banderaBusqueda = false;
		this.busquedaUsuario  = angular.copy(this.nombreUsuario)
	}

	updateModel(nombreUsuario) {
		if (nombreUsuario) {
			this.busquedaUsuario = angular.copy(nombreUsuario);
			console.log("updateModel", this.nombreUsuario)
			this.banderaBusqueda = false;
		}
	}



	// #endregion
}