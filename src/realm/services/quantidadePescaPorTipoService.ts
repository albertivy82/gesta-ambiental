
import { QuantidadePescaPorTipoType } from '../../shared/types/QuantidadePescaPorTipo';
import { realmInstance } from './databaseService';

export const salvarQuantidadePescaPorTipo = (quantidadesPescaPorTipo: QuantidadePescaPorTipoType[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                quantidadesPescaPorTipo.forEach(quantidadePescaPorTipo => {
                    const qtdpescaPTipo = {
                        ...quantidadePescaPorTipo,
                        pescaArtesanal: quantidadePescaPorTipo.pescaArtesanal.id
                    }
                    realmInstance.create('QuantidadePescaPorTipo', qtdpescaPTipo, true);
                });
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getPeixes = (pescaArtesanal: number): QuantidadePescaPorTipoType[] => {
    const query = `pescaArtesanal == ${pescaArtesanal}`;

    const QuantidadePescaPorTipoRealm = realmInstance.objects<QuantidadePescaPorTipoType>('QuantidadePescaPorTipo').filtered(query).slice();

    const QuantidadePescaPorTipoRealmCleaned = JSON.parse(JSON.stringify(QuantidadePescaPorTipoRealm));

    return QuantidadePescaPorTipoRealmCleaned as QuantidadePescaPorTipoType[];

}
