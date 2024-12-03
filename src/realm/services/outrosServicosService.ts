import { realmInstance } from './databaseService';
import { OutrosServicosInput } from '../../shared/types/OutrosServicosInput';
import { OutrosServicosType } from '../../shared/types/OutrosServicosType';

export const salvarOutrosServicos = (outrosServicos: OutrosServicosType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                outrosServicos.forEach(servico => {
                    const servicoRealm = realmInstance.objects('OutrosServicos').filtered(`id == ${servico.id}`)[0];

                    if (servico.sincronizado && servicoRealm && servico.idLocal === '') {
                        const servicoPadrao = {
                            ...servico,
                            imovel: servico.imovel.id,
                        };
                        realmInstance.create('OutrosServicos', servicoPadrao, true);
                    } else {
                        const servicoPadrao = {
                            ...servico,
                            imovel: servico.imovel.id,
                        };
                        realmInstance.create('OutrosServicos', servicoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarOutrosServicosQueue = (servico: OutrosServicosInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };

        try {
            realmInstance.write(() => {
                const servicoPadrao = {
                    ...servico,
                    id: Id(),
                    imovel: servico.imovel!.id,
                };

                realmInstance.create('OutrosServicos', servicoPadrao, true);
                console.log('salvarOutrosServicosQueue', servicoPadrao);
            });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getOutrosServicos = (imovel: number): OutrosServicosType[] => {
    const query = `imovel == ${imovel}`;
    const servicos = realmInstance.objects<OutrosServicosType>('OutrosServicos').filtered(query).slice();

    const cleanServicos = JSON.parse(JSON.stringify(servicos));
    console.log('getOutrosServicos', cleanServicos);

    return cleanServicos as OutrosServicosType[];
};

export const getAllOutrosServicos = (): OutrosServicosType[] => {
    const servicos = realmInstance.objects<OutrosServicosType>('OutrosServicos');
    const cleanServicos = JSON.parse(JSON.stringify(servicos));
    console.log('getAllOutrosServicos', cleanServicos);
    return cleanServicos as OutrosServicosType[];
};

export const getOutrosServicosDessincronizados = (idImovelApi: number): OutrosServicosType[] => {
    const query = `imovel == "${idImovelApi}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const servicosQueue = realmInstance.objects<OutrosServicosType>('OutrosServicos').filtered(query);

    const cleanedQueue = servicosQueue.map(servico => ({
        ...servico,
    }));

    console.log('getOutrosServicosDessincronizados', cleanedQueue);
    return cleanedQueue;
};

export const setIdImovelFromApiOtherServs = (idImovelApi: number, imovelIdLocal: string) => {
    try {
        const query = `idFather == "${imovelIdLocal}" AND sincronizado == false`;
        const servicoQueue = realmInstance.objects('OutrosServicos').filtered(query);

        if (servicoQueue.length > 0) {
            realmInstance.write(() => {
                servicoQueue.forEach(servicoOrfan => {
                    servicoOrfan.imovel = idImovelApi;
                    servicoOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar outros serviços:', error);
    }
};

export const apagarOutrosServicosQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const servicoExcluir = realmInstance.objects<OutrosServicosType>('OutrosServicos').filtered(query);

            if (servicoExcluir.length > 0) {
                realmInstance.delete(servicoExcluir);
            }
        });
        console.log('apagarOutrosServicosQueue');
    } catch (error) {
        console.error('Erro ao excluir outros serviços da fila:', error);
    }
};

export const apagarQueueOutrosServicos = () => {
    try {
        realmInstance.write(() => {
            const servicoExcluir = realmInstance.objects<OutrosServicosType>('OutrosServicos');

            if (servicoExcluir.length > 0) {
                realmInstance.delete(servicoExcluir);
                console.log(`${servicoExcluir.length} outros serviços excluídos com sucesso.`);
            } else {
                console.log('Nenhum outro serviço encontrado para exclusão.');
            }
        });
    } catch (error) {
        console.error('Erro ao excluir outros serviços da fila:', error);
    }
};
