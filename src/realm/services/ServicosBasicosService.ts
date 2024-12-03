import { realmInstance } from './databaseService';
import { ServicosBasicosInput } from '../../shared/types/ServicosBasicosInput';
import { ServicosBasicosType } from '../../shared/types/ServicosBasicosType';

export const salvarServicosBasicos = (servicos: ServicosBasicosType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                servicos.forEach(servico => {
                    const servicoRealm = realmInstance.objects('ServicosBasicos').filtered(`id == ${servico.id}`)[0];

                    if (servico.sincronizado && servicoRealm && servico.idLocal === '') {
                        const servicoPadrao = {
                            ...servico,
                            imovel: servico.imovel.id,
                        };
                        realmInstance.create('ServicosBasicos', servicoPadrao, true);
                    } else {
                        const servicoPadrao = {
                            ...servico,
                            imovel: servico.imovel.id,
                        };
                        realmInstance.create('ServicosBasicos', servicoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarServicosBasicosQueue = (servico: ServicosBasicosInput) => {
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

                realmInstance.create('ServicosBasicos', servicoPadrao, true);
                console.log('salvarServicosBasicosQueue', servicoPadrao);
            });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getServicosBasicos = (imovel: number): ServicosBasicosType[] => {
    const query = `imovel == ${imovel}`;
    const servicos = realmInstance.objects<ServicosBasicosType>('ServicosBasicos').filtered(query).slice();

    const cleanServicos = JSON.parse(JSON.stringify(servicos));
    console.log('getServicosBasicos', cleanServicos);

    return cleanServicos as ServicosBasicosType[];
};

export const getAllServicosBasicos = (): ServicosBasicosType[] => {
    const servicos = realmInstance.objects<ServicosBasicosType>('ServicosBasicos');
    const cleanServicos = JSON.parse(JSON.stringify(servicos));
    console.log('getAllServicosBasicos', cleanServicos);
    return cleanServicos as ServicosBasicosType[];
};

export const getServicosBasicosDessincronizados = (idImovelApi: number): ServicosBasicosType[] => {
    const query = `imovel == "${idImovelApi}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const servicosQueue = realmInstance.objects<ServicosBasicosType>('ServicosBasicos').filtered(query);

    const cleanedQueue = servicosQueue.map(servico => ({
        ...servico,
    }));

    console.log('getServicosBasicosDessincronizados', cleanedQueue);
    return cleanedQueue;
};

export const setIdImovelFromApiServsBsics = (idImovelApi: number, imovelIdLocal: string) => {
    try {
        const query = `idFather == "${imovelIdLocal}" AND sincronizado == false`;
        const servicoQueue = realmInstance.objects('ServicosBasicos').filtered(query);

        if (servicoQueue.length > 0) {
            realmInstance.write(() => {
                servicoQueue.forEach(servicoOrfan => {
                    servicoOrfan.imovel = idImovelApi;
                    servicoOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar serviços básicos:', error);
    }
};

export const apagarServicosBasicosQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const servicoExcluir = realmInstance.objects<ServicosBasicosType>('ServicosBasicos').filtered(query);

            if (servicoExcluir.length > 0) {
                realmInstance.delete(servicoExcluir);
            }
        });
        console.log('apagarServicosBasicosQueue');
    } catch (error) {
        console.error('Erro ao excluir serviços básicos da fila:', error);
    }
};

export const apagarQueueServicosBasicos = () => {
    try {
        realmInstance.write(() => {
            const servicoExcluir = realmInstance.objects<ServicosBasicosType>('ServicosBasicos');

            if (servicoExcluir.length > 0) {
                realmInstance.delete(servicoExcluir);
                console.log(`${servicoExcluir.length} serviços básicos excluídos com sucesso.`);
            } else {
                console.log('Nenhum serviço básico encontrado para exclusão.');
            }
        });
    } catch (error) {
        console.error('Erro ao excluir serviços básicos da fila:', error);
    }
};
