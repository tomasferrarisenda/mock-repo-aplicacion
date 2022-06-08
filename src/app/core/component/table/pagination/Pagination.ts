/**
 * @author:			Ezequiel Mansilla
 * @description:	Pagination model
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Pagination', Pagination);

		Pagination.$inject = ['Logger'];
		
		function Pagination ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('Pagination');
			// $log.debug('ON.-');

			class Pagination {
				type: string;
				currentPage: string;
				pageSize: string;
				totalItems: string;

				static possibleTypes : Array<string> = ['interna', 'externa'];

				constructor(data) {
					this.type = data.type;
					this.currentPage = data.currentPage;
					this.pageSize = data.pageSize;
					this.totalItems = data.totalItems;
				}

				public static build (data) {
					data.pageSize = (angular.isUndefined(data.pageSize)) ? 10 : data.pageSize;
					data.currentPage = (angular.isUndefined(data.currentPage)) ? 1 : data.currentPage;
					return new Pagination(data);
				}

				private static checkType(pType) : boolean {
					return Pagination.possibleTypes.indexOf(pType) !== -1;
				}
	
				public isInterna() : boolean {
					return this.type === 'interna';
				}

				public isExterna(): boolean {
					return this.type === 'externa';
				}
	
				public isValid() : boolean {
					var pag = this;
	
					if (!pag.type) {
						$log.error('El atributo tipo (type) es requerido.',pag, Pagination.possibleTypes);
						return false;
					}
	
					if (!Pagination.checkType(pag.type)) {
						$log.error('El atributo tipo (type) no es valido', pag, Pagination.possibleTypes);
						return false;
					}
	
					if (!pag.pageSize) {
						$log.error('El atributo tamaño de pagina (pageSize) no es válido',pag);
						return false;
					}
					return true;
				}
			}

			return Pagination;
		}
	};

	return module;
})();