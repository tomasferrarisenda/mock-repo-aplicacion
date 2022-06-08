/**
* @author: 
* @description: 
* @type: Controller
**/
import * as angular from 'angular';
import { ICuentaDataService, ICuentaLogicService} from '../../services';
import { FiltroCuentaDto } from './../../model/filtroCuentaDto';

export class FacturacionCuentaListController implements angular.IController {
	// ID
	static $inject: Array<string> = ['Logger', 'CuentaDataService',
		'CuentaLogicService', '$state', 'ModalService', 'AlertaService'];
	// Constructor
	constructor(private $log: ILogger,
		private CuentaDataService: ICuentaDataService,
		private CuentaLogicService: ICuentaLogicService,
		private $state,
		private ModalService: IModalService,
		private AlertaService: IAlertaService) {};

	title = {
		name: 'Listado de Cuentas',
		icon: 'LIST'
	};

	nombre = "";
	codigo : any;
	filtroDto : FiltroCuentaDto = {};
	resultsCuenta: any;
	currentPage = 1;
	

	editarCuenta(idCuenta) {
		this.CuentaLogicService.editarCuenta(idCuenta).then((result) => {
			// console.log("resultado", result);
		});
	}

	volver() { //Boton Volver retroceso al Home
		this.$state.go('homesistemas');
	}

	limpiarFiltros() { // Boton Limpiar
		this.nombre = "";
		this.codigo = 0;
	}

	//Refresca
	reloadPage() {
		this.limpiarFiltros();
		this.activate();
	}

	borrarCuenta(cuenta, indice) {
		this.ModalService.confirm('¿Desea eliminar la cuenta ' + cuenta.Nombre + '?',
		(pResult) => {
			if (pResult) {
				this.CuentaDataService.borrarCuenta(cuenta.Id)
					.then( (result) => {
						if (result.IsOk == false) {
							this.AlertaService.NewWarning("Por favor verifique: " + result.Message);
						}
						else {
							this.AlertaService.NewSuccess("La cuenta ha sido eliminada.");
						}
					})
					.catch( (pError) => {
						this.AlertaService.NewError("Error en el servidor.", pError.message);
						return;
					});
			}
		});
	}

	buscar() {
		if (!this.currentPage) this.currentPage = 1;
		this.buscarPagina({ currentPage: this.currentPage });
	}

	buscarPagina(pPagination) {
		this.currentPage = pPagination.currentPage;
		var currentPage = pPagination.currentPage;
		var pageSize = pPagination.pageSize || 10;

		this.filtroDto.Codigo = this.codigo;
		this.filtroDto.Nombre = this.nombre.toUpperCase();
		this.filtroDto.CurrentPage = currentPage;
		this.filtroDto.PageSize = pageSize;

		this.CuentaDataService.ObtenerCuentasPorFiltro(this.filtroDto).then(
			(cuentas) => {
				this.resultsCuenta = cuentas;
		});
	}

	$onInit() {
		this.$log = this.$log.getInstance('FacturacionCuentasListController ON');
		this.activate();
	}

	activate() {
		this.CuentaDataService.ObtenerFiltroCuentaDto().then((filtroDto) => {
			this.filtroDto = filtroDto;
			this.buscar();
		});
	}
}