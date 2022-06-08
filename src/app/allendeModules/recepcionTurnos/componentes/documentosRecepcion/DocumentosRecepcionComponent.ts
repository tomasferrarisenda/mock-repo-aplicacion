/**
* @author: rbassi
* @description: Modal Documentos Turnos
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { DocumentosRecepcionController } from './DocumentosRecepcionController';
const DocumentosRecepcionTemplate = require('./DocumentosRecepcion.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: DocumentosRecepcionTemplate,
 controller: DocumentosRecepcionController,
 controllerAs: 'vm',
 bindings: {
 resolve: '<', // por ser Modal. An object of the modal resolve values
 close: '&', // por ser Modal. A method that can be used to close a modal, passing a result. 
 // Use: Use: {value: myResult}
 dismiss: '&' // por ser Modal. A method that can be used to dismiss a modal, passing a result.
 // Use: {value: myRejectedResult}
 }
}

// Se agrega el componente al módulo pasado por parámetros
export class DocumentosRecepcionComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saDocumentosRecepcion', component);
 }
}	
