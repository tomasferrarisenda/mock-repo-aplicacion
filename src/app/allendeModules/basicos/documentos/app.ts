/**
* @author:         pferrer
* @description:    Documentos
* @type:           Module
**/
import * as angular from 'angular';
import { AdministradorDocumentoStates } from './config';
import { AdministradorDocumentoListComponent } from './components/AdministradorDocumentos/AdministradorDocumentosListComponent';
import { AdministradorDocumentoEditComponent } from './components/AdministradorDocumentos/AdministradorDocumentosEditComponent';
import { ListadoDocumentosPrintComponent } from './components/ListadoDocumentacion/ListadoDocumentosPrint';
import { ListadoDocumentosBasicoComponent } from './components/ListadoDocumentacion/ListadoDocumentosBasico/ListadoDocumentosBasicoComponent';
import { ListadoDocumentosAvanzadoComponent } from './components/ListadoDocumentacion/ListadoDocumentosAvanzado/ListadoDocumentosAvanzadoComponent';
import { SelectorEntidadComponent } from './components/TipoEntidad/SelectorEntidadComponent';
import { TipoEntidadComponent } from './components/TipoEntidad/TipoEntidadComponent';
import { AdministradorDocumentoDataService, AdministradorDocumentoLogicService } from './services';

const config: fw.IConfig[] = [
	AdministradorDocumentoStates
];

const components: fw.IComponent[] = [
	AdministradorDocumentoListComponent,
	AdministradorDocumentoEditComponent,
	ListadoDocumentosBasicoComponent,
	ListadoDocumentosAvanzadoComponent,
	TipoEntidadComponent,
	SelectorEntidadComponent,
	ListadoDocumentosPrintComponent
];

const services: fw.IService[] = [
	AdministradorDocumentoDataService,
	AdministradorDocumentoLogicService
];

export const AdministradorDocumentosModule = angular.module('basicos.documentos', []);

config.forEach(c => c.init(AdministradorDocumentosModule));
components.forEach(c => c.init(AdministradorDocumentosModule));
services.forEach(s => s.init(AdministradorDocumentosModule));

// Run
AdministradorDocumentosModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Basicos.Documentos');
	$log.debug('ON.-');
}