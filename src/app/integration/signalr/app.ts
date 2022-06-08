/**
* @author: drobledo
* @description: Integracion de sirnalr
* @type: Module
**/
import * as angular from 'angular';
import 'ms-signalr-client';
import 'angular-signalr-hub';
// import DataService from './services/DataService';

const IntegrationSignalRModule = angular.module('integration.signalr', [
	'SignalR'
])
.run(runMethod);
// DataService.init(IntegrationSignalRModule)
runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
 $log = $log.getInstance('IntegrationSignalR');
 $log.info('ON.-');
}
export = IntegrationSignalRModule;