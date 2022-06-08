import searchCie10Template = require('../templates/searchCie10.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('Cie10LogicService', Cie10LogicService);

		Cie10LogicService.$inject = ['$log', '$uibModal', 'ModalService'];

		function Cie10LogicService ($log, $uibModal, ModalService) {
			
			const service = {
				searchCie10 : searchCie10
			};
			return service;

			function searchCie10 () {
				return $uibModal.open({
					template: searchCie10Template,
					controller: 'SearchCie10Controller',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg'
				}).result;
			}
		}
	};

	return module;

})();