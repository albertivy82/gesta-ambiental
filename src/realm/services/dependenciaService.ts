import { DependenciaInput } from '../../shared/types/DependenciaIput';
import { DependenciaType } from '../../shared/types/DependenciasType';
import { realmInstance } from './databaseService';


export const salvarDependencias = (dependencias: DependenciaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                dependencias.forEach(dependencia => {
                    const dependenciaRealm = realmInstance.objects('Dependencia').filtered(`id == ${dependencia.id}`)[0];
                    if (dependencia.sincronizado && dependenciaRealm && dependencia.idLocal == '') {
                        const dependenciaPadrao = {
                            ...dependencia,
                            benfeitoria: dependencia.benfeitoria.id,
                        };
                        realmInstance.create('Dependencia', dependenciaPadrao, true);
                    } else {
                        const dependenciaPadrao = {
                            ...dependencia,
                            benfeitoria: dependencia.benfeitoria.id,
                        };
                        realmInstance.create('Dependencia', dependenciaPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarDependenciaQueue = (dependencia: DependenciaInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const dependenciaPadrao = {
                    ...dependencia,
                    id: Id(),
                    benfeitoria: dependencia.benfeitoria?.id,
                };
                realmInstance.create('Dependencia', dependenciaPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getDependencias = (benfeitoriaId: number): DependenciaType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const dependencias = realmInstance.objects<DependenciaType>('Dependencia').filtered(query).slice();
    return JSON.parse(JSON.stringify(dependencias)) as DependenciaType[];
};

export const getDependenciasDessincronizadas = (benfeitoriaId: number): DependenciaType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const dependenciaQueue = realmInstance.objects<DependenciaType>('Dependencia').filtered(query).slice();
    return JSON.parse(JSON.stringify(dependenciaQueue)) as DependenciaType[];
};

export const setIdBenfeitoriaFromApiOnDependencias = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const dependenciaQueue = realmInstance.objects('Dependencia').filtered(query);

        if (dependenciaQueue.length > 0) {
            realmInstance.write(() => {
                dependenciaQueue.forEach(dependenciaOrfan => {
                    dependenciaOrfan.benfeitoria = idBenfeitoriaApi;
                    dependenciaOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar dependências:', error);
    }
};

export const apagarDependenciaQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const dependenciaExcluir = realmInstance.objects<DependenciaType>('Dependencia').filtered(query);
            if (dependenciaExcluir.length > 0) {
                realmInstance.delete(dependenciaExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir dependência da fila:', error);
    }
};
