
export interface ServicosComunicacaoInput {
    
    tipoServicoComunicacao: string;
    operadoraServicoComunicacao: string;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}