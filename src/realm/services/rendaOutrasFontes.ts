import { realmInstance } from './databaseService';
import { RendaOutrasFontesInput } from '../../shared/types/RendaOutrasFontesInput';
import { RendaOutrasFontesType } from '../../shared/types/rendaOutrasFontes';


export const salvarRendaOutrasFontes = (rendas: RendaOutrasFontesType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                rendas.forEach(renda => {
                    const rendaRealm = realmInstance.objects('RendaOutrasFontes').filtered(`id == ${renda.id}`)[0];
                    if (renda.sincronizado && rendaRealm && renda.idLocal == '') {
                        const rendaPadrao = {
                            ...renda,
                            benfeitoria: renda.benfeitoria.id,
                        };
                        realmInstance.create('RendaOutrasFontes', rendaPadrao, true);
                    } else {
                        const rendaPadrao = {
                            ...renda,
                            benfeitoria: renda.benfeitoria.id,
                        };
                        realmInstance.create('RendaOutrasFontes', rendaPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarRendaOutrasFontesQueue = (renda: RendaOutrasFontesInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const rendaPadrao = {
                    ...renda,
                    id: Id(),
                    benfeitoria: renda.benfeitoria?.id,
                };
                realmInstance.create('RendaOutrasFontes', rendaPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getRendaOutrasFontes = (benfeitoriaId: number): RendaOutrasFontesType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const rendas = realmInstance.objects<RendaOutrasFontesType>('RendaOutrasFontes').filtered(query).slice();
    return JSON.parse(JSON.stringify(rendas)) as RendaOutrasFontesType[];
};

export const getRendaOutrasFontesDessincronizadas = (benfeitoriaId: number): RendaOutrasFontesType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const rendaQueue = realmInstance.objects<RendaOutrasFontesType>('RendaOutrasFontes').filtered(query).slice();
    return JSON.parse(JSON.stringify(rendaQueue)) as RendaOutrasFontesType[];
};

export const setIdBenfeitoriaFromApiOnRendasOF = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const rendaQueue = realmInstance.objects('RendaOutrasFontes').filtered(query);

        if (rendaQueue.length > 0) {
            realmInstance.write(() => {
                rendaQueue.forEach(rendaOrfan => {
                    rendaOrfan.benfeitoria = idBenfeitoriaApi;
                    rendaOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar registros de renda:', error);
    }
};

export const apagarRendaOutrasFontesQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const rendaExcluir = realmInstance.objects<RendaOutrasFontesType>('RendaOutrasFontes').filtered(query);
            if (rendaExcluir.length > 0) {
                realmInstance.delete(rendaExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir renda da fila:', error);
    }
};
