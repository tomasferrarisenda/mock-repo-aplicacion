
/**
 * @author:			Pablo Pautasso y Mansilla
 * @description:	
 * @type:			Service
 **/

import * as angular from 'angular';

export class StateHelperService implements IStateHelperService{
	private _statesQuotes = [];

	constructor(private $log, private $state, private $stateParams, private DEFAULT) {
		this.$log = this.$log.getInstance('StateHelperService');
		this.$log.debug('ON.-');
	}

	/* Quote states */

	public getCurrentState() {
		return this.$state.current;
	}

	public initialize() : Array<any>{
		var states = this._statesQuotes || [];
		return states;
	}

	public getLastState() : any{
		var statesQuotes = this.initialize();

		var largo = statesQuotes.length;

		if (largo){
			return statesQuotes[largo - 1];
		}
		return;
	}

	public getPrevState() {
		var statesQuotes = this.initialize();

		var largo = statesQuotes.length;

		if (largo){
			return statesQuotes[largo - 2];
		}
		return;
	}

	public addStateToQuote() {
		var state = this.$state.current;

		if (state.name === this.DEFAULT) {
			this.resetStates();
		}

		var statesQuotes = this.initialize();
		if (state.data && state.data.save) {

			if (statesQuotes.length <= 20) {

				var lastState = this.getLastState();

				if(statesQuotes.length === 0 || state.name !== lastState.state.name){

					statesQuotes.push({
						state: state,
						params: angular.copy(this.$stateParams)
					});
				}

			} else {
				this.$log.error('addStateToQuote cola > 5 superada');
			}
		}
	}

	public goToPrevState(pParams?) {
		var statesQuotes = this.initialize();

		var state = this.getPrevState();
		statesQuotes.pop();

		
		if (state) {
			var params = state.params;

			if (params) {
				angular.extend(params, pParams);
			} else {
				params = pParams;
			}
			
			if (params)
				this.$state.go(state.state.name, params);
			else
				this.$state.go(state.state.name);
		} else {
			this.$state.go(this.DEFAULT);
		}
	}

	public resetStates() {
		this._statesQuotes = [];
	}

	static seviceFactory($log, $state, $stateParams, DEFAULT) {
		return new StateHelperService($log, $state, $stateParams, DEFAULT);
	}
}
StateHelperService.seviceFactory.$inject = ['Logger', '$state', '$stateParams', 'ROUTER_DEFAULT'];

export default class {
	public static init(ngModule: any) {
		ngModule.factory('StateHelperService', StateHelperService.seviceFactory);
	}
}