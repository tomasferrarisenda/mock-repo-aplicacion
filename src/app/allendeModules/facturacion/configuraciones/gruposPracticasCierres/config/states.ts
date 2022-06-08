/**
* @author: rbassi
* @description: gruposcierres practicas states
* @type: States
**/
import * as angular from 'angular';

const states = [
 {
 name: 'facturacion.configuraciones.grupoPracticasParaCierre',
 url: '/GruposPracticasParaCierre',
 template: '<sa-grupos-practicas-cierres-list></sa-grupos-practicas-cierres-list>'
 }
];

const redirects = [
 // { from: 'component', to: 'gruposPracticasCierres' }
];

export class gruposPracticasCierresStates {

	static init(ngModule: angular.IModule) {
        ngModule.config(statesConfig);

        statesConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
        function statesConfig($urlRouterProvider, $stateProvider) {



            for (let i = 0; i < states.length; i++) {
                $stateProvider.state(states[i]);
            }
        }
    }
}