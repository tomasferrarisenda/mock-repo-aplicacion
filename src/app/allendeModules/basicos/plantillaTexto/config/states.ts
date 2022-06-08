/**
* @author: aminoldo
* @description: Plantillas de Textos
* @type: States
**/
import * as angular from 'angular';

const states = [
    {
        name: 'basicos.plantillaTexto',
        url: '/PlantillaTexto',
        template: '<ui-view><sa-loading></sa-loading></ui-view>',
    },
    {
        name: 'basicos.plantillaTexto.list',
        url: '/List',
        template: '<sa-plantilla-texto-list></sa-plantilla-texto-list>'
    },
    {
        name: 'basicos.plantillaTexto.edit',
        url: '/Edicion',
        template: '<sa-plantilla-texto-edit></sa-plantilla-texto-edit>',
        params: {
            propositoEdit : {}
        }
    }
]


const redirects = [
    { from: '/Basicos/PlantillaTexto', to: '/Basicos/PlantillaTexto/List' }
];

export class BasicosPlantillaTextoStates {

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