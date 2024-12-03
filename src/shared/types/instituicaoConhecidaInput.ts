// InstituicaoConhecida.ts
export interface InstituicaoConhecidaInput {
    
    nome: string;
    atividades: string;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
