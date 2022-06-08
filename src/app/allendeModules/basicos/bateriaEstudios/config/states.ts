  /**
* @author: Crusso
* @description: Bateria de Estudios State
* @type: States
**/
import * as angular from 'angular';

const states = [
    {
        name: 'basicos.bateriaEstudios',
        url: '/BateriaEstudios',
        template: '<ui-view><sa-loading></sa-loading></ui-view>',
    },

    {/*List Html*/
        name: 'basicos.bateriaEstudios.list',
        url: '/List',
        template: '<sa-bateria-estudios-list></sa-bateria-estudios-list>'
    },

    {/*Edit Html*/
        name: 'basicos.bateriaEstudios.edit',
        url: '/Edit',
        template: '<sa-bateria-estudios-edit></sa-bateria-estudios-edit>',
        params: {
            bateriaEdit: {} /*Este Parametro lo ulizamos en el List */
      
        }
    },

   
];

const redirects = [
    { from: '/Basicos/BateriaEstudios', to: '/Basicos/BateriaEstudios/List' }
];

export class bateriaEstudiosStates {

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