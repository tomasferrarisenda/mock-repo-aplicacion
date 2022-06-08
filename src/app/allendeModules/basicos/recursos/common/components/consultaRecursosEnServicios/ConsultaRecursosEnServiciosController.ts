/**
* @author: ppautasso
* @description: controller para el componente de consulta de recursos en servicio
* @type: Controller
**/
import * as angular from 'angular';
import { IRecursoDataService } from '../../../../../support/basic/services';

export class ConsultaRecursosEnServiciosController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    recursosList;
    columnasList: Array<any> = [];
    dismiss;

    loading: boolean = false;
    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', 'RecursoDataService'];
    /**
    * @class ConsultaRecursosEnServiciosController
    * @constructor
    */
    constructor(private $log: ILogger, private RecursoDataService: IRecursoDataService) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    setColumns(){
        this.columnasList =[
            {
                label: "Recurso",
                field: "Recurso",
                order: 1
                
            },
            {
                label: "Servicio",
                field: "Servicio",
                order: 2
            },
            {
                label: "Sucursal",
                field: "Sucursal",
                order: 3
            }
            ];
    }

    cerrar(){
        this.dismiss();
    }
    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class ConsultaRecursosEnServiciosController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('ConsultaRecursosEnServiciosController');
        this.$log.debug('ON');
        this.setColumns();

        this.loading = true;
        this.RecursoDataService.obtenerTodosConServiciosDondeAtiende()
        .then((pResponse)=>{

            this.$log.debug('obtenerTodosConServiciosDondeAtiendeOK',pResponse);
            this.recursosList = angular.copy(pResponse);
            this.loading = false;

        }, (pError)=>{

            this.$log.error('obtenerTodosConServiciosDondeAtiendeError',pError);
            this.loading = false;
        })
    }
    // #endregion
}