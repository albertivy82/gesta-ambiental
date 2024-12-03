import { realmInstance } from './databaseService';
import { MamiferosInput } from '../../shared/types/MamiferosInput';
import { MamiferosType } from '../../shared/types/MamiferosType';

export const salvarMamiferos = (mamiferos: MamiferosType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                mamiferos.forEach(mamifero => {
                    const mamiferoRealm = realmInstance.objects('Mamiferos').filtered(`id == ${mamifero.id}`)[0];
                    if (mamifero.sincronizado && mamiferoRealm && mamifero.idLocal == '') {
                        const mamiferoPadrao = {
                            ...mamifero,
                            benfeitoria: mamifero.benfeitoria.id,
                        };
                        realmInstance.create('Mamiferos', mamiferoPadrao, true);
                    } else {
                        const mamiferoPadrao = {
                            ...mamifero,
                            benfeitoria: mamifero.benfeitoria.id,
                        };
                        realmInstance.create('Mamiferos', mamiferoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarMamiferoQueue = (mamifero: MamiferosInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const mamiferoPadrao = {
                    ...mamifero,
                    id: Id(),
                    benfeitoria: mamifero.benfeitoria?.id,
                };
                realmInstance.create('Mamiferos', mamiferoPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getMamiferos = (benfeitoriaId: number): MamiferosType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const mamiferos = realmInstance.objects<MamiferosType>('Mamiferos').filtered(query).slice();
    return JSON.parse(JSON.stringify(mamiferos)) as MamiferosType[];
};

export const getMamiferosDessincronizados = (benfeitoriaId: number): MamiferosType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const mamiferosQueue = realmInstance.objects<MamiferosType>('Mamiferos').filtered(query).slice();
    return JSON.parse(JSON.stringify(mamiferosQueue)) as MamiferosType[];
};

export const setIdBenfeitoriaFromApiOnMamiferos = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const mamiferosQueue = realmInstance.objects('Mamiferos').filtered(query);

        if (mamiferosQueue.length > 0) {
            realmInstance.write(() => {
                mamiferosQueue.forEach(mamiferoOrfan => {
                    mamiferoOrfan.benfeitoria = idBenfeitoriaApi;
                    mamiferoOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar mamíferos:', error);
    }
};

export const apagarMamiferoQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const mamiferoExcluir = realmInstance.objects<MamiferosType>('Mamiferos').filtered(query);
            if (mamiferoExcluir.length > 0) {
                realmInstance.delete(mamiferoExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir mamífero da fila:', error);
    }
};
