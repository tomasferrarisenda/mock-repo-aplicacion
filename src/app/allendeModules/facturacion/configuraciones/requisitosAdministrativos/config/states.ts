/**
* @author: aminoldo
* @description: Requisitos Administrativos
* @type: States
**/
import * as angular from 'angular';

const states = [
    {
        name: 'facturacion.configuraciones.requisitosAdministrativos',
        url: '/RequisitosAdministrativos',
        template: '<sa-requisitos-administrativos-list></sa-requisitos-administrativos-list>',
        data : {
			idPermiso: 213
		}
    }
];

const redirects = [
    // { from: 'component', to: 'ModuleName' }
];

export class FacturacionRequisitosAdministrativosStates {

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