/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de Exportation
 * @type:			Service
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Exportation', Exportation);

		Exportation.$inject = ['Logger'];
		
		function Exportation ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('Exportation');
			// $log.debug('ON.-');

			class Exportation {
				label: string;
				items : Array<any> = [];

				constructor(data) {
					this.label = data.label;					// Label de filtro
					this.items = data.items;					// Lista de posible exportacione
				}

				public static build (data) : Exportation {
					// Valido que existe items y tenga contenido, sino seteo vacio 
					if (!data.items || !data.items.length) {
						data.items = [];
					}
					return new Exportation(data);
				}
	
				public getItems() {
					return this.items;
				}
	
				public addItem(pItem) {
					this.items.push(pItem);
				}
	
				public isValid() : boolean {
					return true;
				}
			}

			return Exportation;
		}
	};

	return module;

})();