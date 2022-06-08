/**
* @author: ppautasso
* @description: controller para componente del buscador de internado
* @type: Controller
**/
import * as angular from 'angular';
import { IInternacionesDataService } from '../../services';

export class BuscadorInternadoPorSectorController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    internado;
    loading;
    internadoList;
    placeholder;
    sector;
    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', 'InternacionesDataService'];
    /**
    * @class BuscadorInternadoPorSectorController
    * @constructor
    */
    constructor(private $log: ILogger, private InternacionesDataService: IInternacionesDataService) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    buscarInternadosPorSector() {

        this.loading = true;
        this.InternacionesDataService.obtenerInternacionesPorSector(this.sector.Id)
            .then((pResponseInternados) => {

                this.$log.debug('obtenerInternacionesPorSectorOk', pResponseInternados);
                this.internadoList = angular.copy(pResponseInternados);
                this.loading = false;

            }, (pErrorInternadoss) => {
                this.$log.error('obtenerInternacionesPorSectorError', pErrorInternadoss);
                this.loading = false;
            })
    }

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class BuscadorInternadoPorSectorController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('BuscadorInternadoPorSectorController');
        this.$log.debug('ON');
    }

    $onChanges(change) {
        console.log('change', change);
        if (change.sector) {

            if (!change.sector.isFirstChange() && change.sector.currentValue) {
                this.buscarInternadosPorSector()
            }
        }

    }
    // #endregion
}