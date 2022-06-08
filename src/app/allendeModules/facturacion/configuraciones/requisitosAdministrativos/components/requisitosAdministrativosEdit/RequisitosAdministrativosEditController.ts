/**
* @author: aminoldo
* @description: Controller del Edit
* @type: Controller
**/
import * as angular from 'angular';
import { IRequisitoAdministrativoDataService } from '../../services';
import { requisitoAdministrativoDto } from '../../model';



export class RequisitosAdministrativosEditController implements angular.IController {
    static $inject: Array<string> = ['Logger', 'RequisitoAdministrativoDataService', '$q','ModalService'];
    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

    resolve: any;
    dismiss: any;
    close: any;

    requisitoAdministrativo: requisitoAdministrativoDto = {};
    tipoDeUnidadRequisito: IEntidadDto[] = [];
    tipoRequisitoElegido: IEntidadDto = {};
    

    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID

    /**
    * @class RequisitosAdministrativosEditController
    * @constructor
    */
    constructor(private $log: ILogger,
        private requisitoAdministrativoDataService: IRequisitoAdministrativoDataService,
        private $q: angular.IQService,
        private ModalService:IModalService,
    ) { }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */



    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class NameController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }

//Nota: agregar en el component.ts del editar siguientes codigo
//para q exporte estas funciones
    // bindings: {
    //     resolve:'<',
    //     close:'&',
    //     dismiss:'&'
    // }



    guardar(){
        this.requisitoAdministrativo.IdTipoRequisitoAdministrativo = this.tipoRequisitoElegido.Id;
        this.requisitoAdministrativo.NombreTipoRequisitoAdministrativo = this.tipoRequisitoElegido.Nombre;

        this.requisitoAdministrativoDataService.Guardar(this.requisitoAdministrativo).then((result)=>{
            if(result.IsOk){
                this.ModalService.success("Se ha guardado el Requisito Administrativo.")
                this.close({$value:this.requisitoAdministrativo});
            }
            else{
                this.ModalService.warning("Verifique por favor." + result.Message);
            }
        });
        
    }

    $onInit() {
        this.$log = this.$log.getInstance('RequisitosAdministrativosEditController');
        this.$log.debug('ON');

        this.activate()
    }
    // #endregion


    activate() {
        // console.log("Muestro el Id:", this.resolve.idRequisito);
        this.title.name = this.resolve.idRequisito ? 'Modificar Requisito Administrativo' : 'Nuevo Requisito Administrativo';
        this.title.icon = this.resolve.idRequisito ? 'EDIT' : 'NEW';


        this.obtenerUnidadDto().then((unidad) => {

            this.requisitoAdministrativo = unidad;

            this.requisitoAdministrativoDataService.TiposDeRequisitos().then((tipos) => {
                this.tipoDeUnidadRequisito = tipos;

                this.tipoRequisitoElegido = this.tipoDeUnidadRequisito[0];
                for (let i = 0; i < this.tipoDeUnidadRequisito.length; i++) {
                    if (this.tipoDeUnidadRequisito[i].Id === this.requisitoAdministrativo.IdTipoRequisitoAdministrativo) {
                        this.tipoRequisitoElegido = this.tipoDeUnidadRequisito[i];
                        break;
                    }

                }
            });
        });
    }



    obtenerUnidadDto() {
        var def = this.$q.defer();
        if (this.resolve.idRequisito) {
            this.requisitoAdministrativoDataService.getOne(this.resolve.idRequisito).then((unidad) => {
                def.resolve(unidad);
            });
        }
        else {
            this.requisitoAdministrativoDataService.nuevoRequisitoAdministrativo().then((unidad) => {
                def.resolve(unidad);
            });
        }
        return def.promise;

    }



}