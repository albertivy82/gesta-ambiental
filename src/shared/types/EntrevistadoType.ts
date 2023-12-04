import { simNao } from "../../enums/simNaoTalvez.enum";

export interface EntrevistadoType {

id: number;
nome: string;
apelido: string;
naturalidade: string;
conheceUcProposta: simNao;
propostaMelhorarArea: string;
    imovel: {
        id:number;
    }
}