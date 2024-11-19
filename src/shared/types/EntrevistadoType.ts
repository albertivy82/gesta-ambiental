import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface EntrevistadoType {

id: number;
nome: string;
apelido: string;
naturalidade: string;
conheceUcProposta: SimNaoTalvez| "" | null;
propostaMelhorarArea: string;
imovel: {
    id: number;
};
sincronizado?: boolean;
idLocal?: string;
idFather?:string;
}