/**
* @author: ppautasso
* @description: controller para el selector de usuario generico component
* @type: Controller
**/
import * as angular from 'angular';

export class SelectorUsuarioGenericoController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    usuario;
    loading;
    dataService;
    method;
    placeholder;
    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$timeout'];
    /**
    * @class SelectorUsuarioGenericoController
    * @constructor
    */
    constructor(private $log: ILogger, private $timeout) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    initData(){
        if(!this.placeholder){
            this.placeholder = "Buscar Usuario";
        }
    }

    buscar(pValor){
        this.$log.debug('buscando', this.usuario);
        var sCadena = pValor;
        sCadena = sCadena.toUpperCase();
    }
 
    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class SelectorUsuarioGenericoController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('SelectorUsuarioGenericoController');
        this.$log.debug('ON');

        this.initData()

    }
    // #endregion
}