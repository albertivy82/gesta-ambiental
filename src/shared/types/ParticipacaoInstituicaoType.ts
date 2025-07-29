
export interface ParticipacaoInstituicaoType {
    id: number;
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
