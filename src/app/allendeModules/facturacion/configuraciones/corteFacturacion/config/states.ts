/**
* @author: crusso
* @description: Corte de Facturación
* @type: States
**/
import * as angular from 'angular';

const states = [
    {
        name: 'facturacion.configuraciones.corteFacturacion',
        url: '/corteFacturacion',
        template: '<sa-corte-facturacion-list></sa-corte-facturacion-list>',
        data : {
			idPermiso: 260
		}
    }
];

const redirects = [
    // { from: 'corte-facturacion-list', to: 'corteFacturacion' }
];

export class corteFacturacionStates {

    static init(ngModule: angular.IModule) {
        ngModule.config(statesConfig);

        statesConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
        function statesConfig($urlRouterProvider, $stateProvider) {

            for (let i = 0; i < redirects.length; i++) {
                //urlRouterProvider.when(redirects[i].from, redirects[i].to);
            }

            for (let i = 0; i < states.length; i++) {
                $stateProvider.state(states[i]);
            }
        }
    }
}