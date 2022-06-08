declare interface IStateHelperService {
    getCurrentState: () => void;
    initialize: () => Array<any>;
    getLastState: () => any;
	getPrevState: () => any;
    addStateToQuote: () => void;
    /**
     * Vuelve atras un estado
     * Parametro opcional de seteo de parametros
     */
    goToPrevState: (params?) => void;
	resetStates: () => void;
}