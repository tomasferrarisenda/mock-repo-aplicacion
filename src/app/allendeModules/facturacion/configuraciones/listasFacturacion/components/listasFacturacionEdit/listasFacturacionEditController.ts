/**
* @author: rbassi
* @description: listas facturacion controller
* @type: Controller
**/

import * as angular from 'angular';
import { IlistasFacturacionDataService } from '../../services';
import { ListaFacturacionEditDTO } from 'src/app/allendeModules/facturacion/configuraciones/listasFacturacion/models/listasFacturacionEditDTO';
import { itemListaFacturacionDTO } from 'src/app/allendeModules/facturacion/configuraciones/listasFacturacion/models';
import { IListasFacturacionLogicService } from '../../services/listasFacturacionLogicService';
export class listasFacturacionEditController implements angular.IController {


	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Nueva Lista de Facturación', // Desde la vista (HTML) se accede con vm.title.name
		icon: 'NEW' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	nombreListaEdit: string = "";
	descripcionListaEdit: string = "";
	tipoPrefacturable: IEntidadDto = {};
	tipoPrefacturablesCombo: IEntidadDto[] = [];
	listaFacturacionEdit: ListaFacturacionEditDTO = {};
	resolve: any;
	selectorVisible: any;


	//listaOla: GridViewDto<any>;


	static $inject: Array<string> = ['Logger', '$state', 'listasFacturacionDataService',
		'ModalService', 'AlertaService', '$stateParams', 'ListasFacturacionLogicService', '$scope'];
	/**
	* @class listasFacturacionListController
	* @constructor
	*/
	constructor(
		private $log: ILogger,
		private $state,
		private listasFacturacionDataService: IlistasFacturacionDataService,
		private ModalService: IModalService,
		private AlertaService: IAlertaService,
		private $stateParams,
		private listasFacturacionLogicService: IListasFacturacionLogicService,
		private $scope
	) {
	}

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancelar() {
		this.$state.go('facturacion.configuraciones.listaFacturacion.list');
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class listasFacturacionEditController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('listasFacturacionEditController');
		this.$log.debug('ON');
		this.activate();
	}


	ValidarGuardar() {

		this.listaFacturacionEdit.IdTipoPrefacturableDeLaLista = (this.tipoPrefacturable) ? this.tipoPrefacturable.Id : 0;
		this.listaFacturacionEdit.NombrePrefacturableDeLaLista = (this.tipoPrefacturable) ? this.tipoPrefacturable.Nombre : "";

		this.listasFacturacionDataService.validarGuardar(this.listaFacturacionEdit).then((result) => {
			if (result.IsOk) {
				this.ModalService.success("Se ha guardado la Lista de Facturación.")
				this.$state.go('facturacion.configuraciones.listaFacturacion.list');
			}
			else {
				this.ModalService.warning("Verifique por favor." + result.Message);
			}
		});
	}

	onUploadDone(data) {
		this.listaFacturacionEdit.Items = data.Items;

		if (data.Items.Rows.some(element => !element.Codigo)) {
			this.ModalService.warning("Por favor verifique. Algunos items importados no son correctos.");
		}
		else {
			this.ModalService.success("La importación ha finalizado.");
		}
	}


	selectorImportacion() {
		this.selectorVisible = !this.selectorVisible;
	}

	exportarExcel() {
		this.listasFacturacionDataService.ExportarExcel(this.$stateParams.IdListaEdit);
	}


	Guardar() {

		this.listaFacturacionEdit.IdTipoPrefacturableDeLaLista = (this.tipoPrefacturable) ? this.tipoPrefacturable.Id : 0;
		this.listaFacturacionEdit.NombrePrefacturableDeLaLista = (this.tipoPrefacturable) ? this.tipoPrefacturable.Nombre : "";

		this.listasFacturacionDataService.guardar(this.listaFacturacionEdit).then((result) => {
			if (result.IsOk) {
				this.ModalService.success("Se ha guardado la Lista de Facturación.")
				this.$state.go('facturacion.configuraciones.listaFacturacion.list');
			}
			else {
				this.ModalService.warning("Verifique por favor." + result.Message);
			}
		});
	}


	eliminarItem(fila: any, index: number) {
		this.ModalService.confirm('¿Desea eliminar la lista ' + fila.Nombre + '?', (pResult) => {
			if (pResult) {
				this.listaFacturacionEdit.Items && this.listaFacturacionEdit.Items.Rows ? this.listaFacturacionEdit.Items.Rows.splice(index, 1) : null;
				this.AlertaService.NewSuccess("La lista ha sido eliminada.");
			}
		});
	}

	editarItemListaFacturacion(item: any, index: number) {
		this.listasFacturacionLogicService.editaritemListaFacturacion(item, this.tipoPrefacturable && this.tipoPrefacturable.Id ? this.tipoPrefacturable.Id : 0)
			.then((itemListaFacturacion) => {
				if (item.IdPrefacturable) {
					// Actualizar item
					if (this.listaFacturacionEdit.Items && this.listaFacturacionEdit.Items.Rows) {
						for (let i = 0; i < this.listaFacturacionEdit.Items.Rows.length; i++) {
							if (this.listaFacturacionEdit.Items.Rows[i].IdPrefacturable === item.IdPrefacturable) {
								this.listaFacturacionEdit.Items.Rows[i] = itemListaFacturacion;
								break;
							}
						}
					}
				} else {
					// agregar nuevo registro item
					if (this.listaFacturacionEdit.Items && this.listaFacturacionEdit.Items.Rows) {
						this.listaFacturacionEdit.Items.Rows.push(itemListaFacturacion);
					}
				}
			});
	}

	activate() {
		this.$scope.$on('uploadDone', (event, data) => {
			this.onUploadDone(data);
		});

		this.title.name = this.$stateParams.IdListaEdit ? 'Modificar Lista de Facturación' : 'Agregar Lista de Facturación';
		this.title.icon = this.$stateParams.IdListaEdit ? 'EDIT' : 'NEW';

		this.listasFacturacionDataService.getAllTipoPrefacturable().then((TipoPrefacturables) => {
			this.tipoPrefacturablesCombo = TipoPrefacturables;
		})

		this.listasFacturacionDataService.obtenerListaFacturacionDtoParaEdicion(this.$stateParams.IdListaEdit).then((ListaFacturacionEdicion) => {

			this.listaFacturacionEdit = ListaFacturacionEdicion;
			for (let i = 0; i < this.tipoPrefacturablesCombo.length; i++) {
				if (this.tipoPrefacturablesCombo[i].Id === this.listaFacturacionEdit.IdTipoPrefacturableDeLaLista) {
					this.tipoPrefacturable = this.tipoPrefacturablesCombo[i];
				}
			}
		})
	}
	// #endregion
}




