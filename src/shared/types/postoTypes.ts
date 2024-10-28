export interface PostoType {

    id: number,
    nome: string,
    ambulatorial: string,
    urgenciaEmergencia: string,
    medicosPorTurno: number,
    localidade:{
        id: number,
    }
    sincronizado: boolean;
    idLocal?: string;

}

  