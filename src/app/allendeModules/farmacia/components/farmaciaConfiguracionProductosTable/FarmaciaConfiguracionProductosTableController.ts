/**
* @author: ppautasso
* @description: controller para tabla de configuracion de productos en farmacia
* @type: Controller
**/
import * as angular from 'angular';

export class FarmaciaConfiguracionProductosTableController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    data;
    titulogrid;
    btnClick;
    clickEdit;
    editCantidad;
    delProducto;

    filterData: Array<any> = [];
    filterBuscarProducto;
    filterBuscarPresentacion;

    paginacion = {
        currentPage: 0,
        pageSize: 0,
        totalItems: 0,
    }

    columnasList;

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$filter'];
    /**
    * @class FarmaciaConfiguracionProductosTableController
    * @constructor
    */
    constructor(private $log: ILogger, private $filter) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    getPage() {

        var begin = ((this.paginacion.currentPage - 1) * this.paginacion.pageSize);
        var end = begin + this.paginacion.pageSize;

        this.filterData = this.$filter('filter')
            (this.data, {
                Nombre: this.filterBuscarProducto,
                Presentacion: this.filterBuscarPresentacion

            });
        this.paginacion.totalItems = this.filterData.length;
        this.filterData = this.filterData.slice(begin, end);
    }

    pageChanged() {
        this.getPage();
    }

    btnOk() {
        this.btnClick({
            pObject: null
        })
    }

    editStockNormal(row) {
        this.clickEdit({
            pObject: row.row
        });
    }

    eliminarProducto(row){
        this.delProducto({
            pObject: row.row
        });
    }

    editarCantidadMaxima(row){
        this.editCantidad({
            pObject: row.row
        });
    }

    setColumns() {
        this.columnasList = [
            {
                label: "Codigo",
                field: "Codigo",
                order: 1
            },
            {
                label: "Nombre Producto",
                field: "Nombre",
                order: 2
            },
            {
                label: "Presentación",
                field: "Presentacion",
                order: 3
            },
            {
                label: "Stock Actual",
                field: "StockActual",
                order: 4
            },
            {
                label: "Stock Normal",
                field: "StockNormal",
                order: 5
            },
            {
                label: "Cantidad Maxima Utilizable",
                field: "CantidadMaximaUtilizable",
                order: 6
            }
        ];
    }
    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class FarmaciaConfiguracionProductosTableController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('FarmaciaConfiguracionProductosTableController');
        this.$log.debug('ON');
        this.setColumns();
    }

    $onChanges(change) {
        console.log('change', change);
        if (change.data) {
            if (!change.data.isFirstChange() && change.data.currentValue) {
                this.paginacion.currentPage = 1;
                this.paginacion.pageSize = 10;
                this.getPage();
            }
        }
    }
    // #endregion
}