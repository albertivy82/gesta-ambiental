import { realmInstance } from './databaseService';
import { FaunaInput } from '../../shared/types/FaunaInput';
import { FaunaType } from '../../shared/types/FaunaType';

export const salvarFauna = (fauna: FaunaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                fauna.forEach(faunaItem => {
                    const faunaRealm = realmInstance.objects('Fauna').filtered(`id == ${faunaItem.id}`)[0];
                    if (faunaItem.sincronizado && faunaRealm && faunaItem.idLocal == '') {
                        const faunaPadrao = {
                            ...faunaItem,
                            benfeitoria: faunaItem.benfeitoria.id,
                        };
                        realmInstance.create('Fauna', faunaPadrao, true);
                    } else {
                        const faunaPadrao = {
                            ...faunaItem,
                            benfeitoria: faunaItem.benfeitoria.id,
                        };
                        realmInstance.create('Fauna', faunaPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarFaunaQueue = (fauna: FaunaInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const faunaPadrao = {
                    ...fauna,
                    id: Id(),
                    benfeitoria: fauna.benfeitoria?.id,
                };
                realmInstance.create('Fauna', faunaPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getFauna = (benfeitoriaId: number): FaunaType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const fauna = realmInstance.objects<FaunaType>('Fauna').filtered(query).slice();
    return JSON.parse(JSON.stringify(fauna)) as FaunaType[];
};

export const getFaunaDessincronizadas = (benfeitoriaId: number): FaunaType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const faunaQueue = realmInstance.objects<FaunaType>('Fauna').filtered(query).slice();
    return JSON.parse(JSON.stringify(faunaQueue)) as FaunaType[];
};

export const setIdBenfeitoriaFromApiOnFauna = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const faunaQueue = realmInstance.objects('Fauna').filtered(query);

        if (faunaQueue.length > 0) {
            realmInstance.write(() => {
                faunaQueue.forEach(faunaOrfan => {
                    faunaOrfan.benfeitoria = idBenfeitoriaApi;
                    faunaOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar fauna:', error);
    }
};

export const apagarFaunaQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const faunaExcluir = realmInstance.objects<FaunaType>('Fauna').filtered(query);
            if (faunaExcluir.length > 0) {
                realmInstance.delete(faunaExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir fauna da fila:', error);
    }
};
