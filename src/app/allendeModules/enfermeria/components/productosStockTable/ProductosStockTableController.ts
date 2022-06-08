/**
* @author: ppautasso
* @description: Controller para productos stock table
* @type: Controller
**/
import * as angular from 'angular';
import { IEnfermeriaCommonLogicService } from '../../services';

export class ProductosStockTableController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    data;
    titulogrid;
    btnClick;
    clickMenuAgregarProducto;

    paginacion = {
        currentPage: 0,
        pageSize: 0,
        totalItems: 0,
    }

    filterSeleccion: any;

    filterData: Array<any> = [];

    filterBuscarProducto = "";
    filterBuscarPresentacion = "";

    filtroSoloSeleccionados: boolean = false;
    filtroSoloFaltantes: boolean = true;

    dataSelected: any = {};
    menuOptions: any;
    tipoAccion;

    deposito;
    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$filter', 'ModalService', 'AlertaService', 'EnfermeriaCommonLogicService'];
    /**
    * @class ProductosStockTableController
    * @constructor
    */
    constructor(private $log: ILogger, private $filter, private ModalService: IModalService, private AlertaService: IAlertaService,
        private EnfermeriaCommonLogicService: IEnfermeriaCommonLogicService) {
    }

    // #endregion

    // #region /* ----------------------------------------- PAGINATION ----------------------------------------- */


    getPage(filtroSeleccionados, filtroProdFalta) {

        if (this.data && this.data.length) {

            var begin = ((this.paginacion.currentPage - 1) * this.paginacion.pageSize);
            var end = begin + this.paginacion.pageSize;

            if (filtroSeleccionados && filtroProdFalta) {

                this.filterData = this.data.filter(x => x.Nombre.includes(this.filterBuscarProducto) &&
                    x.Presentacion.includes(this.filterBuscarPresentacion) && x.selected === this.filtroSoloSeleccionados && x.StockActual < x.StockNormal);

            } else if (filtroSeleccionados && !filtroProdFalta) {

                this.filterData = this.data.filter(x => x.Nombre.includes(this.filterBuscarProducto) &&
                    x.Presentacion.includes(this.filterBuscarPresentacion) && x.selected === this.filtroSoloSeleccionados);
            }

            else if (!filtroSeleccionados && filtroProdFalta) {

                this.filterData = this.data.filter(x => x.Nombre.includes(this.filterBuscarProducto) &&
                    x.Presentacion.includes(this.filterBuscarPresentacion) && x.StockActual < x.StockNormal);

            } else if (!filtroSeleccionados && !filtroProdFalta) {

                this.filterData = this.$filter('filter')
                    (this.data, {
                        Nombre: this.filterBuscarProducto,
                        Presentacion: this.filterBuscarPresentacion
                    });
            }

            this.paginacion.totalItems = this.filterData.length;
            this.filterSeleccion = angular.copy(this.filterData);
            this.filterData = this.filterData.slice(begin, end);

        } else { delete this.filterData; }
    }

    pageChanged() {
        if (this.filtroSoloSeleccionados) {
            this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
        }
        else {
            this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
        }
    }
    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    btnOk() {
        if (this.getDataSelected().length > 0) {
            this.btnClick({
                pObject: this.getDataSelected()
            })
        } else {
            this.AlertaService.NewWarning("Debe seleccionar al menos un producto");
        }
    }

    getDataSelected() {
        if (this.data && this.data.length)
            return this.data.filter(x => x.selected === true);
        else return false;
    }

    clickRow(row) {

        this.data.find(x => x.IdStockeable === row.IdStockeable).selected = !this.data.find(x => x.IdStockeable === row.IdStockeable).selected;
        // if (this.filtroSoloSeleccionados) {
        //     this.getPage(true, this.filtroSoloFaltantes);
        // }
        // else {
        //     this.getPage(false, this.filtroSoloFaltantes);
        // }
        this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
    }

    btnClean() {

        let _selected = this.getDataSelected();
        angular.forEach(_selected, (item) => {
            item.selected = false;
        });

        this.filtroSoloSeleccionados = false;
        this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
        
    }

    // #endregion

    // #region /* ----------------------------------------- SUPPORT ----------------------------------------- */
    setearSeleccionados() {
        if (this.dataSelected)
            this.dataSelected = angular.copy(this.getDataSelected());
    }

    changeFiltroSoloSeleccionados() {
        if (this.filtroSoloSeleccionados) {
            this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
        }
        else {
            this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
        }
    }

    changeFiltroSoloFaltantes() {
        if (this.filtroSoloFaltantes) {
            this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
        }
        else {
            this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
        }
    }

    seleccionarTodosLosProductos(){
        if (this.filterSeleccion && this.filterSeleccion.length){
            this.filterSeleccion.forEach(element => {
                element.selected = true;
            });

            this.data.forEach(item => {
                if(this.filterSeleccion.find(x => x.Id == item.Id))
                item.selected = true;
            });

            this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
        }
    }

    // #endregion

    // #region /* ----------------------------------------- CONTEXT MENU ----------------------------------------- */

    inicializarMenuOptions() {
        this.menuOptions = [
            {
                text: 'Agregar producto a la Lista',
                displayed: (modelValue) => {

                    if (this.tipoAccion) {
                        if (modelValue.row.selected !== true) {
                            return true;
                        }
                    }
                    return false;
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.$log.debug('agregarProducto', $itemScope.row);
                    // this.dataSelected.push($itemScope.row);
                    // evento para agregar items
                    this.clickMenuAgregarProducto({
                        pObject: $itemScope.row
                    })
                    this.clickRow($itemScope.row);

                }
            },
            {
                text: 'Ver Movimientos del producto',
                displayed: (modelValue) => {
                    return true;
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.$log.debug('ver movimiento del producto', $itemScope.row);
                    this.EnfermeriaCommonLogicService.openMovimientosHistoricosPorProducto($itemScope.row, this.deposito.Id);
                }
            },
            {
                text: 'Seleccionar Todos',
                displayed: (modelValue) => {
                    return true;
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.$log.debug('Seleccionar todos', $itemScope.row);
                    this.seleccionarTodosLosProductos();
                }
            }
        ];
    }

    // #endregion


    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class ProductosStockTableController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('ProductosStockTableController');
        this.$log.debug('ON');
        this.inicializarMenuOptions();
    }


    $onChanges(change) {
      
        console.log("change data ProductosStockTableController");
        if (change.data) {
            if (!change.data.isFirstChange() && change.data.currentValue) {
                this.paginacion.currentPage = 1;
                this.paginacion.pageSize = 10;
                if(this.data.filter(x => x.StockActual < x.StockNormal)){
                    this.filtroSoloFaltantes = false;
                }
                this.getPage(this.filtroSoloSeleccionados, this.filtroSoloFaltantes);
            }
            if(!change.data.currentValue){
                this.filtroSoloSeleccionados = false;
            }
        }

        if (change.dataSelected) {
            if (!change.dataSelected.isFirstChange() && change.dataSelected.currentValue) {
                this.$log.debug('data selected change', change.dataSelected.currentValue);
            }
        }
    }

    // #endregion
}