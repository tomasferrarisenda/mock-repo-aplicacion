export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('OPERADOR_CONDICION', {
			IGUAL: 1,
			DISTINTO : 2,
			DENTRO_DE : 3,
			NO_DENTRO_DE : 4,
			ENTRE : 5,
			NO_ENTRE : 6,
			DENTRO_DE_LISTA : 7,
			NO_DENTRO_DE_LISTA : 8
		});

		module.constant('CONSECUENCIA', {
			PRECIO_FIJO : 1,
			PRECIO_FIJO_DE_LISTA : 2,
			SEGUN_NOMENCLADOR : 3,
			SEGUN_COEFICIENTE : 4,
			INCLUSION : 5,
			IMPORTE : 6,
			PORCENTAJE : 7,
			REQUISITOS_ADMINISTRATIVOS : 8,
			AUTORIZACION : 9,
			REQUIERE_PRESUPUESTO_PREVIO_APROBADO : 10,
			PERMITE_AUTO_RECEPCION : 11
		});

		module.constant('CONSECUENCIA_VALOR', {
			VALOR_IGUAL : 1,
			VALOR_DESDE : 2,
			VALOR_HASTA : 3
		});

		module.constant('TIPO_REQUISITO', {
			NIGUNO : 0,
			LOGICO : 1,
			TEXTO_INFORMATIVO : 2,
			TEXTO_INGRESAR : 3,
			NUMERO_INGRESAR : 4,
			AUTORIZADOR_ONLINE : 5
		});

		module.constant('TIPO_OPERABLE', {
			DIMENSIONABLE : 1,
			LISTA_PREFACTURABLE : 2,
		});
	};
	return module;
})();