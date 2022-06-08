/**
* @author: ppautasso
* @description: controller para selector de producto component
* @type: Controller
**/
import * as angular from 'angular';
import { ITipoStockeableDataService, IStockeableDataService, IEnfermeriaCommonLogicService } from '../../../services';

export class SelectorProductoController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    limpiar;
    // loading: boolean = false;
    // mas propiedades ..
    tipoStockeableList;
    tipoStockeable;
    loading = false;

    codigoStockeable;
    stockeableNombre;

    stockeable;
    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', 'TipoStockeableDataService', 'StockeableDataService', '$timeout',
        'EnfermeriaCommonLogicService', 'AlertaService'];
    /**
    * @class SelectorProductoController
    * @constructor
    */
    constructor(private $log: ILogger, private TipoStockeableDataService: ITipoStockeableDataService,
        private StockeableDataService: IStockeableDataService, private $timeout,
        private EnfermeriaCommonLogicService: IEnfermeriaCommonLogicService,
        private AlertaService: IAlertaService) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    buscarStockeables(levantarBusqueda) {

        if (this.tipoStockeable) {
            if (this.codigoStockeable) {

                if (this.stockeable) {

                    // consulto si lo que estoy buscando ya existe como modelo
                    if (this.stockeable.Codigo != this.codigoStockeable) {
                        this.busquedaOk();

                    }
                } else this.busquedaOk();

            } else {
                if (levantarBusqueda)
                    this.openBusquedaProducto();
            }
        } else {
            if (this.codigoStockeable)
                this.AlertaService.NewWarning("Debe seleccionar un tipo de producto para buscar");
        }
    }

    busquedaOk() {
        this.loading = true;
        this.StockeableDataService.obtenerPorTipoYCodigo(this.tipoStockeable.Id, this.codigoStockeable)
            .then(pResponse => {

                this.$log.debug('StockeableDataService obtenerPorTipoYCodigoOK', pResponse);
                this.loading = false;
                if (pResponse) {
                    this.stockeable = angular.copy(pResponse);
                    this.stockeableNombre = this.stockeable.Nombre + " | " + this.stockeable.Presentacion || '';
                } else {
                    //levanto modal de busqueda
                    this.openBusquedaProducto();

                }
            }, (pError) => {
                this.loading = false;
                this.$log.error('StockeableDataService obtenerPorTipoYCodigoOK', pError);
            })
    }

    openBusquedaProducto() {
        this.EnfermeriaCommonLogicService.openBuscadorDeProductos(this.tipoStockeableList, this.tipoStockeable)
            .then((pProducto) => {
                this.$log.debug('productoSeleccionado', pProducto);
                if (pProducto) {
                    this.stockeable = angular.copy(pProducto);
                    this.tipoStockeable = this.tipoStockeableList.find(x => x.Id == pProducto.IdTipoStockeable);
                    this.stockeableNombre = angular.copy(pProducto.Nombre + ' | ' + pProducto.Presentacion);
                    this.codigoStockeable = angular.copy(pProducto.Codigo)

                }
            }, (pErrorProducto) => {
                this.$log.error('productoSeleccionadoError', pErrorProducto);
            });
    }


    limpiarModel() {
        delete this.stockeable;
        delete this.tipoStockeable;
        delete this.stockeableNombre;
        delete this.codigoStockeable;
    }
    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class SelectorProductoController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('SelectorProductoController');
        this.$log.debug('ON');
        this.TipoStockeableDataService.obtenerTodos()
            .then((pResponse) => {
                this.$log.debug('TipoStockeableDataService obtenerTodosOK', pResponse);
                this.tipoStockeableList = angular.copy(pResponse);

                this.tipoStockeable = Object.assign({}, this.tipoStockeableList[0]);
            }, (pError) => {
                this.$log.error('TipoStockeableDataService obtenerTodosError', pError);
            })
    }

    // #endregion
}