import { realmInstance } from './databaseService';
import { PescaArtesanalInput } from '../../shared/types/PescaArtesanalInput';
import { PescaArtesanalType } from '../../shared/types/PescaArtesanal';


export const salvarPescaArtesanal = (pescas: PescaArtesanalType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                pescas.forEach(pesca => {
                    const pescaRealm = realmInstance.objects('PescaArtesanal').filtered(`id == ${pesca.id}`)[0];
                    if (pesca.sincronizado && pescaRealm && pesca.idLocal == '') {
                        const pescaPadrao = {
                            ...pesca,
                            benfeitoria: pesca.benfeitoria.id,
                        };
                        realmInstance.create('PescaArtesanal', pescaPadrao, true);
                    } else {
                        const pescaPadrao = {
                            ...pesca,
                            benfeitoria: pesca.benfeitoria.id,
                        };
                        realmInstance.create('PescaArtesanal', pescaPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarPescaArtesanalQueue = (pesca: PescaArtesanalInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const pescaPadrao = {
                    ...pesca,
                    id: Id(),
                    benfeitoria: pesca.benfeitoria?.id,
                };
                realmInstance.create('PescaArtesanal', pescaPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getPescaArtesanal = (benfeitoriaId: number): PescaArtesanalType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const pescas = realmInstance.objects<PescaArtesanalType>('PescaArtesanal').filtered(query).slice();
    return JSON.parse(JSON.stringify(pescas)) as PescaArtesanalType[];
};

export const getPescaArtesanalDessincronizadas = (benfeitoriaId: number): PescaArtesanalType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const pescaQueue = realmInstance.objects<PescaArtesanalType>('PescaArtesanal').filtered(query).slice();
    return JSON.parse(JSON.stringify(pescaQueue)) as PescaArtesanalType[];
};

export const setIdBenfeitoriaFromApiOnPesca = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const pescaQueue = realmInstance.objects('PescaArtesanal').filtered(query);

        if (pescaQueue.length > 0) {
            realmInstance.write(() => {
                pescaQueue.forEach(pescaOrfan => {
                    pescaOrfan.benfeitoria = idBenfeitoriaApi;
                    pescaOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar registros de pesca artesanal:', error);
    }
};

export const apagarPescaArtesanalQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const pescaExcluir = realmInstance.objects<PescaArtesanalType>('PescaArtesanal').filtered(query);
            if (pescaExcluir.length > 0) {
                realmInstance.delete(pescaExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir pesca artesanal da fila:', error);
    }
};
