/**
* @author: Crusso
* @description: Gestion Recepción
* @type: States
**/
import * as angular from 'angular';

const states = [
    {
        name: 'basicos.gestionRecepcion',
        url: '/GestionRecepcion',
        template: '<ui-view><sa-loading></sa-loading></ui-view>',
    },

    {
        name: 'basicos.gestionRecepcion.list',
        url: '/List',
        template: '<sa-gestion-recepcion-list></sa-gestion-recepcion-list>',
        data : {
			idPermiso: 263
		}
    },

    {
        name: 'basicos.gestionRecepcion.edit',
        url: '/Edicion',
        template: '<sa-gestion-recepcion-edit></sa-gestion-recepcion-edit>',
        params: {
            gestionEdit: {} // Este vALOR debe ser identico que el Edit Controller
      
        }
    },

    
];

const redirects = [
    { from: '/Basicos/GestionRecepcion', to: '/Basicos/GestionRecepcion/List' }
];

export class gestionRecepcionStates {

    static init(ngModule: angular.IModule) {
        ngModule.config(statesConfig);

        statesConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
        function statesConfig($urlRouterProvider, $stateProvider) {

            for (let i = 0; i < redirects.length; i++) {
                $urlRouterProvider.when(redirects[i].from, redirects[i].to);
            }

            for (let i = 0; i < states.length; i++) {
                $stateProvider.state(states[i]);
            }
        } 
    }
}