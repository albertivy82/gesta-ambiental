import { realmInstance } from './databaseService';
import { PeixesInput } from '../../shared/types/PeixesInput';
import { PeixesType } from '../../shared/types/PeixesType';

export const salvarPeixes = (peixes: PeixesType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                peixes.forEach(peixe => {
                    const peixeRealm = realmInstance.objects('Peixes').filtered(`id == ${peixe.id}`)[0];
                    if (peixe.sincronizado && peixeRealm && peixe.idLocal == '') {
                        const peixePadrao = {
                            ...peixe,
                            benfeitoria: peixe.benfeitoria.id,
                        };
                        realmInstance.create('Peixes', peixePadrao, true);
                    } else {
                        const peixePadrao = {
                            ...peixe,
                            benfeitoria: peixe.benfeitoria.id,
                        };
                        realmInstance.create('Peixes', peixePadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarPeixeQueue = (peixe: PeixesInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const peixePadrao = {
                    ...peixe,
                    id: Id(),
                    benfeitoria: peixe.benfeitoria?.id,
                };
                realmInstance.create('Peixes', peixePadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getPeixes = (benfeitoriaId: number): PeixesType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const peixes = realmInstance.objects<PeixesType>('Peixes').filtered(query).slice();
    return JSON.parse(JSON.stringify(peixes)) as PeixesType[];
};

export const getPeixesDessincronizados = (benfeitoriaId: number): PeixesType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const peixesQueue = realmInstance.objects<PeixesType>('Peixes').filtered(query).slice();
    return JSON.parse(JSON.stringify(peixesQueue)) as PeixesType[];
};

export const setIdBenfeitoriaFromApiOnPeixes = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const peixesQueue = realmInstance.objects('Peixes').filtered(query);

        if (peixesQueue.length > 0) {
            realmInstance.write(() => {
                peixesQueue.forEach(peixeOrfan => {
                    peixeOrfan.benfeitoria = idBenfeitoriaApi;
                    peixeOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar peixes:', error);
    }
};

export const apagarPeixeQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const peixeExcluir = realmInstance.objects<PeixesType>('Peixes').filtered(query);
            if (peixeExcluir.length > 0) {
                realmInstance.delete(peixeExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir peixe da fila:', error);
    }
};
