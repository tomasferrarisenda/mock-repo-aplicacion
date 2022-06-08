export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ESTADO', {
			ACTIVO : 1,
			NO_ACTIVO : 0
		});

		module.constant('ORIGEN_PREFACTURA', {
			TURNO : 1,
			TURNO_EDICION : 2,
			LISTADO_PREFACTURACION: 3
		});

		module.constant('ESTADO_PREFACTURA', {
			NINGUNO : 0,
            PENDIENTE_FACTURAR : 1,
            PARCIALMENTE_FACTURADO : 2,
            FACTURADO : 3,
            ANULADO : 4,
            BORRADOR : 5
		});

		module.constant('TIPO_PREFACTURABLE', {
			CODIGO_NOMENCLADOR : 1,
			MEDICAMENTO : 2,
			DESCARTABLE : 3
		});
		
		module.constant('ESTADO_ITEM_PREFACTURADO', {
			PENDIENTE : 1,
			PENDIENTE_REVISAR : 2,
			LISTO_PARA_FACTURAR : 3,
			FACTURADO : 4,
			ANULADO : 5
		});

		module.constant('TIPO_AFILIADO', {
			NOEXISTE : 0,
			OBLIGATORIO : 1,
			VOLUNTARIO : 2,
			AMBOS : 3
		});

		module.constant('TIPO_PARTICIPANTE',{
			ESPECIALISTA : 1,
			AYUDANTE : 2,
			ANESTESISTA : 3,
			DERECHOS : 4,
			GLOBAL : 9
		});

		module.constant('SEXO', {
			MASCULINO : 4,
			FEMENINO : 5
		});

		module.constant('TIPO_PROFESIONAL_SOLICITANTE', {
			NINGUNO : 0,
			INTERNO : 1,
			EXTERNO : 2
		});

		module.constant('TIPO_REQUISITO', {
			NINGUNO : 0,
            LOGICO : 1,
            TEXTOINFORMATIVO : 2,
            TEXTOAINGRESAR : 3,
            NUMEROAINGRESAR : 4
		});
	};
	return module;
})();