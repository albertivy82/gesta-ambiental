import { realmInstance } from './databaseService';
import { AlimentacaoType } from '../../shared/types/AlimentacaoType';
import { AlimentacaoInput } from '../../shared/types/AlimentacaoInput';

export const salvarAlimentacao = (alimentacoes: AlimentacaoType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                alimentacoes.forEach(alimentacao => {
                    const alimentacaoRealm = realmInstance.objects('Alimentacao').filtered(`id == ${alimentacao.id}`)[0];
                    if (alimentacao.sincronizado && alimentacaoRealm && alimentacao.idLocal == '') {
                        const alimentacaoPadrao = {
                            ...alimentacao,
                            benfeitoria: alimentacao.benfeitoria.id,
                        };
                        realmInstance.create('Alimentacao', alimentacaoPadrao, true);
                    } else {
                        const alimentacaoPadrao = {
                            ...alimentacao,
                            benfeitoria: alimentacao.benfeitoria.id,
                        };
                        realmInstance.create('Alimentacao', alimentacaoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarAlimentacaoQueue = (alimentacao: AlimentacaoInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const alimentacaoPadrao = {
                    ...alimentacao,
                    id: Id(),
                    benfeitoria: alimentacao.benfeitoria?.id,
                };
                realmInstance.create('Alimentacao', alimentacaoPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getAlimentacoes = (benfeitoriaId: number): AlimentacaoType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const alimentacoes = realmInstance.objects<AlimentacaoType>('Alimentacao').filtered(query).slice();
    return JSON.parse(JSON.stringify(alimentacoes)) as AlimentacaoType[];
};

export const getAlimentacoesDessincronizadas = (benfeitoriaId: number): AlimentacaoType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const alimentacaoQueue = realmInstance.objects<AlimentacaoType>('Alimentacao').filtered(query).slice();
    return JSON.parse(JSON.stringify(alimentacaoQueue)) as AlimentacaoType[];
};

export const setIdBenfeitoriaFromApiOnAlimentacao = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const alimentacaoQueue = realmInstance.objects('Alimentacao').filtered(query);

        if (alimentacaoQueue.length > 0) {
            realmInstance.write(() => {
                alimentacaoQueue.forEach(alimentacaoOrfan => {
                    alimentacaoOrfan.benfeitoria = idBenfeitoriaApi;
                    alimentacaoOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar alimentação:', error);
    }
};

export const apagarAlimentacaoQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const alimentacaoExcluir = realmInstance.objects<AlimentacaoType>('Alimentacao').filtered(query);
            if (alimentacaoExcluir.length > 0) {
                realmInstance.delete(alimentacaoExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir alimentação da fila:', error);
    }
};
