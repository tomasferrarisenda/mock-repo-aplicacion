/**
* @author: rbassi
* @description: controller modal documentosRecepcion
* @type: Controller
**/
import * as angular from 'angular';
import { IRecepcionTurnosDataService } from '../../../recepcionTurnos/services/RecepcionTurnosDataService';
import { IAdministradorDocumentoDataService } from '../../../basicos/documentos/services/AdministradorDocumentoDataService';

//import { IAdministradorDocumentoDataService } from '../../../services/AdministradorDocumentoDataService';
export class DocumentosRecepcionController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..

	resolve: any;
	docAsociado: any ;
	documentos: any;
	extensionesArchivos: any;
	selectorvisible: any;
	idEntidadContenedoraDocumentos: number = 0;
	idTipoEntidadContenedoraDocumentos: number = 0;
	loading: any = false;
	url: any;
	documentosAsociados: any;
	close: any;
	tipoDocumentoSelect: IEntidadDto[] = [];
	tipoDocumentoElegido: IEntidadDto = {}

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> =  ['Logger', 'moment', '$q', 'AlertaService','$stateParams','RecepcionTurnosLogicService', 'ModalService','RecepcionTurnosDataService','AdministradorDocumentoDataService'];
	/**
	* @class documentosRecepcionController
	* @constructor
	*/
	constructor(

		private $log: ILogger,
		private moment,
		private $q,
		private AlertaService: IAlertaService,
        private $stateParams,
        private RecepcionTurnosLogicService, 
        private ModalService,
        private RecepcionTurnosDataService: IRecepcionTurnosDataService,
        private AdministradorDocumentoDataService: IAdministradorDocumentoDataService,
    ) { }

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class documentosRecepcionController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('DocumentosRecepcionController');
		this.$log.debug('ON');
		this.activate();

	}
	guardar(){
		this.close();
	}

	cambiarTipoDocumento(){
		this.docAsociado.IdTipo = this.tipoDocumentoElegido.Id;
	}

	activate() {

		this.loading = true;
		this.extensionesArchivos = ".pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.csv,.txt,.rtf,.odt,.ods,.odp,.zip,.rar,.html,.xml,.xlsm,.docm,.jpg,.jpeg,.png"
		this.url = "DocumentoAsociado/UploadDocument";
		this.idEntidadContenedoraDocumentos = this.resolve.IdTurno
		this.idTipoEntidadContenedoraDocumentos = 8; // Turno
		 	this.RecepcionTurnosDataService.getNuevoDocumentoAsociadoDto().then((documentoAsociado) => {
				this.docAsociado = documentoAsociado;
				this.docAsociado.IdTipoEntidad = 8; // Entidad 8 = Turno
				this.docAsociado.IdEntidad = this.idEntidadContenedoraDocumentos;
				this.AdministradorDocumentoDataService.ObtenerDocumentosAsociados(this.docAsociado.IdTipoEntidad, this.idEntidadContenedoraDocumentos).then((documentoAsociado) => {
					this.documentosAsociados = documentoAsociado;
				})

				this.RecepcionTurnosDataService.obtenerPorTipoEntidad(8).then((tiposDocumentos) => {
					this.tipoDocumentoSelect = tiposDocumentos;
					this.tipoDocumentoElegido = this.tipoDocumentoSelect[0];
					this.docAsociado.IdTipo =  this.tipoDocumentoElegido.Id;
				});
		 	})
		this.loading = false;
	}

	// #endregion
}	
