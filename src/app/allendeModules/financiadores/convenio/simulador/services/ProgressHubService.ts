/**
* @author: Emansilla
* @description: Servicio de hub progress
* @type: Directive
**/
import * as angular from 'angular';

// export interface IProgressHubService {

// }

class ProgressHubService  {
	myHub: any;

	static $inject = ['Logger', '$rootScope', 'Hub', '$timeout'];
	constructor(private $log: ILogger, private rootScope, private hub: any, private timeOut) {
		this.$log = this.$log.getInstance('ProgressHubService');
		this.$log.debug('ON');

		this.myHub = new hub('progressBar', {
		
			//client side methods
			listeners:{
				'updateProgressBar': function (value: string, percentage: number) {
					// console.log('progressBar::updateProgressBar', value,percentage);
					this.rootScope.$apply();
				}
			},
			
			//server side methods
			methods: ['notifyProgress'],
			
			//query params sent on initial connection
			queryParams:{
				'token': 'exampletoken'
			},
	
			//handle connection error
			errorHandler: function(error){
				console.error(error);
			},
			
			//specify a non default root
			//rootPath: '/api
			
			stateChanged: function(state){
				switch (state.newState) {
					case $['signalR'].connectionState.connecting:
						this.$log.debug('SignalR: connecting');
						break;
					case $['signalR'].connectionState.connected:
						this.$log.debug('SignalR: connected');
						break;
					case $['signalR'].connectionState.reconnecting:
						this.$log.debug('SignalR: reconnecting');
						break;
					case $['signalR'].connectionState.disconnected:
						this.$log.debug('SignalR: disconnected');
						break;
				}
			}
		});
	}

	update (value: string, percentage: number) {
		//this.myHub.notifyProgress(value, percentage); //Calling a server method
	}
}

export default class {
 static init(ngModule: angular.IModule) {
 ngModule.factory('ProgressHubService', ProgressHubService)
 }
}