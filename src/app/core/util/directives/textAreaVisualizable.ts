/**
 * @author 			emansilla y ppautasso
 * @description 	description
 */
import * as angular from 'angular';

class Directive implements angular.IDirective {
	restrict = 'A';
	// replace = false;
	// priority = 1000;
	// terminal = true;	
	// require = 'ngModel';
	// templateUrl = 'myDirective.html';
	// replace = true;

	constructor(private $log, private $compile, private ModalService: IModalService) {
	}

	public link (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrl: any) {
		this.$log.debug('saTextAreaVisualizable linked');

		
		//element.attr('context-menu', 'opciones');
		// element.removeAttr("sa-textarea-visualizable"); //remove the attribute to avoid indefinite loop
		// element.removeAttr("data-sa-textarea-visualizable"); //also remove the same attribute with data- prefix in case users specify data-common-things in the html
		
		// scope.opciones = {
		// 	text: 'Prueba 1',
		// 	click:  ($itemScope, $event, modelValue, text, $li) => {
		// 		this.$log.debug('Editar Observacion Para Turnos');
		// 	}
		// };
		element.dblclick((data) => {
			this.$log.debug('click textarea', data);
			this.openModal(data.target);
			
		});

		// this.$compile(element)(scope);
	}

	openModal(value){

		this.ModalService.textAreaModal({
			tituloModal: "Observacion",
			icon: "VIEW",
			guardarOption: false,
			data: value.value,
			readOnly: true,
			sizeModal: "lg"
		});
	}

	static directiveFactory(): angular.IDirectiveFactory {
		const directive = ($log: angular.ILogService, $compile, modalService: IModalService) => new Directive($log, $compile, modalService);
		directive.$inject = ['$log','$compile', 'ModalService'];
		return directive;
	}
}

export class TextAreaVisualizable {
	static init(ngModule: angular.IModule) {
		ngModule.directive('saTextareaVisualizable', Directive.directiveFactory());
	}
}