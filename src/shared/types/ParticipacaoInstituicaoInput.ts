export interface ParticipacaoInstituicaoInput {
    instituicao: string;
    tipoDeRegistro: string;
    Registro: string;
    morador: {
        id: number;
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
