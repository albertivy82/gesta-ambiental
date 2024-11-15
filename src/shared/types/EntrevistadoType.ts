import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface EntrevistadoType {

id: number;
nome: string;
apelido: string;
naturalidade: string;
conheceUcProposta: SimNaoTalvez;
propostaMelhorarArea: string;
    imovel: {
        id:number;
    }
}