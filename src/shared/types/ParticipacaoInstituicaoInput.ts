export interface ParticipacaoInstituicaoInput {
    instituicao: string;
    tipoDeRegistro: string;
    registro: string;
    morador: {
        id: number;
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
