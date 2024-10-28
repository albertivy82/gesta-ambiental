import { EscolaType } from "../../shared/types/EscolaType"
import { realmInstance } from "./databaseService"

export const salvarEscolas = (escolas: EscolaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                escolas.forEach(escola => {
                    const escolaRealm = realmInstance.objects('Escola').filtered(`id == ${escola.id}`)[0];

                    if (escola.sincronizado && escolaRealm && escola.idLocal == '') {
                        console.log('Atualizando escola existente:', escola);
                        const escolaPadrao = {
                            ...escola,
                            localidade: escola.localidade.id,
                        };

                        realmInstance.create('Escola', escolaPadrao, true);
                    } else {
                        const escolaPadrao = {
                            ...escola,
                            localidade: escola.localidade.id,
                        };

                        realmInstance.create('Escola', escolaPadrao, true);
                    }
                });
            });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};


export const getEscolas = (localidadeId:number): EscolaType[]=>{

    const query = `localidade == ${localidadeId}`;

    const escolasRealm = realmInstance.objects<EscolaType>('Escola').filtered(query).slice();

    const escolasLimpas = JSON.parse(JSON.stringify(escolasRealm));

    return escolasLimpas as EscolaType[];

}

export const getEscolasDessincronizadas = (localidade: number): EscolaType[] => {

    const query = `localidade == ${localidade} and sincronizado == false`;

    const escolasQueue = realmInstance.objects<EscolaType>('Escola').filtered(query).slice();

    const cleanedQueue = JSON.parse(JSON.stringify(escolasQueue));

    return cleanedQueue as EscolaType[];
};

export const apagarEscolaQueue = (escolaIdLocal: string) => {
    try {
        realmInstance.write(() => {
           
            const query = `idLocal == "${escolaIdLocal}"`;
            const escolaAExcluir = realmInstance.objects<EscolaType>('Escola').filtered(query);

            if (escolaAExcluir.length > 0) {
                realmInstance.delete(escolaAExcluir);
            } 
        });
    } catch (error) {
        console.error(`Erro ao excluir escola da fila com idLocal ${escolaIdLocal}:`, error);
    }
};

