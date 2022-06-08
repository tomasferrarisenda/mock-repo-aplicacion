/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

const states = [
    {
        name: 'stock.reportes',
        url: '/Reportes',
        template: '<ui-view><sa-loading></sa-loading></ui-view>'
    },
    {
        name: 'stock.reportes.auditoriaIndicaciones',
        url: '/AuditoriaIndicaciones',
        template: '<sa-auditoria-indicaciones></sa-auditoria-indicaciones>'
    }
]

const redirects = [
    { from: '/Stock/Reportes', to: '/Stock/Reportes/AuditoriaIndicaciones' }
]

export class StockReportesStates {
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