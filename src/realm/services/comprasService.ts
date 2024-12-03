import { realmInstance } from './databaseService';
import { ComprasType } from '../../shared/types/ComprasType';
import { ComprasInput } from '../../shared/types/ComprasInput';

export const salvarCompras = (compras: ComprasType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                compras.forEach(compra => {
                    const compraRealm = realmInstance.objects('Compras').filtered(`id == ${compra.id}`)[0];
                    if (compra.sincronizado && compraRealm && compra.idLocal == '') {
                        const compraPadrao = {
                            ...compra,
                            benfeitoria: compra.benfeitoria.id,
                        };
                        realmInstance.create('Compras', compraPadrao, true);
                    } else {
                        const compraPadrao = {
                            ...compra,
                            benfeitoria: compra.benfeitoria.id,
                        };
                        realmInstance.create('Compras', compraPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarCompraQueue = (compra: ComprasInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };
        try {
            realmInstance.write(() => {
                const compraPadrao = {
                    ...compra,
                    id: Id(),
                    benfeitoria: compra.benfeitoria?.id,
                };
                realmInstance.create('Compras', compraPadrao, true);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getCompras = (benfeitoriaId: number): ComprasType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const compras = realmInstance.objects<ComprasType>('Compras').filtered(query).slice();
    return JSON.parse(JSON.stringify(compras)) as ComprasType[];
};

export const getComprasDessincronizadas = (benfeitoriaId: number): ComprasType[] => {
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const comprasQueue = realmInstance.objects<ComprasType>('Compras').filtered(query).slice();
    return JSON.parse(JSON.stringify(comprasQueue)) as ComprasType[];
};

export const setIdBenfeitoriaFromApiCompras = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const comprasQueue = realmInstance.objects('Compras').filtered(query);

        if (comprasQueue.length > 0) {
            realmInstance.write(() => {
                comprasQueue.forEach(compraOrfan => {
                    compraOrfan.benfeitoria = idBenfeitoriaApi;
                    compraOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar compras:', error);
    }
};

export const apagarCompraQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const compraExcluir = realmInstance.objects<ComprasType>('Compras').filtered(query);
            if (compraExcluir.length > 0) {
                realmInstance.delete(compraExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir compra da fila:', error);
    }
};
