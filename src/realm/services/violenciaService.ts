import { realmInstance } from './databaseService';
import { ViolenciaInput } from '../../shared/types/ViolenciaInput';
import { ViolenciaType } from '../../shared/types/ViolenciaType';

export const salvarViolencias = (violencias: ViolenciaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                violencias.forEach(violencia => {
                    const violenciaRealm = realmInstance.objects('Violencia').filtered(`id == ${violencia.id}`)[0];
                    if (violencia.sincronizado && violenciaRealm && violencia.idLocal == '') {
                        const violenciaPadrao = {
                            ...violencia,
                            benfeitoria: violencia.benfeitoria.id,
                        };
                        realmInstance.create('Violencia', violenciaPadrao, true);
                    } else {
                        const violenciaPadrao = {
                            ...violencia,
                            benfeitoria: violencia.benfeitoria.id,
                        };
                        realmInstance.create('Violencia', violenciaPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarViolenciaQueue = (violencia: ViolenciaInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const violenciaPadrao = {
                    ...violencia,
                    id: Id(),
                    benfeitoria: violencia.benfeitoria?.id,
                };
                realmInstance.create('Violencia', violenciaPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getViolencias = (benfeitoriaId: number): ViolenciaType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const violencias = realmInstance.objects<ViolenciaType>('Violencia').filtered(query).slice();
    return JSON.parse(JSON.stringify(violencias)) as ViolenciaType[];
};

export const getViolenciasDessincronizadas = (benfeitoriaId: number): ViolenciaType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const violenciaQueue = realmInstance.objects<ViolenciaType>('Violencia').filtered(query).slice();
    return JSON.parse(JSON.stringify(violenciaQueue)) as ViolenciaType[];
};

export const setIdBenfeitoriaFromApiOnViolencia = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const violenciaQueue = realmInstance.objects('Violencia').filtered(query);

        if (violenciaQueue.length > 0) {
            realmInstance.write(() => {
                violenciaQueue.forEach(violenciaOrfan => {
                    violenciaOrfan.benfeitoria = idBenfeitoriaApi;
                    violenciaOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar registros de violência:', error);
    }
};

export const apagarViolenciaQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const violenciaExcluir = realmInstance.objects<ViolenciaType>('Violencia').filtered(query);
            if (violenciaExcluir.length > 0) {
                realmInstance.delete(violenciaExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir violência da fila:', error);
    }
};
