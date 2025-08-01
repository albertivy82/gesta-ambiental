import { SimNao } from "../../enums/simNao.enum";


export interface imovelBody {
   
    id: number;
    rua: string;
    numero: string;
    bairro: string;
    referencial: string;
    latitude: string;
    longitude: string;
    areaImovel: number;
    tipoSolo: string;
    vizinhosConfinantes: string;
    situacaoFundiaria: string;
    documentacaoImovel: string;
    limites: string;
    linhasDeBarco: string;
    pavimentacao: string;
    iluminacaoPublica: SimNao | "" | null;
    equipamentosUrbanos: string;
    espacosEsporteLazer: string;
    programaInfraSaneamento: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}





