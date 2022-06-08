/**
* @author: ppautasso
* @description: Controller para deposito component
* @type: Controller
**/
import * as angular from 'angular';
import { IDepositoDataService } from '../../../../enfermeria/services';


export class DepositoSelectorController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    deposito;
    sector;
    loading;

    depositosList;
    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', 'DepositoDataService'];
    /**
    * @class DepositoSelectorController
    * @constructor
    */
    constructor(private $log: ILogger, private DepositoDataService: IDepositoDataService) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    buscarDepositoPorSector() {
        this.loading = true;
        this.DepositoDataService.obtenerPorIdSector(this.sector.Id)
            .then((pResponseDeposito) => {

                this.$log.debug('obtenerPorDepositoOk', pResponseDeposito);
                this.depositosList = angular.copy(pResponseDeposito);
                if(this.depositosList && this.depositosList.length && this.depositosList.find(x => x.NombreCorto.includes("Normal"))){
                    this.deposito = this.depositosList.find(x => x.NombreCorto.includes("Normal"));
                }
                this.loading = false;

            }, (pErrorDeposito) => {
                this.$log.error('obtenerPorDepositoError', pErrorDeposito);
                this.loading = false;
            })
    }
    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class DepositoSelectorController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('DepositoSelectorController');
        this.$log.debug('ON');
    }

    $onChanges(change) {
        console.log('change', change);
        if (change.sector) {

            if (!change.sector.isFirstChange() && change.sector.currentValue) {
                this.buscarDepositoPorSector();
            }
        }

    }
    // #endregion
}