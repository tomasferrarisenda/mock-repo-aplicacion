/**
* @author: rbassi
* @description: buscador dinamico de seguros Controller
* @type: Controller
**/
import * as angular from 'angular';
import { IProfesionalesDataService } from '../profesionales/services/ProfesionalesDataService';

export class buscadorDinamicoSegurosController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : '', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 nombreSeguro;
 segurosPorNombre;
 banderaBusqueda = false;
 busquedaSeguro;

 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','ProfesionalesDataService'];
 /**
 * @class buscadorDinamicoSegurosController
 * @constructor
 */
 constructor(
	 private $log: ILogger,
	 private profesionalDataServices: IProfesionalesDataService,
	 ){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class buscadorDinamicoSegurosController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('buscadorDinamicoSegurosController');
 this.$log.debug('ON');
 	this.activate()
 }

activate(){
this.profesionalDataServices.CompaniasObtenerTodos().then((resultadoCompanias) => {
	this.$log.debug("Companias Obtener Todos ",resultadoCompanias);
})

}

 // #endregion
}