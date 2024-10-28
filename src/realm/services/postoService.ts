import { PostoType } from "../../shared/types/postoTypes";
import { realmInstance } from "./databaseService";

export const salvarPostos = (postos: PostoType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                postos.forEach(posto => {
                    const postoRealm = realmInstance.objects('Posto').filtered(`id == ${posto.id}`)[0];

                    if (posto.sincronizado && postoRealm && posto.idLocal == '') {
                        console.log('Atualizando posto existente:', posto);
                        const postoPadrao = {
                            ...posto,
                            localidade: posto.localidade.id,
                        };

                        realmInstance.create('Posto', postoPadrao, true);
                    } else {
                        const postoPadrao = {
                            ...posto,
                            localidade: posto.localidade.id,
                        };

                        realmInstance.create('Posto', postoPadrao, true);
                    }
                });
            });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};


export const getPostos=(localidade:number): PostoType[] =>{

    const query = `localidade == ${localidade}`;

    const postosRealm = realmInstance.objects<PostoType>('Posto').filtered(query).slice();

    const postoSimplificado = JSON.parse(JSON.stringify(postosRealm));
    
 return postoSimplificado as PostoType[];
}

export const getPostosDessincronizados = (localidade: number): PostoType[] => {
    const query = `localidade == ${localidade} and sincronizado == false`;
    const postosQueue = realmInstance.objects<PostoType>('Posto').filtered(query).slice();
    const cleanedQueue = JSON.parse(JSON.stringify(postosQueue));

    return cleanedQueue as PostoType[];
};

export const apagarPostoQueue = (postoIdLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${postoIdLocal}"`;
            const postoAExcluir = realmInstance.objects<PostoType>('Posto').filtered(query);

            if (postoAExcluir.length > 0) {
                realmInstance.delete(postoAExcluir);
            }
        });
    } catch (error) {
        console.error(`Erro ao excluir posto da fila com idLocal ${postoIdLocal}:`, error);
    }
};

