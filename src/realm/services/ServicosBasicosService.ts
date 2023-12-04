import { ServicosBasicosType } from '../../shared/types/ServicosBasicosType';
import { realmInstance } from './databaseService';

export const salvarServicosBasicos = (servicos: ServicosBasicosType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                servicos.forEach(servico => {
                    realmInstance.create('ServicosBasicos', servico, true);
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getServicosBasicosPorBenfeitoria = (imovel: number): ServicosBasicosType[] => {
    const query = `imovel == ${imovel}`;

    const servicos = realmInstance.objects<ServicosBasicosType>('ServicosBasicos').filtered(query).slice();

    const cleanServicos = JSON.parse(JSON.stringify(servicos));

    return cleanServicos as ServicosBasicosType[];
};
