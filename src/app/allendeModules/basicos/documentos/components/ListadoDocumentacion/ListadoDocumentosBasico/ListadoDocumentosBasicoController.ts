/**
* @author: pfe
* @description: lala
* @type: Controller
**/
import * as angular from 'angular';
import {IAdministradorDocumentoDataService} from '../../../services/AdministradorDocumentoDataService';


export class ListadoDocumentosBasicoController implements angular.IController {

    static $inject: Array<string> = ['Logger', 'ModalService', '$scope', 'AdministradorDocumentoDataService'];

    constructor(private $log: ILogger, private ModalService : IModalService, private $scope, private AdministradorDocumentoDataService : IAdministradorDocumentoDataService) {
    }

    url: any;
    data: any
    botonSubir: any;
    fileExtensions: any;
    idTipoEntidadContenedoraDocumentos: any;
    idEntidadContenedoraDocumentos: any;

    docAsociado: string = '';
    selectorVisible : boolean = false;

    modelValue?: any;

    set model(listado: any){
        this.modelValue = listado;
    }

    get model(): any{
        return this.modelValue;
    }

    /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

    descargarDocumento(idDocumento, row) {
        this.AdministradorDocumentoDataService.DescargarDocumentoAsociadoPorId(idDocumento, row.NombreArchivo);
    }

    onUploadDone(data) {
        if (data.IsOk === true) {
            this.selectorVisible = false;
            this.AdministradorDocumentoDataService.ObtenerDocumentosAsociados(this.idTipoEntidadContenedoraDocumentos, this.idEntidadContenedoraDocumentos)
                .then((documentosDto) => {
                    this.model = documentosDto;
                    this.model.Rows.sort();
                    this.ModalService.success("La importación del documento ha finalizado.");
                });
        } else {
            this.ModalService.warning('Verifique por favor. ' + data.Message);
        }
    }

    onUploadFailed(data) {
        this.ModalService.warning('Verifique por favor. ' + data.Message);
    }

    borrarDocumento(fila) {
        this.ModalService.confirm('¿Desea eliminar el documento "' + fila.NombreArchivo + '"?',
        (pResult) => {
            if (pResult) {
                this.AdministradorDocumentoDataService.EliminarDocumento(fila.Id).then((result) => {
                    if (result.IsOk === false) {
                        this.ModalService.warning("Verifique por favor. " + result.Message);
                    }
                    else {
                        for (var i = this.model.Rows.length - 1; i >= 0; i--) {
                            if (this.model.Rows[i].Id == fila.Id) {
                                this.model.Rows.splice(i, 1);
                                this.ModalService.success("El documento ha sido eliminado.");
                                break;
                            }
                        }
                    }
                })
                .catch((pError) => {
                    this.ModalService.error("Error en el servidor.", pError.message);
                    return;
                });
            }
        });
    }

    togglearSelector() {
        this.selectorVisible = !this.selectorVisible;
    }

    /* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

    $onInit() {
        this.$log = this.$log.getInstance('ListadoDocumentosBasicoController');
        this.$log.debug('ON');
        this.registrarEscucha();
    }

    registrarEscucha(){
        this.$scope.$on('uploadDone', (event, data) => {
            this.onUploadDone(data);
        });
    
        this.$scope.$on('uploadFailed',(event, data) => {
            this.onUploadFailed(data);
        });
    }

    // #endregion
}