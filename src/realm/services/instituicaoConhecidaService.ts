import { realmInstance } from './databaseService';
import { InstituicaoConhecidaInput } from '../../shared/types/InstituicaoConhecidaInput';
import { InstituicaoConhecidaType } from '../../shared/types/InstituicaoConhecidaType';

export const salvarInstituicoesConhecidas = (instituicoes: InstituicaoConhecidaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                instituicoes.forEach(instituicao => {
                    const instituicaoRealm = realmInstance.objects('InstituicoesConhecidas').filtered(`id == ${instituicao.id}`)[0];
                    if (instituicao.sincronizado && instituicaoRealm && instituicao.idLocal == '') {
                        const instituicaoPadrao = {
                            ...instituicao,
                            benfeitoria: instituicao.benfeitoria.id,
                        };
                        realmInstance.create('InstituicoesConhecidas', instituicaoPadrao, true);
                    } else {
                        const instituicaoPadrao = {
                            ...instituicao,
                            benfeitoria: instituicao.benfeitoria.id,
                        };
                        realmInstance.create('InstituicoesConhecidas', instituicaoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarInstituicaoConhecidaQueue = (instituicao: InstituicaoConhecidaInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const instituicaoPadrao = {
                    ...instituicao,
                    id: Id(),
                    benfeitoria: instituicao.benfeitoria?.id,
                };
                realmInstance.create('InstituicoesConhecidas', instituicaoPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getInstituicoesConhecidas = (benfeitoriaId: number): InstituicaoConhecidaType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const instituicoes = realmInstance.objects<InstituicaoConhecidaType>('InstituicoesConhecidas').filtered(query).slice();
    return JSON.parse(JSON.stringify(instituicoes)) as InstituicaoConhecidaType[];
};

export const getInstituicoesConhecidasDessincronizadas = (benfeitoriaId: number): InstituicaoConhecidaType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const instituicoesQueue = realmInstance.objects<InstituicaoConhecidaType>('InstituicoesConhecidas').filtered(query).slice();
    return JSON.parse(JSON.stringify(instituicoesQueue)) as InstituicaoConhecidaType[];
};

export const setIdBenfeitoriaFromApiOnIstConheci = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const instituicoesQueue = realmInstance.objects('InstituicoesConhecidas').filtered(query);

        if (instituicoesQueue.length > 0) {
            realmInstance.write(() => {
                instituicoesQueue.forEach(instituicaoOrfan => {
                    instituicaoOrfan.benfeitoria = idBenfeitoriaApi;
                    instituicaoOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar instituições conhecidas:', error);
    }
};

export const apagarInstituicaoConhecidaQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const instituicaoExcluir = realmInstance.objects<InstituicaoConhecidaType>('InstituicoesConhecidas').filtered(query);
            if (instituicaoExcluir.length > 0) {
                realmInstance.delete(instituicaoExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir instituição conhecida da fila:', error);
    }
};
