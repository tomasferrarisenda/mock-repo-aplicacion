/**
 * @author:			Ezequiel Mansilla
 * @description:	Constantes para Utils
 * @type:			Constant
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [CONSTANT] Códigos de teclas.
		ngModule.constant('KEY_CODES', {
			ESC: 27,
			SPACE: 32,
			ENTER: 13,
			TAB: 9,
			BACKSPACE: 8,
			SHIFT: 16,
			CTRL: 17,
			ALT: 18,
			CAPSLOCK: 20,
			NUMLOCK: 144,
			DOT: 46,
			F5 : 116,
			PLUS: 43
		});		
	};
	return module;

})();